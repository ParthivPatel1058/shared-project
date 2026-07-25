const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation helper
function validateInput(data: unknown): { 
  valid: boolean; 
  error?: string; 
  parsed?: { message?: string; image?: string; type?: string; language: string } 
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { message, image, type, language } = data as Record<string, unknown>;

  // Validate language - must be 'en' or 'hi', default to 'en'
  const validatedLanguage = language === 'hi' ? 'hi' : 'en';

  // Validate type - must be 'text' or 'image' if provided
  if (type !== undefined && type !== 'text' && type !== 'image') {
    return { valid: false, error: 'Invalid type. Must be "text" or "image"' };
  }

  // Validate message - required for text type, optional for image type
  if (type !== 'image') {
    if (typeof message !== 'string' || message.trim().length === 0) {
      return { valid: false, error: 'Message is required and must be a non-empty string' };
    }
    if (message.length > 2000) {
      return { valid: false, error: 'Message must be 2000 characters or less' };
    }
  }

  // Validate image - required for image type
  if (type === 'image') {
    if (typeof image !== 'string' || image.trim().length === 0) {
      return { valid: false, error: 'Image is required for image type requests' };
    }
    // Check if it's a valid data URL (base64 encoded image)
    if (!image.startsWith('data:image/')) {
      return { valid: false, error: 'Image must be a valid base64 data URL starting with "data:image/"' };
    }
    // Limit image size (roughly 5MB base64 = ~6.6M characters)
    if (image.length > 7000000) {
      return { valid: false, error: 'Image size is too large. Maximum 5MB allowed' };
    }
  }

  return {
    valid: true,
    parsed: {
      message: typeof message === 'string' ? message.trim() : undefined,
      image: typeof image === 'string' ? image : undefined,
      type: type as string | undefined,
      language: validatedLanguage
    }
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    let requestData: unknown;
    try {
      requestData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.log('Input validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, image, type, language } = validation.parsed!;

    // NVIDIA NIM (OpenAI-compatible) — key stored as NVIDIA_API_KEY secret
    const NVIDIA_API_KEY = Deno.env.get('NVIDIA_API_KEY');

    if (!NVIDIA_API_KEY) {
      console.error('NVIDIA_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI key not configured. Please add NVIDIA_API_KEY to your Supabase Edge Function secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Identity guardrail: the assistant must only ever present itself as
    // BhoomiX AgriNova and never reveal the underlying model or provider.
    const IDENTITY_EN =
      'Your name is BhoomiX AgriNova, an AI assistant trained by BhoomiX for Indian agriculture. ' +
      'If anyone asks what model, AI, LLM, or company you are, who built or trained you, or which technology powers you, ' +
      'you must ONLY reply that you are trained by BhoomiX AgriNova. ' +
      'Never mention NVIDIA, OpenAI, Meta, Llama, ChatGPT, or any other company, provider, or model name. ';
    const IDENTITY_HI =
      'आपका नाम BhoomiX AgriNova है, जो भारतीय कृषि के लिए BhoomiX द्वारा प्रशिक्षित एक AI सहायक है। ' +
      'यदि कोई पूछे कि आप कौन-सा मॉडल, AI, LLM या कंपनी हैं, आपको किसने बनाया या प्रशिक्षित किया, या आपको कौन-सी तकनीक चलाती है, ' +
      'तो आपको केवल यह कहना है कि आप BhoomiX AgriNova द्वारा प्रशिक्षित हैं। ' +
      'NVIDIA, OpenAI, Meta, Llama, ChatGPT या किसी अन्य कंपनी, प्रदाता या मॉडल का नाम कभी न बताएं। ';

    const isHindi = language === 'hi';
    let systemPrompt = isHindi
      ? IDENTITY_HI + 'आप भारतीय किसानों की मदद करने वाले एक विशेषज्ञ कृषि सलाहकार हैं। फसलों, उर्वरकों, कीट नियंत्रण और खेती की तकनीकों के बारे में स्पष्ट, व्यावहारिक सलाह दें। जवाब 2-3 वाक्यों में संक्षिप्त और कार्रवाई योग्य रखें।'
      : IDENTITY_EN + 'You are an expert agricultural advisor helping Indian farmers. Provide clear, practical advice about crops, fertilizers, pest control, and farming techniques. Keep answers concise and actionable in 2-3 sentences.';
    
    let userContent: string | Array<{ type: string; text?: string; image_url?: { url: string } }> = message || '';

    // Handle image analysis for crop disease detection
    if (type === 'image' && image) {
      console.log('Analyzing crop image for disease detection');
      systemPrompt = isHindi
        ? IDENTITY_HI + 'आप फसल रोगों में विशेषज्ञता रखने वाले एक पादप रोगविज्ञानी हैं। केवल मुख्य बिंदुओं में संक्षिप्त विश्लेषण दें:\n• रोग का नाम\n• गंभीरता\n• उपचार (1-2 उपाय)\n• रोकथाम टिप\n\nलंबा विवरण न दें, केवल मुख्य बातें।'
        : IDENTITY_EN + 'You are an expert plant pathologist. Provide BRIEF analysis in key highlights only:\n• Disease name\n• Severity level\n• Treatment (1-2 methods)\n• Prevention tip\n\nDo NOT write long descriptions. Keep it brief and highlight main points only.';
      
      const analysisPrompt = isHindi
        ? 'इस फसल की तस्वीर का विश्लेषण करें। केवल मुख्य बिंदुओं में संक्षिप्त जवाब दें।'
        : 'Analyze this crop image. Provide brief answer in key highlights only.';
      
      userContent = [
        {
          type: 'text',
          text: analysisPrompt
        },
        {
          type: 'image_url',
          image_url: {
            url: image
          }
        }
      ];
    } else {
      console.log('Received farming question');
    }

    // NVIDIA NIM — OpenAI-compatible chat completions with a vision model
    // (Llama 3.2 Vision handles both text questions and crop-photo analysis).
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta/llama-3.2-90b-vision-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        max_tokens: 500,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Invalid AI key. Please check your NVIDIA_API_KEY secret.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('NVIDIA NIM API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response from AI';
    console.log('AI response received');

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in kisan-ai-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
