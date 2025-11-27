import { ScreenHeader } from "../layout";
import { Screen } from "@/pages/ing-app";
import { PieChart, ArrowRightLeft, Search, Info, User } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: 'Jan', value: 5630 },
  { name: 'Feb', value: 8000 },
  { name: 'Mar', value: 10000 },
  { name: 'Apr', value: 9500 },
  { name: 'May', value: 11000 },
  { name: 'Jun', value: 12963 },
  { name: 'Jul', value: 12704 },
];

export function InvestScreen({ onBack, onNavigate }: { onBack: () => void, onNavigate: (s: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader 
        title="Depotübersicht" 
        onBack={onBack}
        rightAction={<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><span className="text-gray-600">⚙️</span></div>}
      />
      
      {/* Top Actions */}
      <div className="flex justify-around py-6 bg-white">
         <InvestAction icon={<Search size={24} />} label="Wertpapiersuche" />
         <InvestAction icon={<ArrowRightLeft size={24} />} label="Orders & Sparpläne" />
         <InvestAction icon={<PieChart size={24} />} label="Gewichtung" />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 relative">
           <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF6200] rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl">🦁</span>
              </div>
              <div>
                <div className="font-bold text-[#333333]">Direkt-Depot</div>
                <div className="text-xs text-gray-400">1234567890</div>
              </div>
           </div>

           <div className="mb-1 text-xs text-gray-500">Gesamtwert</div>
           <div className="flex items-center gap-2 mb-1">
             <span className="text-3xl font-bold text-[#333333]">12.704,96 EUR</span>
             <Info size={16} className="text-blue-500" />
           </div>
           <div className="text-xs text-gray-400 mb-8">Vor wenigen Sekunden</div>

           {/* Person Icon helper */}
           <div className="absolute right-6 top-32 text-[#FF6200]">
              <User size={20} />
           </div>

           {/* Chart */}
           <div className="h-40 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line type="stepAfter" dataKey="value" stroke="#33307E" strokeWidth={2} dot={false} />
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
           </div>

           {/* Time Selectors */}
           <div className="bg-gray-100 rounded-lg p-1 flex justify-between mb-4">
              <TimeSelector label="1 M" />
              <TimeSelector label="1 J" active />
              <TimeSelector label="3 J" />
              <TimeSelector label="Max" />
           </div>

           <button className="w-full py-3 border-t border-gray-100 flex items-center gap-2 text-[#FF6200] font-bold text-sm">
              <div className="w-4 h-0.5 bg-[#FF6200]" />
              <div className="w-4 h-0.5 bg-[#FF6200]" />
              <span className="text-[#333333] ml-2 flex-1 text-left">Chart als Tabelle anzeigen</span>
              <ChevronRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
}

function InvestAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-full bg-[#33307E] flex items-center justify-center text-white shadow-md">
        {icon}
      </div>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </button>
  );
}

function TimeSelector({ label, active }: { label: string; active?: boolean }) {
  return (
    <button className={cn(
      "px-4 py-1 rounded-md text-sm font-medium transition-colors flex-1",
      active ? "bg-[#33307E] text-white" : "text-gray-500 hover:bg-gray-200"
    )}>
      {label}
    </button>
  );
}
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
