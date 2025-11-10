"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function handleSend() {
    if (!input.trim() || !backendUrl) return;

    const userText = input.trim();

    // เคลียร์ช่อง + push ข้อความ user ลงหน้าจอ
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      const replyText =
        typeof data.reply === "string"
          ? data.reply
          : "ไม่พบคำตอบจาก backend (เช็ค /api/chat สิ)";

      setMessages((prev) => [...prev, { role: "ai", text: replyText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "เกิดข้อผิดพลาดในการเชื่อมต่อ backend. กรุณาลองใหม่อีกครั้ง.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "32px 16px",
        display: "flex",
        justifyContent: "center",
        background: "#020817",
        color: "#e5e7eb",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          background: "#020817",
          borderRadius: 16,
          border: "1px solid rgba(148,163,253,0.28)",
          boxShadow: "0 18px 40px rgba(15,23,42,0.75)",
          padding: 20,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#9ca3af",
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#22c55e",
                  boxShadow: "0 0 10px #22c55e",
                }}
              />
              Connected to Backend
            </div>
            <h1
              style={{
                fontSize: 20,
                margin: 0,
                fontWeight: 600,
                color: "#e5e7eb",
              }}
            >
              AI Chat UI (Frontend)
            </h1>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>
              ข้อความทุกครั้งจะถูกส่งไป Backend ที่{" "}
              <code
                style={{
                  fontSize: 10,
                  padding: "2px 4px",
                  borderRadius: 6,
                  background: "#020817",
                  border: "1px solid rgba(75,85,99,0.9)",
                }}
              >
                {backendUrl || "NEXT_PUBLIC_BACKEND_URL not set"}
              </code>
            </p>
          </div>
        </header>

        {/* กล่องแชท */}
        <div
          style={{
            borderRadius: 12,
            border: "1px solid rgba(75,85,99,0.9)",
            padding: 12,
            minHeight: 260,
            maxHeight: 420,
            overflowY: "auto",
            background:
              "radial-gradient(circle at top, rgba(79,70,229,0.08), transparent)",
            fontSize: 13,
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              เริ่มต้นพิมพ์ข้อความด้านล่างเพื่อถาม AI ได้เลย ✨
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: 8,
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "6px 8px",
                  borderRadius:
                    m.role === "user"
                      ? "10px 0 10px 10px"
                      : "0 10px 10px 10px",
                  background:
                    m.role === "user"
                      ? "rgba(79,70,229,0.95)"
                      : "rgba(15,23,42,0.98)",
                  border:
                    m.role === "user"
                      ? "1px solid rgba(129,140,248,0.7)"
                      : "1px solid rgba(75,85,99,0.9)",
                  color: "#e5e7eb",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    opacity: 0.7,
                    marginBottom: 2,
                  }}
                >
                  {m.role === "user" ? "คุณ" : "AI"}
                </div>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: "#9ca3af",
              }}
            >
              AI กำลังคิดอยู่...
            </div>
          )}
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              backendUrl
                ? "พิมพ์ข้อความแล้วกด Enter หรือปุ่มส่ง"
                : "กรุณาตั้งค่า NEXT_PUBLIC_BACKEND_URL ก่อน"
            }
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid rgba(75,85,99,0.9)",
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
              cursor: loading || !backendUrl ? "not-allowed" : "pointer",
              background: loading || !backendUrl ? "#4b5563" : "#4f46e5",
              color: "#e5e7eb",
              boxShadow:
                loading || !backendUrl
                  ? "none"
                  : "0 0 14px rgba(79,70,229,0.8)",
              transition: "all 0.15s ease",
            }}
          >
            {loading ? "กำลังส่ง..." : "ส่ง"}
          </button>
        </div>
      </div>
    </main>
  );
}
