import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support larger payloads for multimodal base64 image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini SDK with User-Agent as instructed
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Server-side Supabase client (using service role key or public URL if provided)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase server client:', err);
  }
}

// RAZA System Instructions - Concise, direct, and actionable
const RAZA_SYSTEM_INSTRUCTION = `You are RAZA, the intelligent and practical community-action AI assistant inside SAMYOJ.

CORE RULE:
Answer the user's actual question first. Stop when the useful answer is complete.
Prioritize:
- Useful > Complete
- Clear > Long
- Actionable > Explanatory

RESPONSE LENGTH & STYLE RULES:
1. Default Response:
   - 2–5 short paragraphs OR 3–6 concise bullet points.
   - 80–150 words for normal questions.
   - Avoid unnecessary introductions, greetings, fluff, or conclusions. Never repeat the user's question.

2. Simple Questions (e.g. definitions, greetings, general queries):
   - 1–3 sentences maximum. Give the answer directly.
   - Set "hasActionPlan": false and "structuredPlan": null.

3. Community Problems:
   - Keep the conversational text short and easy to scan.
   - Follow this concise format in "text":
     Problem: [one clear sentence]
     What to do:
     1. [Action 1]
     2. [Action 2]
     3. [Action 3]
     4. [Action 4]
     People needed: [1 short line]
     Expected impact: [1 short line]
     Then stop!
   - In "structuredPlan", provide:
     - 4 to 6 actionable community steps maximum. Each step must be ONE short sentence.
     - Top 2-3 volunteer roles only.
     - Top 2-3 essential resources with estimated NPR costs.
     - 2-3 local partners (Ward office, youth club, Red Cross).
     - At most 1 smart follow-up question (or null if sufficient).

4. Adapt to the User:
   - "short answer" → extremely short (1–2 sentences).
   - "explain" → simple explanation in a few sentences without unrelated background.
   - "details" → provide more depth.
   - "step by step" / "make a plan" → concise actionable steps.

5. What NOT to do:
   - Do NOT give long essays, huge lists, repeated advice, or generic motivational paragraphs.
   - Do NOT add disclaimers or repetitive summaries.

6. Language:
   - Understand English, Nepali, Hindi, Hinglish, and mixed casual language (e.g. "hamro school ko agadi lastai fohor xa k garne?", "road bigreko xa").
   - Respond naturally in the user's language with a friendly, direct human tone.

7. Hazardous Situations:
   - For live electricity, structural collapse, or high-speed traffic hazards: directly recommend notifying the local Ward or emergency authorities first.

OUTPUT SCHEMA (strictly valid JSON):
{
  "text": "Concise, formatted text following the length rules above.",
  "detectedLanguage": "English" | "Nepali" | "Hinglish" | "Mixed",
  "hasActionPlan": boolean,
  "structuredPlan": null | {
    "title": "Short initiative title",
    "problem": "One sentence problem summary",
    "category": "Waste & Ecology" | "Clean Water" | "Solar & Lighting" | "Heritage & Culture" | "Digital & Youth" | "Road Safety & Mobility",
    "urgency": "Low" | "Medium" | "High" | "Critical",
    "knownInfo": ["Point 1", "Point 2"],
    "uncertainInfo": ["Item needing check"],
    "possibleCauses": ["Key cause"],
    "immediateActions": ["Immediate safe action 1", "Immediate safe action 2"],
    "communityPlan": [
      { "step": 1, "title": "Survey & Permission", "description": "One short sentence.", "duration": "2 Days" },
      { "step": 2, "title": "Mobilize & Action", "description": "One short sentence.", "duration": "1 Day" },
      { "step": 3, "title": "Handover & Care", "description": "One short sentence.", "duration": "5 Days" }
    ],
    "volunteerRoles": [
      { "role": "Coordinator", "countNeeded": 2, "description": "Oversee logistics" },
      { "role": "Volunteers", "countNeeded": 10, "description": "Ground action" }
    ],
    "resources": [
      { "item": "Safety gloves", "quantity": "15 pairs", "estimatedCostNPR": "Rs 1,500", "source": "Local fund" },
      { "item": "Collection bags", "quantity": "20 bags", "estimatedCostNPR": "Rs 1,000", "source": "Ward office" }
    ],
    "potentialPartners": ["Ward Office", "Tol Committee"],
    "expectedImpact": "One short line on measurable outcome",
    "suggestedFollowupQuestion": "One short follow-up or null"
  }
}`;

// Intelligent fallback generator in case API is unavailable - strictly concise
function generateSmartFallback(message: string, history: Array<{ sender: string; text: string }>, imageAttached: boolean) {
  const lower = message.toLowerCase();
  const fullContextText = history.map(h => h.text).join(' ').toLowerCase() + ' ' + lower;

  const isNepaliOrHinglish = /hamro|fohor|k garne|\bxa\b|\bxau\b|bato|\bpani\b|bigreko|garne|\bchha\b|\bho\b|tapai|mero|kina|kasari|kaha/.test(lower);
  const isGeneralQuestion = /what is|explain|who are you|meaning|means\b|define|k ho|namaste|hello|hi\b|want to know|tell me about|how does|what does/.test(lower) && !/problem|waste|garbage|pothole|road|fohor|pani|plastic|bato|broken|damaged|danger/.test(lower);

  // Simple / Explanation questions: 1-3 direct sentences
  if (isGeneralQuestion) {
    if (isNepaliOrHinglish) {
      return {
        text: 'समुदाय विकास भनेको स्थानीय बासिन्दा, युवा र वडा मिलेर आफ्नो टोलको समस्या आफैं समाधान गर्ने सामूहिक प्रक्रिया हो। यसले सरसफाइ, बाटोघाटो, बत्ती र शिक्षा जस्ता साझा आवश्यकताहरू सुधार गर्छ।',
        detectedLanguage: 'Nepali',
        hasActionPlan: false,
        structuredPlan: null
      };
    }
    return {
      text: 'Community development is the process where local residents, youth, and civic groups organize collectively to solve shared neighborhood challenges — such as clean public spaces, safer streets, and local amenities.',
      detectedLanguage: 'English',
      hasActionPlan: false,
      structuredPlan: null
    };
  }

  // Derive title & category based on full conversation context
  let category = 'Waste & Ecology';
  let title = 'Community Cleanup Initiative';

  if (fullContextText.includes('garbage') || fullContextText.includes('waste') || fullContextText.includes('fohor') || fullContextText.includes('plastic') || fullContextText.includes('trash')) {
    category = 'Waste & Ecology';
    title = fullContextText.includes('school') ? 'School Perimeter Cleanup' : 'Neighborhood Waste Cleanup';
  } else if (fullContextText.includes('water') || fullContextText.includes('pani') || fullContextText.includes('tap') || fullContextText.includes('dhunge')) {
    category = 'Clean Water';
    title = 'Clean Water Kiosk & Testing';
  } else if (fullContextText.includes('light') || fullContextText.includes('batti') || fullContextText.includes('solar') || fullContextText.includes('dark') || fullContextText.includes('galli')) {
    category = 'Solar & Lighting';
    title = 'Alleyway Solar Lighting Drive';
  } else if (fullContextText.includes('road') || fullContextText.includes('pothole') || fullContextText.includes('bato') || fullContextText.includes('traffic') || fullContextText.includes('bigreko')) {
    category = 'Road Safety & Mobility';
    title = 'Neighborhood Road Repair Action';
  } else if (fullContextText.includes('heritage') || fullContextText.includes('falcha') || fullContextText.includes('temple') || fullContextText.includes('monument')) {
    category = 'Heritage & Culture';
    title = 'Historic Falcha Restoration';
  } else if (fullContextText.includes('computer') || fullContextText.includes('coding') || fullContextText.includes('library') || fullContextText.includes('makerspace')) {
    category = 'Digital & Youth';
    title = 'Youth Tech & Digital Lab';
  }

  const volunteerCount = fullContextText.match(/\b(\d+)\s*(students|volunteers|people|जना|manchhe|youth)\b/i)?.[1] || '15';

  if (isNepaliOrHinglish) {
    return {
      text: `Problem: सडक तथा सार्वजनिक स्थानमा समस्या देखिएको छ।

What to do:
1. प्रभावित क्षेत्रको तस्बिर खिचेर वडा कार्यालयमा जानकारी दिने।
2. ${volunteerCount} जना स्वयंसेवकहरूको टोली बनाएर आवश्यक सामग्री जुटाउने।
3. शनिबार श्रमदानमार्फत सुरक्षित सरसफाइ वा मर्मत सम्पन्न गर्ने।
4. फोहोर विसर्जन गाडीसँग समन्वय गरी दीर्घकालीन रेखदेख गर्ने।

People needed: ${volunteerCount} स्वयंसेवक र २ जना संयोजक।
Expected impact: सफा, सुरक्षित बाटो र नागरिक सहकार्य।`,
      detectedLanguage: 'Nepali',
      hasActionPlan: true,
      structuredPlan: {
        title: title,
        problem: message,
        category: category,
        urgency: lower.includes('danger') || lower.includes('urgent') || lower.includes('lastai') ? 'High' : 'Medium',
        knownInfo: [message, `${volunteerCount} जना स्वयंसेवक उपलब्ध`],
        uncertainInfo: ['वडाको फोहोर संकलन तालिका'],
        possibleCauses: ['सार्वजनिक डस्टबिन र नियमित संकलनको कमी'],
        immediateActions: [
          'प्रभावित ठाउँको फोटो खिचेर वडालाई जानकारी गराउने।',
          'सुरक्षा पन्जा र मास्क संकलन गर्ने।'
        ],
        communityPlan: [
          { step: 1, title: 'वडा समन्वय', description: 'वडा कार्यालयमा फोहोर गाडीको समय मिलाउने।', duration: '२ दिन' },
          { step: 2, title: 'श्रमदान कार्य', description: 'स्वयंसेवक परिचालन गरी सफाइ सम्पन्न गर्ने।', duration: '१ दिन' },
          { step: 3, title: 'निरन्तर रेखदेख', description: 'सचेतना बोर्ड राखेर साप्ताहिक निगरानी गर्ने।', duration: '५ दिन' }
        ],
        volunteerRoles: [
          { role: 'संयोजक', countNeeded: 2, description: 'वडा र स्वयंसेवक समन्वय' },
          { role: 'स्वयंसेवक', countNeeded: Number(volunteerCount) || 12, description: 'प्रत्यक्ष श्रमदान' }
        ],
        resources: [
          { item: 'सुरक्षा पन्जा र मास्क', quantity: `${volunteerCount} सेट`, estimatedCostNPR: 'Rs २,०००', source: 'सामुदायिक कोष' },
          { item: 'फोहोर संकलन बोरा', quantity: '१५ वटा', estimatedCostNPR: 'Rs १,५००', source: 'वडा कार्यालय' }
        ],
        potentialPartners: ['स्थानीय वडा कार्यालय', 'टोल सुधार समिति'],
        expectedImpact: 'सफा र सुरक्षित वातावरण, नागरिक सहकार्य वृद्धि।',
        suggestedFollowupQuestion: 'यो कार्य कुन शनिबार गर्ने योजना छ?'
      }
    };
  }

  return {
    text: `Problem: ${message.trim().replace(/\.$/, '')}.

What to do:
1. Document the affected site with clear photos and notify the local Ward office.
2. Form a small volunteer squad of ${volunteerCount} people and gather safety kits.
3. Conduct a scheduled cleanup morning to safely collect and segregate waste.
4. Coordinate pickup with the municipal waste collection vehicle.

People needed: ${volunteerCount} volunteers and 2 coordinators.
Expected impact: Restored clean perimeter and improved pedestrian safety.`,
    detectedLanguage: 'English',
    hasActionPlan: true,
    structuredPlan: {
      title: title,
      problem: message,
      category: category,
      urgency: lower.includes('urgent') || lower.includes('danger') ? 'High' : 'Medium',
      knownInfo: [message, `${volunteerCount} volunteers available`],
      uncertainInfo: ['Municipal waste truck schedule'],
      possibleCauses: ['Lack of segregated bins and designated disposal hours'],
      immediateActions: [
        'Document the area with photos from 2-3 angles.',
        'Contact the local Ward office for transport support.'
      ],
      communityPlan: [
        { step: 1, title: 'Survey & Ward Sync', description: 'Coordinate timing with municipal pickup services.', duration: '2 Days' },
        { step: 2, title: 'Community Action Day', description: 'Deploy volunteer squad with gloves and collection sacks.', duration: '1 Day' },
        { step: 3, title: 'Ongoing Care', description: 'Place warning signage and monitor weekly.', duration: '5 Days' }
      ],
      volunteerRoles: [
        { role: 'Team Lead', countNeeded: 2, description: 'Oversee logistics and safety' },
        { role: 'Field Volunteers', countNeeded: Number(volunteerCount) || 12, description: 'Ground collection and sorting' }
      ],
      resources: [
        { item: 'Heavy-duty gloves and masks', quantity: `${volunteerCount} pairs`, estimatedCostNPR: 'Rs 2,000', source: 'Community fund' },
        { item: 'Collection bags & sorting bins', quantity: '15 units', estimatedCostNPR: 'Rs 1,500', source: 'Ward environmental unit' }
      ],
      potentialPartners: ['Local Ward Office', 'Youth for Green Action'],
      expectedImpact: 'Safe, clean community space with active neighbor participation.',
      suggestedFollowupQuestion: 'What date or weekend would be best to mobilize?'
    }
  };
}

// POST endpoint for multi-turn RAZA Chat with multimodal support
app.post('/api/raza/chat', async (req, res) => {
  const { message, history = [], imageBase64, languagePreference } = req.body;

  if (!message && !imageBase64) {
    res.status(400).json({ error: 'Message or image is required.' });
    return;
  }

  // Attempt real Gemini AI generation if available
  if (ai) {
    try {
      const contentsPayload: any[] = [];

      // Format previous history turns (limit last 8 turns for performance & token efficiency)
      const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
      for (const turn of recentHistory) {
        if (turn.sender === 'user') {
          contentsPayload.push({
            role: 'user',
            parts: [{ text: turn.text || '' }]
          });
        } else if (turn.sender === 'raza') {
          contentsPayload.push({
            role: 'model',
            parts: [{ text: typeof turn.text === 'string' ? turn.text : JSON.stringify(turn) }]
          });
        }
      }

      // Current turn parts
      const currentParts: any[] = [];

      // Attach image if provided
      if (imageBase64 && typeof imageBase64 === 'string') {
        const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const data = match[2];
          currentParts.push({
            inlineData: {
              mimeType,
              data
            }
          });
        }
      }

      let userTextPrompt = message || 'Analyze this uploaded photo of a community problem and suggest a realistic action plan.';
      if (languagePreference && languagePreference !== 'Auto') {
        userTextPrompt += ` (Please reply primarily in ${languagePreference} language).`;
      }
      currentParts.push({ text: userTextPrompt });

      contentsPayload.push({
        role: 'user',
        parts: currentParts
      });

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsPayload,
        config: {
          systemInstruction: RAZA_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.4,
        }
      });

      const responseText = aiResponse.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          res.json({
            success: true,
            provider: 'gemini-3.8-flash',
            ...parsed
          });
          return;
        } catch (jsonErr) {
          // If response was not strictly JSON, wrap in natural format
          res.json({
            success: true,
            provider: 'gemini-3.8-flash',
            text: responseText,
            detectedLanguage: 'Auto',
            hasActionPlan: false,
            structuredPlan: null
          });
          return;
        }
      }
    } catch (err: any) {
      console.warn('Gemini chat generation encountered issue, using smart resilience engine:', err?.message || err);
    }
  }

  // Graceful fallback
  const fallback = generateSmartFallback(message || 'Community issue reported with photo', history, !!imageBase64);
  res.json({
    success: true,
    provider: 'samyoj-engine',
    ...fallback
  });
});

// Legacy backward-compatible endpoint for existing /api/raza/analyze
app.post('/api/raza/analyze', async (req, res) => {
  const { title, description, category, location, urgency } = req.body;

  if (!title && !description) {
    res.status(400).json({ error: 'Title or description required.' });
    return;
  }

  // Call the unified chat engine
  const prompt = `Title: ${title || 'Civic Issue'}. Category: ${category || 'Civic Infrastructure'}. Location: ${location || 'Nepal'}. Urgency: ${urgency || 'High'}. Details: ${description || title}`;
  
  if (ai) {
    try {
      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: RAZA_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.4,
        }
      });

      const responseText = aiResponse.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed.structuredPlan) {
          // Adapt to RazaPlan format expected by legacy callers
          const sp = parsed.structuredPlan;
          const legacyPlan = {
            summary: sp.problem || parsed.text,
            category: sp.category,
            urgency: sp.urgency,
            immediateActions: sp.immediateActions || [],
            actionPlan: (sp.communityPlan || []).map((step: any) => ({
              phase: `Phase ${step.step}: ${step.title}`,
              title: step.title,
              duration: step.duration || '3 Days',
              tasks: [step.description]
            })),
            volunteerRoles: sp.volunteerRoles || [],
            resources: sp.resources || [],
            potentialPartners: sp.potentialPartners || [],
            expectedImpact: {
              peopleBenefited: 500,
              metrics: sp.expectedImpact || 'Community improvement',
              environmentalBenefit: 'Eliminates open hazard and promotes civic cooperation.',
              timeline: '14 Days'
            },
            motivationalMotto: '“जब समुदाय जुट्छ, परिवर्तन सम्भव हुन्छ — When community unites, impact is inevitable.”'
          };
          res.json({ success: true, plan: legacyPlan, provider: 'gemini-3.8-flash' });
          return;
        }
      }
    } catch (err) {
      console.warn('Legacy analyze Gemini call failed:', err);
    }
  }

  const fallback = generateSmartFallback(prompt, [], false);
  const sp = fallback.structuredPlan!;
  const legacyPlan = {
    summary: sp.problem,
    category: sp.category,
    urgency: sp.urgency,
    immediateActions: sp.immediateActions,
    actionPlan: sp.communityPlan.map((step) => ({
      phase: `Phase ${step.step}: ${step.title}`,
      title: step.title,
      duration: step.duration || '3 Days',
      tasks: [step.description]
    })),
    volunteerRoles: sp.volunteerRoles,
    resources: sp.resources,
    potentialPartners: sp.potentialPartners,
    expectedImpact: {
      peopleBenefited: 850,
      metrics: sp.expectedImpact,
      environmentalBenefit: 'Eliminates open hazard and promotes civic cooperation.',
      timeline: '14 Days'
    },
    motivationalMotto: '“जब समुदाय जुट्छ, परिवर्तन सम्भव हुन्छ — When community unites, impact is inevitable.”'
  };

  res.json({ success: true, plan: legacyPlan, provider: 'samyoj-engine' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    os: 'SAMYOJ Core v2.5',
    razaEngine: ai ? 'connected' : 'autonomous-mode',
    supabase: supabase ? 'configured' : 'client-storage-fallback',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SAMYOJ OS] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
