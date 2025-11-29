import { BottomNav } from "../layout";
import { Screen } from "@/pages/ing-app";
import { Search, ChevronRight, CreditCard, PiggyBank, TrendingUp, Home } from "lucide-react";

export function ProductsScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-white shadow-sm z-10">
        <div className="flex items-center gap-2 text-[#FF6200]">
          <span className="font-bold text-lg tracking-tight">Produkte</span>
        </div>
        <div className="flex gap-4 text-[#FF6200]">
          <Search size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ProductCard 
          icon={<CreditCard size={24} className="text-[#FF6200]" />}
          title="Girokonto"
          subtitle="Kostenlos mit der VISA Card"
        />
        
        <ProductCard 
          icon={<PiggyBank size={24} className="text-[#FF6200]" />}
          title="Extra-Konto"
          subtitle="Das Tagesgeldkonto"
        />
        
        <ProductCard 
          icon={<TrendingUp size={24} className="text-[#FF6200]" />}
          title="Direkt-Depot"
          subtitle="Wertpapiere handeln"
        />
        
        <ProductCard 
          icon={<Home size={24} className="text-[#FF6200]" />}
          title="Baufinanzierung"
          subtitle="Ihr Weg ins Eigenheim"
        />
      </div>

      <BottomNav activeTab="products" onNavigate={onNavigate} profile="adult" />
    </div>
  );
}

function ProductCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="bg-white p-5 rounded-xl flex items-center gap-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
       <div className="shrink-0">{icon}</div>
       <div className="flex-1">
          <div className="font-bold text-[#333333]">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
       </div>
       <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
}
