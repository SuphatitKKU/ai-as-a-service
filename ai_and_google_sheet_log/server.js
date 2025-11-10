import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ===== Gemini Client =====
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ===== Middleware =====
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

// ===== ฟังก์ชันยิงไป Apps Script =====
async function logToSheetViaAppScript({ message, reply, source = "frontend" }) {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    console.warn("APPS_SCRIPT_URL is not set, skip logging.");
    return;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, reply, source }),
    });
  } catch (err) {
    console.error("Failed to log via Apps Script:", err.toString());
  }
}

// ===== Landing Page =====
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>AI Backend Service</title></head>
      <body style="font-family: sans-serif; padding: 24px; background: #0f172a; color: #e5e7eb;">
        <h1>AI Backend (Gemini)</h1>
        <p>POST <code>/api/chat</code> เพื่อคุยกับ AI</p>
        <p>Log จะถูกส่งต่อไปยัง Google Apps Script + Google Sheet อัตโนมัติ</p>
      </body>
    </html>
  `);
});

// ===== Chat Endpoint =====
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(message);
    const reply = result.response.text();

    // 🔹 บันทึกลง Google Sheet ผ่าน Apps Script
    logToSheetViaAppScript({ message, reply, source: "next-frontend" }).catch(() => {});

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

// ===== Start Server =====
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
