import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

if (!process.env.KKU_API_KEY) {
  console.error("KKU_API_KEY is missing in .env");
}

const kku = new OpenAI({
  apiKey: process.env.KKU_API_KEY,
  baseURL: "https://gen.ai.kku.ac.th/api/v1", // IntelSphere / OpenRouter style
});

// รายชื่อ provider + model ที่อนุญาต (ใช้ key KKU ยิงทั้งหมด)
const PROVIDERS = {
  openai: {
    label: "OpenAI",
    models: [
      { id: "gpt-5", label: "gpt-5" },
      { id: "gpt-5-mini", label: "gpt-5-mini" },
      { id: "gpt-5-nano", label: "gpt-5-nano" },
      { id: "gpt-4.1", label: "gpt-4.1" },
      { id: "gpt-4.1-mini", label: "gpt-4.1-mini" },
      { id: "gpt-4.1-nano", label: "gpt-4.1-nano" }
    ]
  },
  claude: {
    label: "Claude",
    models: [
      { id: "claude-sonnet-4.5", label: "claude-sonnet-4.5" },
      { id: "claude-haiku-4.5", label: "claude-haiku-4.5" },
      { id: "claude-sonnet-4", label: "claude-sonnet-4" },
      { id: "claude-3.7-sonnet", label: "claude-3.7-sonnet" }
    ]
  },
  gemini: {
    label: "Gemini",
    models: [
      { id: "gemini-2.5-pro", label: "gemini-2.5-pro" },
      { id: "gemini-2.5-flash", label: "gemini-2.5-flash" },
      { id: "gemini-2.5-flash-lite", label: "gemini-2.5-flash-lite" }
    ]
  }
};

// helper: เช็คว่า provider/model ถูกต้องไหม
function isAllowed(provider, model) {
  const p = PROVIDERS[provider];
  if (!p) return false;
  return p.models.some((m) => m.id === model);
}

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// หน้าเช็ค backend
app.get("/", (req, res) => {
  res.send(`
    <h2>KKU IntelSphere Multi-Model Backend</h2>
    <p>POST /api/chat with { provider, model, message }</p>
  `);
});

// main endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { provider, model, message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    // ถ้า provider/model ไม่ valid → default เป็น OpenAI gpt-5
    let selectedProvider = provider || "openai";
    let selectedModel = model || "gpt-5";

    if (!isAllowed(selectedProvider, selectedModel)) {
      selectedProvider = "openai";
      selectedModel = "gpt-5";
    }

    const completion = await kku.chat.completions.create({
      model: selectedModel, // ตรงนี้คือ model id ที่ IntelSphere/OpenRouter map ให้
      stream: false,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant. Provider: ${selectedProvider}, Model: ${selectedModel}`,
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "";

    res.json({
      reply,
      provider: selectedProvider,
      model: selectedModel,
    });
  } catch (err) {
    console.error("KKU multi-model error:", err);
    res.status(500).json({
      error: "KKU IntelSphere request failed",
      detail: String(err.message || err),
    });
  }
});

app.listen(port, () => {
  console.log(`KKU IntelSphere multi-model backend on http://localhost:${port}`);
});
