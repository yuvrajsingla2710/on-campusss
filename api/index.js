import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "ON CAMPUS", timestamp: new Date().toISOString() });
});

// COMPASS AI campus assistant query endpoint
app.post("/api/compass/ask", async (req, res) => {
  const prompt = req.body.prompt || req.body.query || "";
  const campusContext = req.body.campusContext || req.body.userContext || {};

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing prompt or query parameter" });
    return;
  }

  const p = prompt.toLowerCase();

  // Smart dynamic card catalog
  const catalogCards = {
    calc: {
      type: "borrow",
      title: "Casio fx-991EX Scientific Calculator",
      subtitle: "Available • North Block H4 • Aman T.",
      targetId: "b-2",
      tag: "Hardware",
      actionLabel: "Borrow (Free)",
      keywords: ["calc", "calculator", "casio", "fx-991", "scientific", "math", "exam calc"],
    },
    arduino: {
      type: "borrow",
      title: "Arduino Mega + 37 Sensor Kit",
      subtitle: "Available • Central Lab • Yash P.",
      targetId: "b-1",
      tag: "Electronics",
      actionLabel: "Borrow",
      keywords: ["arduino", "sensor", "iot", "mega", "microcontroller", "breadboard", "components"],
    },
    scope: {
      type: "borrow",
      title: "Rigol 50MHz Digital Oscilloscope",
      subtitle: "Available • Electronics Wing Lab 3",
      targetId: "b-3",
      tag: "Lab Gear",
      actionLabel: "Reserve Gear",
      keywords: ["oscilloscope", "scope", "rigol", "signal", "waveform", "electronics lab", "circuits"],
    },
  };

  // Match suggested cards
  const suggestedCards = [];
  for (const [, card] of Object.entries(catalogCards)) {
    if (card.keywords.some(kw => p.includes(kw))) {
      suggestedCards.push({
        type: card.type,
        title: card.title,
        subtitle: card.subtitle,
        tag: card.tag,
        actionLabel: card.actionLabel,
        targetId: card.targetId,
      });
    }
  }

  // Determine category
  let queryCategory = "General";
  if (p.match(/borrow|lend|equipment|gear|lab coat|calculator|arduino|oscilloscope/)) queryCategory = "Lab & Gear";
  else if (p.match(/project|research|team|collaborate|recruit/)) queryCategory = "Projects";
  else if (p.match(/skill|swap|exchange|teach|learn|mentor/)) queryCategory = "Skill Swap";
  else if (p.match(/buy|sell|market|book|price|listing/)) queryCategory = "Marketplace";
  else if (p.match(/course|professor|gpa|exam|grade|semester|class/)) queryCategory = "Academic";
  else if (p.match(/event|fest|club|hostel|food|canteen|sport/)) queryCategory = "Campus Life";

  // Follow-up queries
  const followUpQueries = [
    "What equipment is available to borrow?",
    "Show me active campus projects",
    "Find skill exchange partners",
  ];

  // Try Gemini AI
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const systemPrompt = `You are COMPASS, the intelligent campus assistant for ON CAMPUS. You help university students navigate campus resources, find equipment to borrow, discover projects, exchange skills, and explore the marketplace. Be helpful, concise, and student-friendly. Format responses in markdown.`;
      
      const response = await gemini.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nStudent query: ${prompt}` }] }],
      });

      const aiReply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (aiReply) {
        res.json({
          reply: aiReply,
          answer: aiReply,
          source: "gemini-ai",
          category: queryCategory,
          confidenceScore: 92,
          followUpQueries,
          suggestedCards,
        });
        return;
      }
    } catch (err) {
      console.error("Gemini AI error:", err.message);
    }
  }

  // Fallback response
  let fallbackAnswer = `Welcome to **ON CAMPUS**! I'm COMPASS, your campus assistant.\n\nI can help you with:\n- 🛠️ **Borrowing** equipment and gear\n- 🧭 **Guidance** on courses and professors\n- 🤝 **Skill Exchange** with peers\n- 🛒 **Marketplace** for student items\n- 🌟 **Impact** projects and communities\n\nWhat would you like to explore?`;

  if (p.match(/borrow|equipment|gear|lab/)) {
    fallbackAnswer = `**Available Equipment to Borrow:**\n- Arduino Mega + 37 Sensor Kit (Central Lab)\n- Casio fx-991EX Calculator (North Block H4)\n- Rigol 50MHz Oscilloscope (Electronics Wing)\n\nUse the Borrow service to reserve items!`;
  } else if (p.match(/project|research/)) {
    fallbackAnswer = `**Active Campus Projects:**\n- EcoTrack — Sustainability monitoring (12 members)\n- CampusAR — Augmented reality navigation (8 members)\n- MediConnect — Health data platform (15 members)\n\nCheck the Projects section to join or create your own!`;
  } else if (p.match(/market|buy|sell/)) {
    fallbackAnswer = `**Marketplace Highlights:**\n- Introduction to Electrodynamics (Griffiths) — ₹450\n- Casio fx-991EX Calculator — ₹500\n- Foldable Study Table — ₹1,600\n\nBrowse the Marketplace for more listings!`;
  }

  res.json({
    reply: fallbackAnswer,
    answer: fallbackAnswer,
    source: "compass-engine-v2",
    category: queryCategory,
    confidenceScore: 95,
    followUpQueries,
    suggestedCards,
  });
});

export default app;
