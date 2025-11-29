import { ScreenHeader } from "../layout";
import { Search, MoreVertical, ArrowUp, Eye, CreditCard, MoreHorizontal } from "lucide-react";
import { INGButton } from "../layout";
import { useState, useEffect } from "react";
import { CardsListScreen } from "./cards/cards-list";
import { getTransactions, getBalance, formatCurrency, type Transaction } from "@/lib/storage";

export function TransactionDetailScreen({ accountType, onBack }: { accountType: string; onBack: () => void }) {
  const [showCards, setShowCards] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState({ girokonto: 0, extraKonto: 0, depot: 0 });

  // Load transactions and balance on mount
  useEffect(() => {
    setTransactions(getTransactions());
    setBalance(getBalance());
  }, []);

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
  };

  if (showCards) {
    return <CardsListScreen onBack={() => setShowCards(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]" title="Zurück">
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
                     <div className="font-bold text-[#333333]">{formatCurrency(balance.girokonto)}</div>
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
            {Object.entries(groupedTransactions)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, txns]) => (
                <div key={date}>
                  <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-y border-gray-100">
                    {formatDateDisplay(date)}
                    <span className="float-right">EUR</span>
                  </div>
                  {txns.map((txn) => (
                    <TransactionRow 
                      key={txn.id}
                      name={txn.amount < 0 ? txn.to : txn.from}
                      amount={txn.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, signDisplay: 'always' }).replace('+', '')}
                      type={txn.amount < 0 ? "expense" : "income"}
                    />
                  ))}
                </div>
              ))}
            {transactions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Keine Transaktionen vorhanden
              </div>
            )}
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
