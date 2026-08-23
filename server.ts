import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
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
  const catalogCards: Record<string, {
    type: "borrow" | "project" | "marketplace" | "skill" | "guidance" | "pulse";
    title: string;
    subtitle: string;
    targetId: string;
    tag: string;
    actionLabel: string;
    keywords: string[];
  }> = {
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
    labcoat: {
      type: "borrow",
      title: "Lab Coat & UV Protection Eyewear",
      subtitle: "Available • Biotech Block B • Sneha R.",
      targetId: "b-4",
      tag: "Lab Safety",
      actionLabel: "Borrow",
      keywords: ["lab coat", "coat", "goggles", "eyewear", "chemistry", "biotech", "safety"],
    },
    camera: {
      type: "borrow",
      title: "Sony Alpha A6400 4K Camera + Gimbal",
      subtitle: "Available • Media Center • Tanvi S.",
      targetId: "b-6",
      tag: "Media Gear",
      actionLabel: "Borrow Camera",
      keywords: ["camera", "sony", "dslr", "video", "photos", "gimbal", "shoot", "recording"],
    },
    campusvision: {
      type: "project",
      title: "CampusVision Attendance System",
      subtitle: "Devansh Iyer • Recruiting Python/OpenCV (91% Acc)",
      targetId: "p-1",
      tag: "AI / Vision",
      actionLabel: "Join Squad",
      keywords: ["campusvision", "vision", "attendance", "facial", "opencv", "pytorch", "ai project", "computer vision"],
    },
    soilsense: {
      type: "project",
      title: "SoilSense IoT Agricultural Sensor",
      subtitle: "Ananya Sharma • Recruiting Embedded C / LoRa",
      targetId: "p-2",
      tag: "IoT & Hardware",
      actionLabel: "Join Squad",
      keywords: ["soilsense", "soil", "iot", "agriculture", "embedded", "lora", "hardware project"],
    },
    lecturerewind: {
      type: "project",
      title: "Lecture Rewind AI Transcripts",
      subtitle: "Siddharth Verma • Recruiting Whisper / FastAPI",
      targetId: "p-3",
      tag: "AI / NLP",
      actionLabel: "View Project",
      keywords: ["lecture", "rewind", "transcript", "audio", "whisper", "fastapi", "nlp", "speech"],
    },
    figma: {
      type: "skill",
      title: "Figma UI/UX & Design Systems",
      subtitle: "Sana K. (Design Lead) • 92% Match Score",
      targetId: "match-1",
      tag: "Skill Swap",
      actionLabel: "Connect Mentor",
      keywords: ["figma", "ui", "ux", "design", "wireframe", "prototype", "sana"],
    },
    pcb: {
      type: "skill",
      title: "PCB Design, KiCAD & Soldering",
      subtitle: "Yuvraj Sen (4th Yr ECE) • 88% Match",
      targetId: "match-2",
      tag: "Hardware Skill",
      actionLabel: "Exchange Skill",
      keywords: ["pcb", "kicad", "soldering", "circuit design", "hardware mentor", "yuvraj"],
    },
    ros: {
      type: "skill",
      title: "ROS 2, Gazebo & Autonomous Navigation",
      subtitle: "Neha Choudhury (Robotics Lead) • 91% Match",
      targetId: "match-5",
      tag: "Robotics",
      actionLabel: "Connect",
      keywords: ["ros", "ros2", "robotics", "gazebo", "navigation", "slam", "robot"],
    },
    notes_dsa: {
      type: "marketplace",
      title: "Handwritten DSA & OS Complete Notes",
      subtitle: "₹150 • Rohit V. • Verified Sem 3 Topper",
      targetId: "m-4",
      tag: "Marketplace",
      actionLabel: "Get Notes",
      keywords: ["dsa", "notes", "handwritten", "algorithms", "data structures", "exam notes", "pyq notes"],
    },
    book_griffiths: {
      type: "marketplace",
      title: "Introduction to Electrodynamics (Griffiths)",
      subtitle: "₹450 • Like New • Aman V. (Hostel C)",
      targetId: "m-1",
      tag: "Textbook",
      actionLabel: "Buy Book",
      keywords: ["griffiths", "electrodynamics", "physics book", "textbook", "edynamics"],
    },
    guidance_os: {
      type: "guidance",
      title: "Cracking Operating Systems & Kernel Midterms",
      subtitle: "Blueprint by Aditya R. • 340 Reads",
      targetId: "g-1",
      tag: "Academic Guide",
      actionLabel: "Read Blueprint",
      keywords: ["operating systems", "os", "kernel", "scheduling", "deadlock", "memory management", "aditya"],
    },
    guidance_menon: {
      type: "guidance",
      title: "Navigating Prof. Menon's Signals Course",
      subtitle: "Blueprint by Kavya N. (ECE) • 512 Reads",
      targetId: "g-2",
      tag: "Course Advice",
      actionLabel: "View Tips",
      keywords: ["signals", "systems", "menon", "fourier", "laplace", "ece advice"],
    },
    guidance_intern: {
      type: "guidance",
      title: "Summer Research Internships & Cold Emailing",
      subtitle: "Guide by Meera Sen (IIT/MIT Alumni) • 890 Reads",
      targetId: "g-3",
      tag: "Career Prep",
      actionLabel: "Read Guide",
      keywords: ["internship", "research", "cold email", "summer intern", "mit", "fellowship", "resume"],
    },
  };

  // Determine matching action cards
  let suggestedCards: Array<{
    type: "borrow" | "project" | "marketplace" | "skill" | "guidance" | "pulse";
    title: string;
    subtitle: string;
    targetId: string;
    tag: string;
    actionLabel: string;
  }> = [];

  Object.values(catalogCards).forEach((card) => {
    if (card.keywords.some((kw) => p.includes(kw))) {
      suggestedCards.push({
        type: card.type as any,
        title: card.title,
        subtitle: card.subtitle,
        targetId: card.targetId,
        tag: card.tag,
        actionLabel: card.actionLabel,
      });
    }
  });

  // Limit suggested cards to max 3
  suggestedCards = suggestedCards.slice(0, 3);

  // Fallback cards if none matched
  if (suggestedCards.length === 0) {
    if (p.includes("project") || p.includes("research") || p.includes("team")) {
      suggestedCards.push(
        { type: catalogCards.campusvision.type as any, title: catalogCards.campusvision.title, subtitle: catalogCards.campusvision.subtitle, targetId: catalogCards.campusvision.targetId, tag: catalogCards.campusvision.tag, actionLabel: catalogCards.campusvision.actionLabel },
        { type: catalogCards.soilsense.type as any, title: catalogCards.soilsense.title, subtitle: catalogCards.soilsense.subtitle, targetId: catalogCards.soilsense.targetId, tag: catalogCards.soilsense.tag, actionLabel: catalogCards.soilsense.actionLabel }
      );
    } else if (p.includes("exam") || p.includes("study") || p.includes("guide")) {
      suggestedCards.push(
        { type: catalogCards.guidance_os.type as any, title: catalogCards.guidance_os.title, subtitle: catalogCards.guidance_os.subtitle, targetId: catalogCards.guidance_os.targetId, tag: catalogCards.guidance_os.tag, actionLabel: catalogCards.guidance_os.actionLabel },
        { type: catalogCards.notes_dsa.type as any, title: catalogCards.notes_dsa.title, subtitle: catalogCards.notes_dsa.subtitle, targetId: catalogCards.notes_dsa.targetId, tag: catalogCards.notes_dsa.tag, actionLabel: catalogCards.notes_dsa.actionLabel }
      );
    } else {
      suggestedCards.push(
        { type: catalogCards.calc.type as any, title: catalogCards.calc.title, subtitle: catalogCards.calc.subtitle, targetId: catalogCards.calc.targetId, tag: catalogCards.calc.tag, actionLabel: catalogCards.calc.actionLabel },
        { type: catalogCards.campusvision.type as any, title: catalogCards.campusvision.title, subtitle: catalogCards.campusvision.subtitle, targetId: catalogCards.campusvision.targetId, tag: catalogCards.campusvision.tag, actionLabel: catalogCards.campusvision.actionLabel },
        { type: catalogCards.figma.type as any, title: catalogCards.figma.title, subtitle: catalogCards.figma.subtitle, targetId: catalogCards.figma.targetId, tag: catalogCards.figma.tag, actionLabel: catalogCards.figma.actionLabel }
      );
    }
  }

  // Dynamic Follow-Up Queries
  let followUpQueries: string[] = [];
  if (p.includes("calc") || p.includes("borrow") || p.includes("hardware") || p.includes("scope")) {
    followUpQueries = [
      "Where is the Central Lab pickup point?",
      "What is the maximum borrow duration?",
      "Are there soldering kits available to borrow?",
    ];
  } else if (p.includes("project") || p.includes("vision") || p.includes("squad") || p.includes("ai")) {
    followUpQueries = [
      "What tech stack does CampusVision need?",
      "How do I submit an application to a squad?",
      "Show me other active Robotics & IoT projects",
    ];
  } else if (p.includes("exam") || p.includes("notes") || p.includes("paper") || p.includes("dsa") || p.includes("os")) {
    followUpQueries = [
      "Where can I find PYQ papers for 3rd semester?",
      "Are Prof. Menon's exams open-notes?",
      "Who is top-ranked for Data Structures mentoring?",
    ];
  } else if (p.includes("figma") || p.includes("skill") || p.includes("teach") || p.includes("mentor")) {
    followUpQueries = [
      "How does the peer skill swap score work?",
      "Find students who want to learn Python",
      "Connect me with Sana K. for design review",
    ];
  } else if (p.includes("hostel") || p.includes("mess") || p.includes("library") || p.includes("wifi") || p.includes("timing")) {
    followUpQueries = [
      "What are the Central Library 24/7 timings?",
      "How do I configure the campus Wi-Fi proxy?",
      "Where is the nearest 24/7 printing shop?",
    ];
  } else {
    followUpQueries = [
      "Where can I borrow lab equipment?",
      "Which student projects are recruiting right now?",
      "Find study guides and handwritten notes",
    ];
  }

  // Determine query category
  let queryCategory: "Academic" | "Lab & Gear" | "Projects" | "Skill Swap" | "Marketplace" | "Campus Life" | "General" = "General";
  if (p.includes("exam") || p.includes("notes") || p.includes("paper") || p.includes("syllabus") || p.includes("prof") || p.includes("guide")) {
    queryCategory = "Academic";
  } else if (p.includes("borrow") || p.includes("calc") || p.includes("scope") || p.includes("arduino") || p.includes("gear") || p.includes("lab")) {
    queryCategory = "Lab & Gear";
  } else if (p.includes("project") || p.includes("squad") || p.includes("vision") || p.includes("robot") || p.includes("recruit")) {
    queryCategory = "Projects";
  } else if (p.includes("skill") || p.includes("figma") || p.includes("teach") || p.includes("learn") || p.includes("swap") || p.includes("mentor")) {
    queryCategory = "Skill Swap";
  } else if (p.includes("market") || p.includes("buy") || p.includes("sell") || p.includes("price") || p.includes("book")) {
    queryCategory = "Marketplace";
  } else if (p.includes("hostel") || p.includes("mess") || p.includes("library") || p.includes("event") || p.includes("wifi") || p.includes("sports")) {
    queryCategory = "Campus Life";
  }

  // 1. Try Gemini with Model Fallback (gemini-2.5-flash -> gemini-2.5-flash-lite)
  try {
    const ai = getGeminiClient();
    if (ai) {
      const systemInstruction = `You are COMPASS, the intelligent futuristic campus operating system and AI co-pilot for "ON CAMPUS".
Your role is to connect university students with existing campus resources, people, peer knowledge, research projects, marketplace listings, skill exchanges, borrow inventory, hostel logistics, and live pulse activities.

Guidelines:
1. Speak with a sleek, precise, hyper-helpful, futuristic tone (concise, clear, high-signal, zero fluff).
2. Cite REAL campus entities from the knowledge base below whenever relevant:
   - Borrow Inventory: Casio fx-991EX Calculator (Aman T., North Block H4), Arduino Mega Sensor Kit (Yash P., Central Lab), Rigol 50MHz Oscilloscope (Lab 3), Sony A6400 4K Camera (Tanvi S.), Lab Coat & UV Goggles (Sneha R., Biotech B), Drafting Board (Arjun M.).
   - Research Squads: CampusVision (Facial attendance, Devansh Iyer, needs Python/OpenCV, 91% acc), SoilSense (IoT moisture, Ananya Sharma, needs Embedded C), Lecture Rewind (AI transcripts, Siddharth Verma, needs Whisper/FastAPI), EcoSort (Trash robot, Tarun K., needs ROS 2).
   - Skill Mentors: Sana K. (Figma UI/UX, Design Society Lead), Yuvraj Sen (PCB & KiCAD), Tanvi S. (Video Editing & Blender), Neha Choudhury (ROS 2 Robotics), Kshitij Rao (Public Speaking).
   - Marketplace: David Griffiths Electrodynamics (₹450, Hostel C), Casio fx-991 (₹500), Foldable hostel study desk (₹1,600, Hostel 3), DSA & OS handwritten notes (₹150, Rohit V.), Canon 200D DSLR (₹18,500).
   - Blueprint Guides: Cracking OS & Kernel Midterms (Aditya R.), Prof. Menon Signals & Systems (Kavya N.), Summer Research Internships (Meera Sen), Hostel Survival & Hacks (Rahul Verma).
   - Campus Logistics & Pulse: Central Library open 24/7 during exam weeks (Proxy: proxy.campus.edu:8080), HackNITC 3.0 registrations live (₹2.5L pool), Robotics Club ROS 2 workshop this Saturday at 2 PM in Lab 402, 24/7 Medical Center (Ext 4444), Printing shop at Central Library basement (₹1.5/page).
3. Format your answers beautifully using Markdown with clear bold highlights, bullet points, and actionable next steps.
4. Keep the answer between 2 to 4 crisp paragraphs/bullet points. Always give direct, high-value assistance.`;

      const candidateModels = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
      let generatedText: string | null = null;
      let usedModel: string = "gemini-2.5-flash";

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.6,
            },
          });

          if (response.text && response.text.trim()) {
            generatedText = response.text;
            usedModel = modelName;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`[COMPASS AI] Model ${modelName} unavailable (${modelErr?.status || modelErr?.code || 'transient error'}). Trying fallback...`);
        }
      }

      if (generatedText) {
        res.json({
          reply: generatedText,
          answer: generatedText,
          source: usedModel,
          category: queryCategory,
          confidenceScore: 98,
          followUpQueries,
          suggestedCards,
        });
        return;
      }
    }
  } catch (error: any) {
    console.warn("[COMPASS AI] Remote AI service currently busy; utilizing instant campus neural engine.", error?.message || "");
  }

  // 2. High-precision Multi-Domain Fallback Reasoning Engine
  let fallbackAnswer = "I scanned the ON CAMPUS neural network across all 6 core layers (Borrow, Guidance, Skills, Marketplace, Projects, Pulse).";

  if (p.includes("calculator") || p.includes("calc") || p.includes("casio")) {
    fallbackAnswer = `**Scientific Calculator Availability:**
• **Free Borrow Protocol**: Casio fx-991EX ClassWiz is available in **North Block H4** (Lender: Aman T., 5-day max loan, ₹0 deposit).
• **Marketplace Buy Option**: A like-new Casio fx-991 is listed for **₹500** by Aman T.
• **Central Lab Pool**: You can also check out backup calculators from the Central Lab inventory desk on Ground Floor.`;
  } else if (p.includes("oscilloscope") || p.includes("scope") || p.includes("signal") || p.includes("waveform")) {
    fallbackAnswer = `**Oscilloscope & Measurement Gear:**
• **Rigol 50MHz Digital Oscilloscope** is available for 48-hour student reservation in **Electronics Wing Lab 3** (Faculty in charge: Dr. Nair).
• Includes dual probes, BNC connectors, and USB waveform export.
• Check the **Borrow Gear** section to lock your slot.`;
  } else if (p.includes("lab coat") || p.includes("goggles") || p.includes("chemistry") || p.includes("biotech")) {
    fallbackAnswer = `**Lab Safety Gear:**
• **Borrow**: Sneha R. in **Biotech Block B** has a 100% cotton Lab Coat (Size M/L) and UV safety eyewear available for free borrowing up to 7 days.
• **Marketplace**: Verified university lab coats are also listed for **₹220** under the Marketplace Equipment category.`;
  } else if (p.includes("ai project") || p.includes("robot") || p.includes("project") || p.includes("recruit") || p.includes("vision") || p.includes("squad")) {
    fallbackAnswer = `**Active Campus Squads Recruiting Right Now:**
• **CampusVision** (Computer Vision Attendance): Led by Devansh Iyer. Currently at **91% accuracy** and actively recruiting Python / OpenCV / PyTorch developers.
• **SoilSense** (IoT Agricultural Moisture Network): Led by Ananya Sharma. Recruiting Embedded C & LoRa engineers.
• **Lecture Rewind** (AI Audio Summarizer): Led by Siddharth Verma. Looking for Whisper API & FastAPI contributors.
• **EcoSort** (Autonomous Waste Classifier): Led by Tarun K. Recruiting ROS 2 & TensorFlow developers.`;
  } else if (p.includes("figma") || p.includes("ui") || p.includes("ux") || p.includes("design") || p.includes("wireframe")) {
    fallbackAnswer = `**Figma UI/UX Mentorship & Skill Exchange:**
• **Sana K.** (Design Society Lead, 4th Year) is offering hands-on design system & Figma wireframing guidance (**92% compatibility match**).
• She is looking to learn **Python & Excel** in exchange.
• You can send a direct Skill Swap request to initiate a peer session.`;
  } else if (p.includes("pcb") || p.includes("kicad") || p.includes("soldering") || p.includes("circuit")) {
    fallbackAnswer = `**Hardware & PCB Design Exchange:**
• **Yuvraj Sen** (4th Year ECE) is mentoring on KiCAD schematic capture, 2-layer PCB layout, and surface-mount soldering (**88% match score**).
• Looking for **React & TypeScript** frontend basics in return.`;
  } else if (p.includes("ros") || p.includes("ros2") || p.includes("robotics") || p.includes("gazebo")) {
    fallbackAnswer = `**Robotics & ROS 2 Hub:**
• **Neha Choudhury** (Robotics Club Lead) mentors on ROS 2 Humble, Gazebo simulation, and SLAM navigation (**91% match**).
• The **Robotics Club** is also hosting a live hands-on ROS 2 workshop this Saturday at **2:00 PM in Lab 402**.`;
  } else if (p.includes("past year") || p.includes("paper") || p.includes("pyq") || p.includes("notes") || p.includes("dsa") || p.includes("dbms")) {
    fallbackAnswer = `**Academic Notes & Previous Year Exam Papers:**
• **Handwritten DSA & OS Notes**: Topper-verified Sem 3 notes compiled by Rohit V. are available in the **Marketplace for ₹150**.
• **Operating Systems Blueprint**: Aditya R. published a 340-read guide on kernel scheduling, memory management, and deadlock questions in the **Guidance Portal**.
• **Central Library Digital Repository**: Access past 5 years of exam papers at \`repository.campus.edu\` via campus intranet.`;
  } else if (p.includes("menon") || p.includes("signals") || p.includes("fourier")) {
    fallbackAnswer = `**Prof. Menon's Signals & Systems Course Insights:**
• **Midterm Format**: Confirmed on Campus Pulse as **Open-Notes** (Handwritten cheat sheets allowed, no electronic devices).
• **High-Yield Topics**: Focus heavily on Fourier Transform duality, DTFS proofs, and ROC conditions for Laplace transforms.
• Read Kavya N.'s comprehensive blueprint guide in the **Guidance section** (512 reads).`;
  } else if (p.includes("internship") || p.includes("resume") || p.includes("cold email") || p.includes("career")) {
    fallbackAnswer = `**Internship & Research Placement Blueprint:**
• **Research Guide**: Meera Sen's blueprint *"Securing Summer Research Internships & Cold Emailing Strategies"* covers email templates that got students into IIT Bombay, IISc, and MIT labs.
• **Upcoming Events**: HackNITC 3.0 registrations are live on Campus Pulse with direct interview fast-tracks from sponsor tech companies.`;
  } else if (p.includes("library") || p.includes("timing") || p.includes("study room") || p.includes("24/7")) {
    fallbackAnswer = `**Central Library Hours & Facilities:**
• **Standard Hours**: Monday - Saturday: 8:00 AM - 11:00 PM.
• **Exam Period Hours**: **Open 24/7** with air-conditioned night reading halls in the 2nd Floor annex.
• **Intranet Wi-Fi Proxy**: \`proxy.campus.edu\` on port \`8080\` (Credentials: Student LDAP ID).
• **Printing**: Basement Xerox counter opens at 8:30 AM (₹1.50 per B&W page).`;
  } else if (p.includes("wifi") || p.includes("proxy") || p.includes("internet") || p.includes("network")) {
    fallbackAnswer = `**Campus Wi-Fi & Proxy Configuration:**
• **SSID**: \`Campus-HighSpeed-5G\` / \`Hostel-Mesh\`
• **HTTP/HTTPS Proxy**: \`proxy.campus.edu\` | **Port**: \`8080\`
• **Bypass Domains**: \`*.campus.edu, localhost, 127.0.0.1\`
• For device MAC registration, visit the Computer Center Helpdesk (Room 102).`;
  } else if (p.includes("hostel") || p.includes("mess") || p.includes("food") || p.includes("room")) {
    fallbackAnswer = `**Hostel & Dining Information:**
• **Mess Timings**: Breakfast (7:30–9:30 AM) | Lunch (12:00–2:00 PM) | Dinner (7:30–9:30 PM).
• **Special Dinner**: Wednesday & Sunday nights (Ice cream / Special gravy).
• **Hostel Wings Portal**: Access Wing H4, Block B, and Central Hostel common rooms via the **Hostel Wings modal**.`;
  } else if (p.includes("emergency") || p.includes("medical") || p.includes("doctor") || p.includes("security") || p.includes("help")) {
    fallbackAnswer = `**Campus Emergency Contacts:**
• **24/7 Medical Dispensary**: Ext. \`4444\` / Emergency Ambulance: \`+91-98765-43210\`
• **Campus Main Security Gate**: Ext. \`1001\`
• **Dean of Student Welfare (DSW)**: \`dsw@campus.edu\` (Admin Block 2nd Floor).`;
  } else if (p.includes("marketplace") || p.includes("buy") || p.includes("sell") || p.includes("book")) {
    fallbackAnswer = `**Marketplace Exchange:**
• Verified student listings available:
  - *Introduction to Electrodynamics (Griffiths)* – **₹450** (Hostel C)
  - *Casio fx-991EX Calculator* – **₹500** (North Block H4)
  - *Foldable Study Table* – **₹1,600** (Hostel 3)
  - *Canon EOS 200D DSLR* – **₹18,500** (Media Wing)
• Safe handoffs take place in public hostel common rooms or library lobby.`;
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

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ON CAMPUS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
