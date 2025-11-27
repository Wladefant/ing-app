import { ScreenHeader } from "../layout";
import { Search, MoreVertical, ArrowUpRight, Eye, CreditCard, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TransactionDetailScreen({ accountType, onBack }: { accountType: string; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader 
        title="Umsatzanzeige" 
        onBack={onBack} 
        rightAction={
          <div className="flex gap-4 text-[#FF6200]">
            <Search size={24} />
            <MoreVertical size={24} />
          </div>
        }
      />

      {/* Sticky Header Summary */}
      <div className="bg-white px-4 py-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-[#FF6200] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xl">🦁</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-[#333333]">{accountType}</div>
            <div className="text-xs text-gray-400">DE10 1234 5678 1234 5678 90</div>
          </div>
          <div className="font-bold text-xl text-[#333333]">2.101,10 EUR</div>
        </div>

        {/* Action Pills */}
        <div className="flex justify-between px-2 pb-2">
           <ActionPill icon={<ArrowUpRight size={20} />} label="Überweisen" active />
           <ActionPill icon={<Eye size={20} />} label="Vorschau" />
           <ActionPill icon={<CreditCard size={20} />} label="Karten" />
           <ActionPill icon={<MoreHorizontal size={20} />} label="Mehr" />
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Date Group */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 font-medium mb-2 px-2">
            <span>12. Februar</span>
            <span>EUR</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100 overflow-hidden">
            <TransactionItem 
              title="Tankstelle Nord" 
              amount="-40,00" 
              type="expense"
            />
            <TransactionItem 
              title="Einkaufszentrum Süd" 
              amount="-22,45" 
              type="expense"
            />
             <TransactionItem 
              title="Sparen" 
              amount="-150,00" 
              type="expense"
            />
          </div>
        </div>

        {/* Date Group */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 font-medium mb-2 px-2">
            <span>10. Februar</span>
            <span>EUR</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100 overflow-hidden">
            <TransactionItem 
              title="Gehalt Februar" 
              amount="+3.450,00" 
              type="income"
            />
            <TransactionItem 
              title="Miete" 
              amount="-1.200,00" 
              type="expense"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionPill({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1">
       <div className={cn(
         "w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm",
         active ? "bg-gray-200 text-[#33307E]" : "bg-[#33307E] text-white"
       )}>
         {icon}
       </div>
       <span className="text-[10px] font-medium text-gray-600">{label}</span> 
    </button>
  );
}

function TransactionItem({ title, amount, type }: { title: string; amount: string; type: "income" | "expense" }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
          type === "income" ? "bg-transparent text-[#008000]" : "bg-transparent text-[#FF6200]"
        )}>
           {type === "income" ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
        </div>
        <span className="font-medium text-[#333333]">{title}</span>
      </div>
      <span className={cn(
        "font-bold shrink-0",
        type === "income" ? "text-[#333333]" : "text-[#333333]"
      )}>
        {amount}
      </span>
    </div>
  );
}
