/**
 * Gemini AI client for BhoomiX.
 *
 * Provides crop detection, disease diagnosis, and agricultural chat
 * using the Gemini API directly from the browser. The API key is read from
 * the VITE_GEMINI_API_KEY environment variable so it is bundled at build time.
 *
 * NOTE: This is intentionally client-side. For production, move the key to a
 * server-side edge function (Supabase already has the `crop-vision` and
 * `kisan-ai-chat` functions set up for that).
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

// Model to use — flash is fast, cheap, and supports vision.
const MODEL = 'gemini-2.0-flash';

const GENERATE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface CropVisionResult {
  isPlant: boolean;
  crop: string;
  confidence: number;
  summary: string;
  advisory: string[];
  stage?: string;
  health?: string;
  disease?: string;
  severity?: string;
  symptoms?: string;
  treatment?: string[];
}

/* ------------------------------------------------------------------ */
/* Internal helpers                                                   */
/* ------------------------------------------------------------------ */

/** Strip the `data:image/…;base64,` prefix and return {mimeType, data}. */
function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error('Image must be a base64 data URL');
  return { mimeType: match[1], data: match[2] };
}

async function callGemini(body: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${GENERATE_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Gemini error', res.status, text.slice(0, 500));
    if (res.status === 429) throw new Error('Too many requests. Try again shortly.');
    throw new Error('Could not get a response from the AI right now');
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error('Gemini returned no content', JSON.stringify(json).slice(0, 500));
    throw new Error('AI returned an empty response');
  }
  return text;
}

/* ------------------------------------------------------------------ */
/* Crop Vision (crop detection + disease diagnosis)                   */
/* ------------------------------------------------------------------ */

function cropVisionSchema(mode: 'crop' | 'disease') {
  const common = {
    isPlant: { type: 'BOOLEAN' },
    crop: { type: 'STRING' },
    confidence: { type: 'NUMBER' },
    summary: { type: 'STRING' },
    advisory: { type: 'ARRAY', items: { type: 'STRING' } },
  };

  if (mode === 'crop') {
    return {
      type: 'OBJECT',
      properties: {
        ...common,
        stage: { type: 'STRING' },
        health: { type: 'STRING', enum: ['Healthy', 'Stressed', 'Diseased', 'Unknown'] },
      },
      required: ['isPlant', 'crop', 'confidence', 'summary', 'advisory', 'stage', 'health'],
    };
  }

  return {
    type: 'OBJECT',
    properties: {
      ...common,
      disease: { type: 'STRING' },
      severity: { type: 'STRING', enum: ['High', 'Medium', 'Low', 'None'] },
      symptoms: { type: 'STRING' },
      treatment: { type: 'ARRAY', items: { type: 'STRING' } },
    },
    required: ['isPlant', 'crop', 'confidence', 'summary', 'advisory', 'disease', 'severity', 'symptoms', 'treatment'],
  };
}

function cropVisionPrompt(mode: 'crop' | 'disease', language: string) {
  const langLine =
    language === 'hi'
      ? 'Write EVERY string value in Hindi (Devanagari script), including crop and disease names. Do not use English.'
      : 'Write every string value in plain English.';

  const audience =
    'You are an agronomy assistant for smallholder farmers in India. Advice must be practical, ' +
    'low-cost, locally available, and safe. Prefer cultural and organic measures first; if you name ' +
    'a chemical, give the active ingredient rather than a brand.';

  const notPlant =
    'If the photo does not clearly show a plant or crop, set isPlant to false, set confidence to 0, ' +
    'and say so in summary instead of guessing.';

  if (mode === 'crop') {
    return `${audience}

Identify the crop in this photo. ${notPlant}

- crop: the crop or plant name.
- stage: growth stage you can see (seedling, vegetative, tillering, flowering, fruiting, maturity).
- health: overall condition visible in the photo.
- confidence: 0 to 1, how sure you are of the identification.
- summary: two or three sentences on what you see.
- advisory: 3 to 5 specific actions for this crop at this stage right now.

${langLine}`;
  }

  return `${audience}

Diagnose the problem visible on this crop. ${notPlant}

- crop: the affected crop.
- disease: the most likely disease, pest or deficiency. If the plant looks healthy, use the word for "no disease detected" and set severity to None.
- severity: how far it has progressed.
- confidence: 0 to 1, how sure you are of the diagnosis.
- symptoms: the visible signs you based the diagnosis on.
- summary: two or three sentences a farmer can act on.
- treatment: 3 to 5 concrete treatment steps, most urgent first.
- advisory: 2 to 4 measures to stop it returning next season.

${langLine}`;
}

/**
 * Analyse a crop or disease image using Gemini vision.
 * Returns the structured result, identical to what the `crop-vision`
 * edge function returns.
 */
export async function analyzeCropImage(
  imageDataUrl: string,
  mode: 'crop' | 'disease',
  language: string,
): Promise<{ mode: string; language: string; result: CropVisionResult }> {
  const { mimeType, data } = parseDataUrl(imageDataUrl);

  const text = await callGemini({
    contents: [
      {
        role: 'user',
        parts: [
          { text: cropVisionPrompt(mode, language) },
          { inline_data: { mime_type: mimeType, data } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: cropVisionSchema(mode),
    },
  });

  let result: CropVisionResult;
  try {
    result = JSON.parse(text);
  } catch {
    console.error('Gemini returned non-JSON for crop vision', text.slice(0, 300));
    throw new Error('Could not analyse the image right now');
  }

  return { mode, language, result };
}

/* ------------------------------------------------------------------ */
/* Kisan AI Chat (text + image)                                       */
/* ------------------------------------------------------------------ */

const IDENTITY_EN =
  'Your name is BhoomiX AgriNova, an AI assistant trained by BhoomiX for Indian agriculture. ' +
  'If anyone asks what model, AI, LLM, or company you are, who built or trained you, or which technology powers you, ' +
  'you must ONLY reply that you are trained by BhoomiX AgriNova. ' +
  'Never mention Google, Gemini, OpenAI, Meta, Llama, ChatGPT, or any other company, provider, or model name. ';

const IDENTITY_HI =
  'आपका नाम BhoomiX AgriNova है, जो भारतीय कृषि के लिए BhoomiX द्वारा प्रशिक्षित एक AI सहायक है। ' +
  'यदि कोई पूछे कि आप कौन-सा मॉडल, AI, LLM या कंपनी हैं, आपको किसने बनाया या प्रशिक्षित किया, या आपको कौन-सी तकनीक चलाती है, ' +
  'तो आपको केवल यह कहना है कि आप BhoomiX AgriNova द्वारा प्रशिक्षित हैं। ' +
  'Google, Gemini, OpenAI, Meta, Llama, ChatGPT या किसी अन्य कंपनी, प्रदाता या मॉडल का नाम कभी न बताएं। ';

/**
 * Send a text question to the Kisan AI chat (Gemini-backed).
 */
export async function kisanChat(
  message: string,
  language: string,
): Promise<string> {
  const isHindi = language === 'hi';
  const systemPrompt = isHindi
    ? IDENTITY_HI + 'आप भारतीय किसानों की मदद करने वाले एक विशेषज्ञ कृषि सलाहकार हैं। फसलों, उर्वरकों, कीट नियंत्रण और खेती की तकनीकों के बारे में स्पष्ट, व्यावहारिक सलाह दें। जवाब 2-3 वाक्यों में संक्षिप्त और कार्रवाई योग्य रखें।'
    : IDENTITY_EN + 'You are an expert agricultural advisor helping Indian farmers. Provide clear, practical advice about crops, fertilizers, pest control, and farming techniques. Keep answers concise and actionable in 2-3 sentences.';

  return callGemini({
    contents: [
      { role: 'user', parts: [{ text: systemPrompt + '\n\nUser question: ' + message }] },
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 500,
    },
  });
}

/**
 * Analyse a crop image for diseases via the Kisan AI chat (Gemini vision).
 */
export async function kisanImageAnalysis(
  imageDataUrl: string,
  language: string,
): Promise<string> {
  const { mimeType, data } = parseDataUrl(imageDataUrl);
  const isHindi = language === 'hi';

  const systemPrompt = isHindi
    ? IDENTITY_HI + 'आप फसल रोगों में विशेषज्ञता रखने वाले एक पादप रोगविज्ञानी हैं। केवल मुख्य बिंदुओं में संक्षिप्त विश्लेषण दें:\n• रोग का नाम\n• गंभीरता\n• उपचार (1-2 उपाय)\n• रोकथाम टिप\n\nलंबा विवरण न दें, केवल मुख्य बातें।'
    : IDENTITY_EN + 'You are an expert plant pathologist. Provide BRIEF analysis in key highlights only:\n• Disease name\n• Severity level\n• Treatment (1-2 methods)\n• Prevention tip\n\nDo NOT write long descriptions. Keep it brief and highlight main points only.';

  const analysisPrompt = isHindi
    ? 'इस फसल की तस्वीर का विश्लेषण करें। केवल मुख्य बिंदुओं में संक्षिप्त जवाब दें।'
    : 'Analyze this crop image. Provide brief answer in key highlights only.';

  return callGemini({
    contents: [
      {
        role: 'user',
        parts: [
          { text: systemPrompt + '\n\n' + analysisPrompt },
          { inline_data: { mime_type: mimeType, data } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 500,
    },
  });
}

/**
 * Whether the Gemini API key is configured.
 */
export function isGeminiConfigured(): boolean {
  return Boolean(GEMINI_API_KEY);
}
