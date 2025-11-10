"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import HistorySidebar from "../components/HistorySidebar";

type ProviderId = "openai" | "claude" | "gemini";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: ProviderId; // Add provider
  model?: string;       // Add model
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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "สวัสดีครับ! ผมคือ AI Chatbot พร้อมช่วยเหลือคุณแล้วครับ มีอะไรให้ช่วยไหมครับ?",
      provider: "openai", // Default provider for initial message
      model: "gpt-5", // Default model for initial message
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState<ProviderId>("openai");
  const [selectedModel, setSelectedModel] = useState<string>(PROVIDERS["openai"].models[0].id);

  const handleResize = useCallback(() => {
    const mobileBreakpoint = 1024;
    const currentIsMobile = window.innerWidth < mobileBreakpoint;
    setIsMobile(currentIsMobile);

    if (currentIsMobile) {
      setIsSidebarOpen(false);
      setIsHistoryOpen(false);
    } else {
      setIsSidebarOpen(true);
      setIsHistoryOpen(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener("resize", handleResize);

      // Set initial model based on default provider
      setSelectedModel(PROVIDERS[selectedProvider].models[0].id);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [handleResize, selectedProvider]);


  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !backendUrl) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      provider: selectedProvider,
      model: selectedModel,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: selectedProvider, model: selectedModel, message: userMessage.content }),
      });

      const data = await res.json();

      const aiReplyContent: string =
        typeof data.reply === "string"
          ? data.reply
          : "เชื่อมต่อ backend ไม่ได้ กรุณาตรวจสอบเซิร์ฟเวอร์หรือค่า NEXT_PUBLIC_BACKEND_URL";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiReplyContent,
        provider: (data.provider || selectedProvider) as ProviderId,
        model: data.model || selectedModel,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI โปรดลองอีกครั้งในภายหลัง",
        provider: selectedProvider,
        model: selectedModel,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-screen p-2 md:p-4 lg:p-4 gap-2 md:gap-4 lg:gap-4 relative" style={{backgroundColor: '#24252d'}}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Chat
        messages={messages}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        handleKeyPress={handleKeyPress}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        providers={PROVIDERS}
        backendUrl={backendUrl}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
        isMobile={isMobile}
      />

      <HistorySidebar
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
        isMobile={isMobile}
      />
    </div>
  );
}