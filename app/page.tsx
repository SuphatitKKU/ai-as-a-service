"use client";

import { useState } from "react";

type ProviderId = "openai" | "claude" | "gemini";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
  provider: ProviderId;
  model: string;
};

const PROVIDERS: Record<
  ProviderId,
  { label: string; models: { id: string; label: string }[] }
> = {
  openai: {
    label: "OpenAI",
    models: [
      { id: "gpt-5", label: "gpt-5" },
      { id: "gpt-5-mini", label: "gpt-5-mini" },
      { id: "gpt-5-nano", label: "gpt-5-nano" },
      { id: "gpt-4.1", label: "gpt-4.1" },
      { id: "gpt-4.1-mini", label: "gpt-4.1-mini" },
      { id: "gpt-4.1-nano", label: "gpt-4.1-nano" },
    ],
  },
  claude: {
    label: "Claude",
    models: [
      { id: "claude-sonnet-4.5", label: "claude-sonnet-4.5" },
      { id: "claude-haiku-4.5", label: "claude-haiku-4.5" },
      { id: "claude-sonnet-4", label: "claude-sonnet-4" },
      { id: "claude-3.7-sonnet", label: "claude-3.7-sonnet" },
    ],
  },
  gemini: {
    label: "Gemini",
    models: [
      { id: "gemini-2.5-pro", label: "gemini-2.5-pro" },
      { id: "gemini-2.5-flash", label: "gemini-2.5-flash" },
      { id: "gemini-2.5-flash-lite", label: "gemini-2.5-flash-lite" },
    ],
  },
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function HomePage() {
  const [provider, setProvider] = useState<ProviderId>("openai");
  const [model, setModel] = useState<string>(
    PROVIDERS["openai"].models[0].id
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const currentModels = PROVIDERS[provider].models;

  function handleChangeProvider(p: ProviderId) {
    setProvider(p);
    setModel(PROVIDERS[p].models[0]?.id || "");
  }

  async function handleSend() {
    if (!input.trim() || !backendUrl || !model || loading) return;

    const text = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text, provider, model },
    ]);
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, model, message: text }),
      });

      const data = await res.json();

      const replyText: string =
        typeof data.reply === "string"
          ? data.reply
          : "No reply from backend.";

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: replyText,
          provider: (data.provider || provider) as ProviderId,
          model: data.model || model,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "เชื่อมต่อ backend ไม่ได้ กรุณาตรวจสอบเซิร์ฟเวอร์หรือค่า NEXT_PUBLIC_BACKEND_URL",
          provider,
          model,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 16,
        background: "#020817",
        color: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          borderRadius: 16,
          border: "1px solid #374151",
          background: "#020817",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            borderBottom: "1px solid #111827",
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>
              Connected to KKU IntelSphere (OpenRouter-style)
            </div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              Multi-Model Playground
            </div>
            <div style={{ fontSize: 9, color: "#6b7280" }}>
              BACKEND: {backendUrl || "NEXT_PUBLIC_BACKEND_URL not set"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: 180,
            }}
          >
            <label
              style={{
                fontSize: 9,
                color: "#9ca3af",
              }}
            >
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) =>
                handleChangeProvider(e.target.value as ProviderId)
              }
              style={{
                padding: "4px 8px",
                borderRadius: 8,
                border: "1px solid #4b5563",
                background: "#020817",
                color: "#e5e7eb",
                fontSize: 11,
              }}
            >
              {Object.entries(PROVIDERS).map(([id, p]) => (
                <option key={id} value={id}>
                  {p.label}
                </option>
              ))}
            </select>

            <label
              style={{
                fontSize: 9,
                color: "#9ca3af",
              }}
            >
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                padding: "4px 8px",
                borderRadius: 8,
                border: "1px solid #4b5563",
                background: "#020817",
                color: "#e5e7eb",
                fontSize: 11,
              }}
            >
              {currentModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflowY: "auto",
            maxHeight: "70vh",
          }}
        >
          {messages.length === 0 && (
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              เลือก Provider + Model ด้านขวา แล้วเริ่มถามคำถามด้านล่างได้เลย ✨
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "6px 8px",
                  borderRadius:
                    m.role === "user"
                      ? "12px 0 12px 12px"
                      : "0 12px 12px 12px",
                  background:
                    m.role === "user" ? "#4f46e5" : "#111827",
                  border:
                    m.role === "user"
                      ? "1px solid #6366f1"
                      : "1px solid #374151",
                  fontSize: 12,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    opacity: 0.7,
                    marginBottom: 2,
                  }}
                >
                  {m.role === "user"
                    ? "คุณ"
                    : `AI · ${m.provider}/${m.model}`}
                </div>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "8px 10px",
            borderTop: "1px solid #111827",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              backendUrl
                ? "พิมพ์ข้อความที่นี่แล้วกด Enter หรือปุ่มส่ง"
                : "กรุณาตั้งค่า NEXT_PUBLIC_BACKEND_URL"
            }
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid #4b5563",
              background: "#020817",
              color: "#e5e7eb",
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !backendUrl}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              cursor:
                loading || !backendUrl ? "not-allowed" : "pointer",
              background:
                loading || !backendUrl ? "#4b5563" : "#4f46e5",
              color: "#e5e7eb",
              boxShadow:
                loading || !backendUrl
                  ? "none"
                  : "0 0 12px rgba(79,70,229,0.8)",
            }}
          >
            {loading ? "กำลังส่ง..." : "ส่ง"}
          </button>
        </div>
      </div>
    </main>
  );
}
