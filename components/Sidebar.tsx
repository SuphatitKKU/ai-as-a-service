import {
  Bot,
  User,
  Menu,
  X,
  ChevronDown,
  Folder,
  FileText,
  UserCircle,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobile,
}: SidebarProps) {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSidebarFullyOpen, setIsSidebarFullyOpen] = useState(false);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountButtonRef.current &&
        !accountButtonRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.propertyName === 'width') {
          setIsSidebarFullyOpen(isSidebarOpen);
        }
      };

      sidebarElement.addEventListener('transitionend', handleTransitionEnd);

      if (isSidebarOpen && window.innerWidth >= 1024) {
        setIsSidebarFullyOpen(true);
      } else if (!isSidebarOpen) {
        setIsSidebarFullyOpen(false);
      }

      return () => {
        sidebarElement.removeEventListener('transitionend', handleTransitionEnd);
      };
    }
  }, [isSidebarOpen]);

  return (
    <aside
      ref={sidebarRef}
      style={{ backgroundColor: "#24252d" }}
      className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out shadow-xl
        ${
          isSidebarOpen ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full"
        }
        lg:relative lg:rounded-2xl lg:translate-x-0 lg:opacity-100
        ${isSidebarOpen ? "lg:w-64" : "lg:w-16"}
      `}
    >
      <div
        className={`h-full flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {(isSidebarFullyOpen || (isMobile && isSidebarOpen)) && (
                <span className="text-white font-semibold whitespace-nowrap transition-opacity duration-300">
                  AI ISS Chatbot
                </span>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            {isMobile && isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-white mb-2 transition-all ${
              !isSidebarOpen && "lg:justify-center lg:px-2"
            }`}
          >
            <Bot className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-sm whitespace-nowrap transition-opacity duration-300 ${
                isSidebarFullyOpen ? "opacity-100" : "opacity-0 lg:hidden"
              }`}
            >
              ผู้ช่วย AI
            </span>
          </button>

          <div className="mt-4 space-y-2">
            <button
              className={`w-full flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:bg-gray-800 rounded-lg transition-all ${
                !isSidebarOpen && "lg:justify-center lg:px-2"
              }`}
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${
                  isSidebarFullyOpen ? "opacity-100" : "opacity-0 lg:hidden"
                }`}
              >
                โปรเจกต์ / เวิร์กสเปซ
              </span>
            </button>
            <button
              className={`w-full flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:bg-gray-800 rounded-lg transition-all ${
                !isSidebarOpen && "lg:justify-center lg:px-2"
              }`}
            >
              <Folder className="w-5 h-5 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${
                  isSidebarFullyOpen ? "opacity-100" : "opacity-0 lg:hidden"
                }`}
              >
                ไฟล์ของฉัน
              </span>
            </button>
          </div>
        </nav>

        <div
          className={`
            bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mx-3 mb-3
            transition-opacity duration-300
            ${isSidebarFullyOpen ? "opacity-100 p-4" : "opacity-0 p-0 h-0 overflow-hidden"}
          `}
        >
          {isSidebarFullyOpen && (
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 flex-shrink-0" />
                <span className="font-semibold">คู่มือการใช้งาน</span>
              </div>
              <p className="text-sm opacity-90 mb-3 break-words">
                เรียนรู้การใช้งานและปลดล็อกศักยภาพ AI
              </p>
              <button className="bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 w-full text-center whitespace-nowrap">
                อ่านคู่มือ
              </button>
            </div>
          )}
        </div>

        <div className="relative p-4 border-t border-gray-800">
          <button
            ref={accountButtonRef}
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            className={`w-full flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-all ${
              !isSidebarOpen && "lg:justify-center"
            }`}
          >
            <img
              src="https://api.dicebear.com/8.x/initials/svg?seed=JD"
              alt="โปรไฟล์"
              className="w-8 h-8 rounded-full ring-2 ring-orange-500 flex-shrink-0"
            />
            <span
              className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                isSidebarFullyOpen ? "opacity-100" : "opacity-0 lg:hidden"
              }`}
            >
              ชื่อผู้ใช้
            </span>
            <ChevronDown
              className={`ml-auto w-4 h-4 transition-all duration-300 ${
                isAccountDropdownOpen ? "rotate-180" : ""
              } ${isSidebarFullyOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}
            />
          </button>

          {isAccountDropdownOpen && isSidebarFullyOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-gray-800 rounded-lg shadow-lg py-2 z-10">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <UserCircle className="w-4 h-4" />
                โปรไฟล์
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Settings className="w-4 h-4" />
                ตั้งค่า
              </a>
              <div className="border-t border-gray-700 my-1"></div>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-400 hover:bg-gray-700 hover:text-orange-300"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </a>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}