import { ScreenHeader, BottomNav } from "../layout";
import { Screen } from "@/pages/ing-app";
import { PieChart, ArrowRightLeft, Search, Info, User, TrendingUp, Lightbulb } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const data = [
  { name: 'Jan', value: 5630 },
  { name: 'Feb', value: 8000 },
  { name: 'Mar', value: 10000 },
  { name: 'Apr', value: 9500 },
  { name: 'May', value: 11000 },
  { name: 'Jun', value: 12963 },
  { name: 'Jul', value: 12704 },
];

export function InvestScreen({
  onBack,
  onNavigate
}: {
  onBack: () => void,
  onNavigate: (s: Screen) => void
}) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader
        title="Depotübersicht"
        onBack={onBack}
        rightAction={<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><span className="text-gray-600">⚙️</span></div>}
      />

      {/* Top Actions */}
      <div className="flex justify-around py-6 bg-white">
        <InvestAction icon={<Search size={24} />} label="Suche" />
        <InvestAction icon={<ArrowRightLeft size={24} />} label="Orders" />
        <InvestAction icon={<PieChart size={24} />} label="Analyse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main Depot Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm relative">
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
        </div>

        {/* AI Investment Advisor */}
        <div className="bg-gradient-to-br from-[#33307E] to-[#4A47A3] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />

          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Lightbulb className="text-yellow-400" size={20} />
            <span className="font-bold text-sm">Leo's Markt-Update</span>
          </div>

          <p className="text-sm leading-relaxed text-blue-100 mb-4 relative z-10">
            Dein Portfolio ist gut diversifiziert! 🌍 Tech-Aktien sind diese Woche um 2,4% gestiegen. Möchtest du deine Sparpläne anpassen?
          </p>

          <button className="w-full bg-white/20 backdrop-blur-sm py-2 rounded-xl text-sm font-bold hover:bg-white/30 transition-colors border border-white/10">
            Sparplan optimieren
          </button>
        </div>

        {/* Top Movers */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="font-bold text-[#333333] mb-3">Top Movers</div>
          <div className="space-y-3">
            <MoverRow name="NVIDIA Corp." change="+3.2%" isPositive={true} price="420.50 €" />
            <MoverRow name="Tesla Inc." change="-1.5%" isPositive={false} price="215.80 €" />
            <MoverRow name="Apple Inc." change="+0.8%" isPositive={true} price="175.20 €" />
          </div>
        </div>
      </div>

      <BottomNav activeTab="invest" onNavigate={onNavigate} />
    </div>
  );
}

function InvestAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-full bg-[#33307E] flex items-center justify-center text-white shadow-md active:scale-95 transition-transform">
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

function MoverRow({ name, change, isPositive, price }: { name: string, change: string, isPositive: boolean, price: string }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          <TrendingUp size={16} className={isPositive ? '' : 'rotate-180'} />
        </div>
        <span className="font-medium text-sm text-[#333333]">{name}</span>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm text-[#333333]">{price}</div>
        <div className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</div>
      </div>
    </div>
  );
}
