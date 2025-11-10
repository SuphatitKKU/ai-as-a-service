import { Send, Bot, User, Menu, X, ChevronDown } from "lucide-react";
import { useRef, useEffect } from "react";

type ProviderId = "openai" | "claude" | "gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: ProviderId;
  model?: string;
}

interface ChatProps {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  handleSubmit: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  selectedProvider: ProviderId;
  setSelectedProvider: (provider: ProviderId) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  providers: Record<ProviderId, { label: string; models: { id: string; label: string }[] }>;
  backendUrl: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

export default function Chat({
  messages,
  input,
  setInput,
  isLoading,
  handleSubmit,
  handleKeyPress,
  selectedProvider,
  setSelectedProvider,
  selectedModel,
  setSelectedModel,
  providers,
  backendUrl,
  isSidebarOpen,
  setIsSidebarOpen,
  isHistoryOpen,
  setIsHistoryOpen,
  isMobile,
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const currentModels = providers[selectedProvider].models;

  return (
    <div
      className={`flex-1 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden
        ${(isSidebarOpen || isHistoryOpen) && isMobile ? "hidden" : "flex"}
      `}
    >
      <header className="border-b border-gray-200 bg-white rounded-t-2xl">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-gray-600 lg:hidden"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                ผู้ช่วยแชท AI
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    const newProvider = e.target.value as ProviderId;
                    setSelectedProvider(newProvider);
                    setSelectedModel(providers[newProvider].models[0]?.id || "");
                  }}
                  className="appearance-none bg-gray-50 text-gray-700 pl-3 pr-8 py-1.5 md:pl-4 md:pr-10 md:py-2 rounded-lg text-xs md:text-sm border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 cursor-pointer"
                >
                  {Object.entries(providers).map(([id, p]) => (
                    <option key={id} value={id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="appearance-none bg-gray-50 text-gray-700 pl-3 pr-8 py-1.5 md:pl-4 md:pr-10 md:py-2 rounded-lg text-xs md:text-sm border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 cursor-pointer"
                >
                  {currentModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 pointer-events-none" />
              </div>
              <button
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="text-gray-600 hover:text-gray-800 text-xs md:text-sm lg:hidden"
              >
                ประวัติ <span className="text-gray-400">6 / 50</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden bg-gray-50 p-2 md:p-4 gap-2 md:gap-4 rounded-b-2xl relative">
        <div className="flex-1 flex flex-col bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <div className="mx-auto max-w-3xl">
              <div className="space-y-4 md:space-y-6">
                {messages.length === 1 && messages[0].role === "assistant" && ( // Only show initial message
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                      <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="max-w-[80%] md:max-w-[70%] rounded-xl md:rounded-2xl bg-gray-50 text-gray-800 border border-gray-200 px-4 py-3 md:px-5 md:py-4">
                      <p className="text-sm leading-relaxed">{messages[0].content}</p>
                    </div>
                  </div>
                )}
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 text-sm">
                    เลือก Provider + Model ด้านบน แล้วเริ่มถามคำถามด้านล่างได้เลย ✨
                  </div>
                )}
                {messages.filter(msg => msg.id !== "1").map((message) => ( // Filter out the initial welcome message from the map
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-orange-500 to-red-600"
                          : "bg-gradient-to-br from-orange-500 to-red-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] md:max-w-[70%] rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-orange-500 to-red-600 text-white"
                          : "bg-gray-50 text-gray-800 border border-gray-200"
                      }`}
                    >
                       {message.role === "assistant" && message.provider && message.model && (
                        <div className="text-xs text-gray-500 mb-1">
                          AI · {message.provider}/{message.model}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                      <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="max-w-[80%] md:max-w-[70%] rounded-xl md:rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 md:px-5 md:py-4">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </main>

          <footer className="border-t border-gray-200 bg-white px-4 py-3 md:px-6 md:py-4">
            <div className="mx-auto max-w-3xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    backendUrl
                      ? "พิมพ์ข้อความที่นี่แล้วกด Enter หรือปุ่มส่ง"
                      : "กรุณาตั้งค่า NEXT_PUBLIC_BACKEND_URL"
                  }
                  className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  disabled={isLoading || !backendUrl}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading || !backendUrl}
                  className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2 md:mt-3">
                ตัวอย่างการวิจัยฟรี ChatGPT อาจให้ข้อมูลที่ไม่ถูกต้องเกี่ยวกับบุคคล
                สถานที่ หรือข้อเท็จจริง
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}