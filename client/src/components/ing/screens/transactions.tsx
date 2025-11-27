import { ScreenHeader } from "../../layout";
import { Search, MoreVertical, ArrowUp, Eye, CreditCard, MoreHorizontal } from "lucide-react";
import { INGButton } from "../../layout";
import { useState } from "react";
import { CardsListScreen } from "./cards/cards-list";

export function TransactionDetailScreen({ accountType, onBack }: { accountType: string; onBack: () => void }) {
  const [showCards, setShowCards] = useState(false);

  if (showCards) {
    return <CardsListScreen onBack={() => setShowCards(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Umsatzanzeige</h1>
        </div>
        <div className="flex gap-4 text-[#FF6200]">
          <Search size={24} strokeWidth={2.5} />
          <MoreVertical size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
         {/* Account Header */}
         <div className="bg-white p-4 pb-6 mb-2">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-[#FF6200] rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xl">🦁</span>
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <div>
                        <div className="font-bold text-[#333333]">{accountType}</div>
                        <div className="text-xs text-gray-400">DE10 1234 5678 1234 5678 90</div>
                     </div>
                     <div className="font-bold text-[#333333]">2.101,10 EUR</div>
                  </div>
               </div>
            </div>

            {/* Action Bubbles */}
            <div className="flex justify-between px-2">
               <ActionBubble icon={<ArrowUp className="text-white" />} label="Überweisen" />
               <ActionBubble icon={<Eye className="text-white" />} label="Vorschau" />
               <ActionBubble icon={<CreditCard className="text-white" />} label="Karten" onClick={() => setShowCards(true)} />
               <ActionBubble icon={<MoreHorizontal className="text-white" />} label="Mehr" />
            </div>
         </div>

         {/* Transactions List */}
         <div className="bg-white">
            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-y border-gray-100">
               12. Februar
               <span className="float-right">EUR</span>
            </div>
            
            <TransactionRow 
               name="Tankstelle Nord"
               amount="-40,00"
               type="expense"
            />
            <TransactionRow 
               name="Einkaufszentrum-Süd"
               amount="-22,45"
               type="expense"
            />
            <TransactionRow 
               name="Sparen"
               amount="-150,00"
               type="expense"
            />
         </div>
      </div>
    </div>
  );
}

function ActionBubble({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
       <div className="w-12 h-12 rounded-full bg-[#33307E] flex items-center justify-center shadow-sm active:scale-95 transition-transform">
          {icon}
       </div>
       <span className="text-xs text-gray-600">{label}</span>
    </button>
  );
}

function TransactionRow({ name, amount, type }: { name: string; amount: string; type: "income" | "expense" }) {
  return (
    <div className="p-4 flex items-center justify-between border-b border-gray-100 last:border-0">
       <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center text-[#FF6200]">
             {type === "expense" ? (
                <div className="border-b-2 border-[#FF6200] pb-0.5 w-3 flex justify-center">
                   <ArrowUp size={14} className="rotate-45" strokeWidth={2.5} />
                </div>
             ) : (
                <div className="border-b-2 border-green-600 pb-0.5 w-3 flex justify-center text-green-600">
                   <ArrowUp size={14} className="rotate-[225deg]" strokeWidth={2.5} />
                </div>
             )}
          </div>
          <span className="text-[#333333] text-sm font-medium">{name}</span>
       </div>
       <span className={`font-bold text-sm ${type === "expense" ? "text-[#333333]" : "text-green-600"}`}>
          {amount}
       </span>
    </div>
  );
}
