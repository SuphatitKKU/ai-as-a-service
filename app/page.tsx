"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Menu, X, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "สวัสดีครับ! ผมคือ AI Chatbot พร้อมช่วยเหลือคุณแล้วครับ มีอะไรให้ช่วยไหมครับ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // เริ่มต้นเป็น false บนเซิร์ฟเวอร์
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); // เริ่มต้นเป็น false บนเซิร์ฟเวอร์
  const [isMobile, setIsMobile] = useState(false); // เพิ่ม state เพื่อเก็บสถานะว่าเป็นมือถือหรือไม่
  const [selectedModel, setSelectedModel] = useState("GPT-3.5 Turbo"); // <-- เพิ่มบรรทัดนี้!
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ปรับให้ sidebar และ history sidebar ปิด/เปิดตามขนาดจอ
  useEffect(() => {
    // ต้องตรวจสอบว่าโค้ดนี้รันบนไคลเอนต์เท่านั้น
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const mobileBreakpoint = 1024; // lg breakpoint in Tailwind is 1024px
        const currentIsMobile = window.innerWidth < mobileBreakpoint;
        setIsMobile(currentIsMobile);

        if (currentIsMobile) {
          setIsSidebarOpen(false); // ปิด sidebar บนจอเล็ก
          setIsHistoryOpen(false); // ปิดประวัติด้วยบนจอเล็ก
        } else {
          setIsSidebarOpen(true); // เปิด sidebar บนจอใหญ่
          setIsHistoryOpen(true); // เปิดประวัติด้วยบนจอใหญ่
        }
      };

      handleResize(); // ตั้งค่าเริ่มต้นเมื่อคอมโพเนนต์เมาท์
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // [] เพื่อให้รันเพียงครั้งเดียวเมื่อคอมโพเนนต์เมาท์

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // จำลองการตอบกลับจาก AI
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `(โมเดล: ${selectedModel}) ขอบคุณที่ส่งข้อความมาครับ คุณพูดว่า: "${userMessage.content}" - นี่เป็นตัวอย่างการตอบกลับอัตโนมัติครับ ในการใช้งานจริง คุณจะต้องเชื่อมต่อกับ API ของ AI ครับ`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 p-2 md:p-4 lg:p-4 gap-2 md:gap-4 lg:gap-4 relative">
      {/* แถบด้านข้าง (Sidebar) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-gray-950 transition-all duration-300 shadow-xl overflow-hidden
          ${isSidebarOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'} 
          lg:w-64 lg:opacity-100 lg:relative lg:rounded-2xl lg:translate-x-0
        `}
      >
        <div className="w-64 h-full flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">มายด์เมิร์จ</span>
            </div>
          </div>
          
          <nav className="flex-1 p-3">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-white mb-2">
              <Bot className="w-5 h-5" />
              <span className="text-sm">ผู้ช่วยแชท AI</span>
            </button>
            
            <div className="mt-4 space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:bg-gray-800 rounded-lg">
                <span>📄</span>
                <span>เทมเพลต</span>
                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded">PRO</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:bg-gray-800 rounded-lg">
                <span>📁</span>
                <span>โปรเจกต์ของฉัน</span>
                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded">PRO</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:bg-gray-800 rounded-lg">
                <span>📊</span>
                <span>สถิติ</span>
                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded">PRO</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:bg-gray-800 rounded-lg">
                <span>⚙️</span>
                <span>ตั้งค่า</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:bg-gray-800 rounded-lg">
                <span>❓</span>
                <span>อัปเดต & คำถามที่พบบ่อย</span>
              </button>
            </div>
          </nav>
          
          <div className="p-4 m-3 bg-gradient-to-br from-red-600 to-red-800 rounded-xl">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-6 h-6" />
                <span className="font-semibold">แพลนโปร</span>
              </div>
              <p className="text-sm opacity-90 mb-3">เสริมความฉลาดของ AI รับแพลนเลย!</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">$10 <span className="text-sm font-normal">/ เดือน</span></span>
                <button className="bg-white text-red-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100">
                  รับเลย
                </button>
              </div>
            </div>
          </div>
          
          <button className="p-4 border-t border-gray-800 text-gray-400 hover:text-white flex items-center gap-2">
            <span>🚪</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Overlay สำหรับมือถือเมื่อ Sidebar เปิด */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* เนื้อหาหลัก */}
      <div 
        className={`flex-1 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden 
          ${(isSidebarOpen || isHistoryOpen) && isMobile ? 'hidden' : 'flex'} 
        `}
      >
        {/* ส่วนหัว */}
        <header className="border-b border-gray-200 bg-white rounded-t-2xl">
          <div className="px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-gray-400 hover:text-gray-600 lg:hidden" // แสดงเฉพาะบนจอเล็ก
                >
                  {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                  ผู้ช่วยแชท AI
                </h1>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                {/* ช่องเลือกโมเดล */}
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none bg-gray-50 text-gray-700 pl-3 pr-8 py-1.5 md:pl-4 md:pr-10 md:py-2 rounded-lg text-xs md:text-sm border border-gray-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 cursor-pointer"
                  >
                    <option value="GPT-3.5 Turbo">GPT-3.5 Turbo</option>
                    <option value="GPT-4">GPT-4</option>
                    <option value="Claude 3 Opus">Claude 3 Opus</option>
                  </select>
                  <ChevronDown className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 pointer-events-none" />
                </div>
                {/* จบช่องเลือกโมเดล */}
                <button 
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="text-gray-600 hover:text-gray-800 text-xs md:text-sm lg:hidden" // แสดงปุ่มประวัติบนจอเล็ก
                >
                  ประวัติ <span className="text-gray-400">6 / 50</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* พื้นที่เนื้อหา: กรอบแชท และแถบด้านข้างประวัติ */}
        <div className="flex-1 flex overflow-hidden bg-gray-50 p-2 md:p-4 gap-2 md:gap-4 rounded-b-2xl relative">
          {/* กรอบแชท */}
          <div className="flex-1 flex flex-col bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* พื้นที่ข้อความ */}
            <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
              <div className="mx-auto max-w-3xl">
                <div className="space-y-4 md:space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-red-500 to-red-700"
                            : "bg-gradient-to-br from-red-600 to-red-800"
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
                            ? "bg-gradient-to-br from-red-500 to-red-700 text-white"
                            : "bg-gray-50 text-gray-800 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800">
                        <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      </div>
                      <div className="max-w-[80%] md:max-w-[70%] rounded-xl md:rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 md:px-5 md:py-4">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-red-400 [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-red-400 [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-red-400"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </main>
            
            {/* พื้นที่ป้อนข้อมูล */}
            <footer className="border-t border-gray-200 bg-white px-4 py-3 md:px-6 md:py-4">
              <div className="mx-auto max-w-3xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="เริ่มพิมพ์..."
                    className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2 md:mt-3">
                  ตัวอย่างการวิจัยฟรี ChatGPT อาจให้ข้อมูลที่ไม่ถูกต้องเกี่ยวกับบุคคล สถานที่ หรือข้อเท็จจริง
                </p>
              </div>
            </footer>
          </div>

          {/* แถบด้านข้างประวัติ (History Sidebar) */}
          <aside 
            className={`fixed inset-y-0 right-0 z-50 bg-white transition-all duration-300 shadow-xl overflow-hidden
              ${isHistoryOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full'} 
              lg:w-80 lg:opacity-100 lg:relative lg:rounded-2xl lg:border lg:border-gray-200 
              p-4
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">ประวัติ</h2>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="text-gray-400 hover:text-gray-600 lg:hidden" // แสดงเฉพาะบนจอเล็ก
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-gray-500 mb-4">6 / 50</div>
            
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start gap-2 mb-2">
                  <input type="checkbox" className="mt-1 accent-red-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">สร้างฟอร์มต้อนรับ</h3>
                    <p className="text-xs text-gray-500">เขียนโค้ด (HTML, CSS และ JS) สำหรับฟอร์มง่ายๆ...</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start gap-2 mb-2">
                  <input type="checkbox" className="mt-1 accent-red-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">คำแนะนำ</h3>
                    <p className="text-xs text-gray-500">วิธีการตั้งค่าเครือข่ายไร้สาย Wi-Fi?</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start gap-2 mb-2">
                  <input type="checkbox" className="mt-1 accent-red-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">อาชีพ</h3>
                    <p className="text-xs text-gray-500">วิธีจัดระเบียบการทำงานประจำวันให้มีประสิทธิภาพ?</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start gap-2 mb-2">
                  <input type="checkbox" className="mt-1 accent-red-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">อาชีพ</h3>
                    <p className="text-xs text-gray-500">เคล็ดลับในการเพิ่มประสิทธิภาพการทำงาน</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start gap-2 mb-2">
                  <input type="checkbox" className="mt-1 accent-red-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">การปฐมนิเทศ</h3>
                    <p className="text-xs text-gray-500">ปัญญาประดิษฐ์ทำงานอย่างไร?</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start gap-2 mb-2">
                  <input type="checkbox" className="mt-1 accent-red-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">การปฐมนิเทศ</h3>
                    <p className="text-xs text-gray-500">คุณทำอะไรได้บ้าง?</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50">
              🗑️ ล้างประวัติ
            </button>
          </aside>

          {/* Overlay สำหรับมือถือเมื่อ History Sidebar เปิด */}
          {isHistoryOpen && isMobile && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
              onClick={() => setIsHistoryOpen(false)}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}