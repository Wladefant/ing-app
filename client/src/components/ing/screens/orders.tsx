import { BottomNav } from "../layout";
import { Screen } from "@/pages/ing-app";
import { Search, Calendar, ChevronRight, AlertCircle } from "lucide-react";

export function OrdersScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-white shadow-sm z-10">
        <div className="flex items-center gap-2 text-[#FF6200]">
          <span className="font-bold text-lg tracking-tight">Aufträge</span>
        </div>
        <div className="flex gap-4 text-[#FF6200]">
          <Search size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center">
          <Calendar size={48} className="text-gray-300 mb-4" />
          <h2 className="font-bold text-[#333333] mb-2">Keine Aufträge</h2>
          <p className="text-gray-500 text-sm">
            Sie haben derzeit keine offenen Aufträge oder Daueraufträge.
          </p>
        </div>
      </div>

      <BottomNav activeTab="orders" onNavigate={onNavigate} />
    </div>
  );
}
