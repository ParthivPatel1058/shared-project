-- =============================================================
-- Housekeeping: remove abandoned tables, seed the schemes catalogue.
-- =============================================================

-- ─── 1. Drop abandoned tables ────────────────────────────────
-- Three tables created in the Supabase table editor and never used: two
-- columns each (id, created_at), zero rows, no foreign keys in either
-- direction. They had RLS on with no policies, so they were already
-- unreachable — but they still appear in generated types and in every schema
-- listing, which makes the real schema harder to read.
DROP TABLE IF EXISTS public."BHOOMix ai";
DROP TABLE IF EXISTS public."BHoomix partner website";
DROP TABLE IF EXISTS public."booomixspace";


-- ─── 2. Scheme catalogue ─────────────────────────────────────
-- The app ships these bundled so it works offline and on first paint, but
-- keeping the table populated means a scheme's link or eligibility text can be
-- corrected without a redeploy — government portals change URLs often.
INSERT INTO public.schemes
  (id, name, name_hi, description, description_hi, eligibility, eligibility_hi,
   benefits, benefits_hi, link, category, state)
VALUES
  ('pm-kisan', 'PM-KISAN', 'पीएम-किसान',
   'Income support of Rs 6,000 per year to all landholding farmer families, paid in three equal instalments.',
   'सभी भूमिधारक किसान परिवारों को प्रति वर्ष 6,000 रुपये की आय सहायता, तीन समान किस्तों में।',
   'All landholding farmer families with cultivable land. Institutional landholders and income-tax payers are excluded.',
   'खेती योग्य भूमि वाले सभी किसान परिवार। संस्थागत भूमिधारक और आयकरदाता शामिल नहीं।',
   'Rs 6,000 per year direct to the bank account.', 'प्रति वर्ष 6,000 रुपये सीधे बैंक खाते में।',
   'https://pmkisan.gov.in/', 'income', NULL),

  ('pmfby', 'Pradhan Mantri Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना',
   'Crop insurance against natural calamities, pests and disease, with a low farmer premium share.',
   'प्राकृतिक आपदा, कीट और रोग के विरुद्ध फसल बीमा, किसान का प्रीमियम हिस्सा बहुत कम।',
   'All farmers growing notified crops, including sharecroppers and tenant farmers.',
   'अधिसूचित फसल उगाने वाले सभी किसान, बटाईदार और किरायेदार किसान भी।',
   'Farmer pays 2% for kharif, 1.5% for rabi, 5% for commercial crops. Report loss within 72 hours.',
   'किसान खरीफ के लिए 2%, रबी के लिए 1.5%, व्यावसायिक फसल के लिए 5% देता है। नुकसान 72 घंटे में बताएं।',
   'https://pmfby.gov.in/', 'insurance', NULL),

  ('kcc', 'Kisan Credit Card', 'किसान क्रेडिट कार्ड',
   'Short-term credit for cultivation costs at a subsidised interest rate.',
   'खेती के खर्च के लिए रियायती ब्याज दर पर अल्पकालिक ऋण।',
   'All farmers, tenant farmers, oral lessees and sharecroppers.',
   'सभी किसान, किरायेदार किसान, मौखिक पट्टेदार और बटाईदार।',
   'Credit up to Rs 3 lakh at 7% interest, reduced to 4% on timely repayment.',
   '3 लाख रुपये तक का ऋण 7% ब्याज पर, समय पर चुकाने पर 4%।',
   'https://www.myscheme.gov.in/schemes/kcc', 'credit', NULL),

  ('soil-health-card', 'Soil Health Card Scheme', 'मृदा स्वास्थ्य कार्ड योजना',
   'Free soil testing with a crop-wise nutrient recommendation, issued every two years.',
   'फसल-वार पोषक तत्व सिफारिश के साथ नि:शुल्क मृदा परीक्षण, हर दो साल में।',
   'All farmers holding agricultural land.', 'कृषि भूमि वाले सभी किसान।',
   'Free soil analysis and fertiliser recommendations, reducing input cost.',
   'नि:शुल्क मृदा विश्लेषण और उर्वरक सिफारिश, लागत कम करती है।',
   'https://www.soilhealth.dac.gov.in/', 'inputs', NULL),

  ('pm-kusum', 'PM-KUSUM', 'पीएम-कुसुम',
   'Subsidy for solar pumps and grid-connected solar plants on farmland.',
   'सौर पंप और खेत पर ग्रिड-जुड़े सौर संयंत्र के लिए सब्सिडी।',
   'Individual farmers, cooperatives, panchayats and farmer producer organisations.',
   'व्यक्तिगत किसान, सहकारी समितियाँ, पंचायतें और किसान उत्पादक संगठन।',
   'Up to 60% subsidy on solar pumps, plus 30% bank loan support.',
   'सौर पंप पर 60% तक सब्सिडी, साथ में 30% बैंक ऋण सहायता।',
   'https://pmkusum.mnre.gov.in/', 'irrigation', NULL),

  ('e-nam', 'e-NAM', 'ई-नाम',
   'Online trading platform linking APMC mandis nationally so a farmer can sell beyond the local market.',
   'एपीएमसी मंडियों को राष्ट्रीय स्तर पर जोड़ने वाला ऑनलाइन व्यापार मंच, स्थानीय बाज़ार से आगे बेचें।',
   'Any farmer registered with a participating APMC mandi.',
   'किसी भी भाग लेने वाली एपीएमसी मंडी में पंजीकृत किसान।',
   'Transparent price discovery, online payment, wider buyer access.',
   'पारदर्शी मूल्य, ऑनलाइन भुगतान, अधिक खरीदार।',
   'https://www.enam.gov.in/', 'market', NULL),

  ('pmksy', 'Pradhan Mantri Krishi Sinchayee Yojana', 'प्रधानमंत्री कृषि सिंचाई योजना',
   'Irrigation coverage and water-use efficiency — "more crop per drop".',
   'सिंचाई कवरेज और जल उपयोग दक्षता — "हर बूँद अधिक फसल"।',
   'All farmers, with priority to drought-prone and water-stressed districts.',
   'सभी किसान, सूखाग्रस्त और जल-संकट वाले ज़िलों को प्राथमिकता।',
   'Subsidy on drip and sprinkler systems, farm ponds and water harvesting.',
   'ड्रिप और स्प्रिंकलर, खेत तालाब और जल संचयन पर सब्सिडी।',
   'https://pmksy.gov.in/', 'irrigation', NULL),

  ('pkvy', 'Paramparagat Krishi Vikas Yojana', 'परंपरागत कृषि विकास योजना',
   'Cluster-based support for converting to certified organic farming.',
   'प्रमाणित जैविक खेती में बदलने के लिए क्लस्टर आधारित सहायता।',
   'Farmer groups of 50 or more forming a 20-hectare cluster.',
   '50 या अधिक किसानों का समूह जो 20 हेक्टेयर का क्लस्टर बनाए।',
   'Rs 50,000 per hectare over three years, including certification cost.',
   'तीन साल में प्रति हेक्टेयर 50,000 रुपये, प्रमाणन लागत सहित।',
   'https://pgsindia-ncof.gov.in/', 'organic', NULL),

  ('smam', 'Sub-Mission on Agricultural Mechanization', 'कृषि यंत्रीकरण उप-मिशन',
   'Subsidy on farm machinery and custom hiring centres for small holdings.',
   'छोटी जोत के लिए कृषि मशीनरी और कस्टम हायरिंग केंद्र पर सब्सिडी।',
   'All farmers; higher subsidy for SC/ST, women and smallholders.',
   'सभी किसान; अनुसूचित जाति/जनजाति, महिला और लघु किसानों को अधिक सब्सिडी।',
   '40–50% subsidy on tractors, harvesters, seed drills and more.',
   'ट्रैक्टर, हार्वेस्टर, सीड ड्रिल आदि पर 40–50% सब्सिडी।',
   'https://agrimachinery.nic.in/', 'machinery', NULL),

  ('pm-kmy', 'PM Kisan Maandhan Yojana', 'पीएम किसान मानधन योजना',
   'Voluntary contributory pension for small and marginal farmers.',
   'छोटे और सीमांत किसानों के लिए स्वैच्छिक अंशदायी पेंशन।',
   'Small and marginal farmers aged 18 to 40 with up to 2 hectares.',
   '18 से 40 वर्ष के छोटे और सीमांत किसान, 2 हेक्टेयर तक।',
   'Rs 3,000 monthly pension after age 60; government matches the contribution.',
   '60 वर्ष के बाद 3,000 रुपये मासिक पेंशन; सरकार बराबर अंशदान देती है।',
   'https://maandhan.in/', 'income', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_hi = EXCLUDED.name_hi,
  description = EXCLUDED.description,
  description_hi = EXCLUDED.description_hi,
  eligibility = EXCLUDED.eligibility,
  eligibility_hi = EXCLUDED.eligibility_hi,
  benefits = EXCLUDED.benefits,
  benefits_hi = EXCLUDED.benefits_hi,
  link = EXCLUDED.link,
  category = EXCLUDED.category,
  updated_at = now();
