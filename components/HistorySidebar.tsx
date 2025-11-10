import { X, PlusCircle, MessageSquare, History } from "lucide-react";

interface HistorySidebarProps {
  isHistoryOpen: boolean;
  setIsHistoryOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

export default function HistorySidebar({
  isHistoryOpen,
  setIsHistoryOpen,
  isMobile,
}: HistorySidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 right-0 z-50 bg-white transition-all duration-300 shadow-xl overflow-hidden
          ${isHistoryOpen ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-full"}
          lg:w-80 lg:opacity-100 lg:relative lg:rounded-2xl lg:border lg:border-gray-200
          p-4 flex flex-col
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">ประวัติ</h2>
          <button
            onClick={() => setIsHistoryOpen(false)}
            className="text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-500 mb-4">6 / 50</div>

        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-lg text-sm font-medium mb-4 flex-shrink-0">
          <PlusCircle className="w-5 h-5" />
          เริ่มการสนทนาใหม่
        </button>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
            <div className="flex-1 overflow-hidden">
              <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">
                สร้างฟอร์มต้อนรับ
              </h3>
              <p className="text-xs text-gray-500 truncate">
                เขียนโค้ด (HTML, CSS และ JS) สำหรับฟอร์มง่ายๆ...
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
            <div className="flex-1 overflow-hidden">
              <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">
                คำแนะนำ
              </h3>
              <p className="text-xs text-gray-500 truncate">
                วิธีการตั้งค่าเครือข่ายไร้สาย Wi-Fi?
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
            <div className="flex-1 overflow-hidden">
              <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">
                อาชีพ
              </h3>
              <p className="text-xs text-gray-500 truncate">
                วิธีจัดระเบียบการทำงานประจำวันให้มีประสิทธิภาพ?
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
            <div className="flex-1 overflow-hidden">
              <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">
                อาชีพ
              </h3>
              <p className="text-xs text-gray-500 truncate">
                เคล็ดลับในการเพิ่มประสิทธิภาพการทำงาน
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
            <div className="flex-1 overflow-hidden">
              <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">
                การปฐมนิเทศ
              </h3>
              <p className="text-xs text-gray-500 truncate">
                ปัญญาประดิษฐ์ทำงานอย่างไร?
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
            <div className="flex-1 overflow-hidden">
              <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">
                การปฐมนิเทศ
              </h3>
              <p className="text-xs text-gray-500 truncate">
                คุณทำอะไรได้บ้าง?
              </p>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 flex-shrink-0">
          <History className="w-4 h-4" /> ล้างประวัติทั้งหมด
        </button>
      </aside>

      {isHistoryOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsHistoryOpen(false)}
        ></div>
      )}
    </>
  );
}