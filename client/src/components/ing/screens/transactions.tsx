import { ScreenHeader } from "../layout";
import { Search, MoreVertical, ArrowUp, Eye, CreditCard, MoreHorizontal, X, TrendingUp, TrendingDown, Calendar, ChevronRight } from "lucide-react";
import { INGButton } from "../layout";
import { useState, useEffect, useMemo } from "react";
import { CardsListScreen } from "./cards/cards-list";
import { getTransactions, getBalance, formatCurrency, type Transaction } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";

const CATEGORY_ICONS: Record<string, string> = {
  "Wohnen": "🏠", "Miete": "🏠", "Essen": "🍕", "Restaurant": "🍕",
  "Lebensmittel": "🛒", "Transport": "🚗", "Mobilität": "🚗",
  "Freizeit": "🎮", "Entertainment": "🎮", "Shopping": "🛍️",
  "Gehalt": "💰", "Einkommen": "💰", "Investment": "📈",
  "Überweisung": "💸", "Abo": "🔄", "Sonstiges": "📦",
};

export function TransactionDetailScreen({ 
  accountType, 
  onBack,
  onLeoClick,
  onAskLeoAbout,
}: { 
  accountType: string; 
  onBack: () => void;
  onLeoClick?: () => void;
  onAskLeoAbout?: (context: string) => void;
}) {
  const [showCards, setShowCards] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState({ girokonto: 0, extraKonto: 0, depot: 0 });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Load transactions and balance on mount
  useEffect(() => {
    setTransactions(getTransactions());
    setBalance(getBalance());
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(t => 
      (t.to?.toLowerCase().includes(q)) || 
      (t.from?.toLowerCase().includes(q)) || 
      (t.reference?.toLowerCase().includes(q)) ||
      (t.category?.toLowerCase().includes(q))
    );
  }, [transactions, searchQuery]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }, [filteredTransactions]);

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Heute";
    if (date.toDateString() === yesterday.toDateString()) return "Gestern";
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
  };

  const countTransactionsTo = (name: string) => {
    return transactions.filter(t => t.to === name || t.from === name).length;
  };

  const totalSpentAt = (name: string) => {
    return transactions
      .filter(t => t.to === name || t.from === name)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAskLeo = (txn: Transaction) => {
    const name = txn.amount < 0 ? txn.to : txn.from;
    const context = `Der Nutzer fragt über eine Transaktion: ${name}, Betrag: ${txn.amount.toFixed(2)}€, Datum: ${txn.date}, Kategorie: ${txn.category || "Sonstiges"}, Referenz: ${txn.reference}. Der Nutzer hat insgesamt ${countTransactionsTo(name)} Transaktionen mit ${name} und insgesamt ${totalSpentAt(name).toFixed(2)}€ dort ausgegeben/erhalten. Beantworte Fragen über diese Transaktion oder den Empfänger.`;
    onAskLeoAbout?.(context);
  };

  if (showCards) {
    return <CardsListScreen onBack={() => setShowCards(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]" title="Zurück">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Transaktionen</h1>
        </div>
        <div className="flex gap-3 text-[#FF6200]">
          <button onClick={() => setShowSearch(!showSearch)}>
            <Search size={22} strokeWidth={2.5} />
          </button>
          <MoreVertical size={22} strokeWidth={2.5} />
        </div>
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white px-4 pb-3 overflow-hidden"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Transaktion suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6200]/30"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto">
         <div className="bg-white p-4 pb-6 mb-2">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-[#FF6200] rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xl">🦁</span>
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <div>
                        <div className="font-bold text-[#333333]">{accountType}</div>
                        <div className="text-xs text-gray-400">DE10 •••• •••• 1234</div>
                     </div>
                     <div className="font-bold text-[#333333]">{formatCurrency(balance.girokonto)}</div>
                  </div>
               </div>
            </div>

            <div className="flex justify-between px-2">
               <ActionBubble icon={<ArrowUp className="text-white" />} label="Überweisen" />
               <ActionBubble icon={<Eye className="text-white" />} label="Vorschau" />
               <ActionBubble icon={<CreditCard className="text-white" />} label="Karten" onClick={() => setShowCards(true)} />
               <ActionBubble icon={<MoreHorizontal className="text-white" />} label="Mehr" />
            </div>
         </div>

         <div className="bg-white">
            {Object.entries(groupedTransactions)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, txns]) => (
                <div key={date}>
                  <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-y border-gray-100 font-medium">
                    {formatDateDisplay(date)}
                  </div>
                  {txns.map((txn) => (
                    <TransactionRow 
                      key={txn.id}
                      transaction={txn}
                      onClick={() => setSelectedTransaction(txn)}
                    />
                  ))}
                </div>
              ))}
            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                {searchQuery ? "Keine Treffer gefunden" : "Keine Transaktionen vorhanden"}
              </div>
            )}
         </div>
      </div>

      <AnimatePresence>
        {selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            transactionCount={countTransactionsTo(selectedTransaction.amount < 0 ? selectedTransaction.to : selectedTransaction.from)}
            totalAmount={totalSpentAt(selectedTransaction.amount < 0 ? selectedTransaction.to : selectedTransaction.from)}
            onClose={() => setSelectedTransaction(null)}
            onAskLeo={() => handleAskLeo(selectedTransaction)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionBubble({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
       <motion.div whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-full bg-[#33307E] flex items-center justify-center shadow-sm">
          {icon}
       </motion.div>
       <span className="text-xs text-gray-600">{label}</span>
    </button>
  );
}

function TransactionRow({ transaction, onClick }: { transaction: Transaction; onClick: () => void }) {
  const name = transaction.amount < 0 ? transaction.to : transaction.from;
  const isExpense = transaction.amount < 0;
  const icon = CATEGORY_ICONS[transaction.category || "Sonstiges"] || "📦";

  return (
    <motion.button
      whileTap={{ scale: 0.98, backgroundColor: "#f9f9f9" }}
      onClick={onClick}
      className="w-full p-4 flex items-center justify-between border-b border-gray-50 text-left active:bg-gray-50 transition-colors"
    >
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
            {icon}
          </div>
          <div>
            <div className="text-sm font-medium text-[#333333]">{name}</div>
            <div className="text-[10px] text-gray-400">
              {transaction.category || transaction.type} • {transaction.reference?.substring(0, 20)}
            </div>
          </div>
       </div>
       <div className="flex items-center gap-2">
         <span className={`font-bold text-sm ${isExpense ? "text-[#333333]" : "text-green-600"}`}>
           {isExpense ? "" : "+"}
           {transaction.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
         </span>
         <ChevronRight size={14} className="text-gray-300" />
       </div>
    </motion.button>
  );
}

function TransactionDetailModal({ 
  transaction, transactionCount, totalAmount, onClose, onAskLeo 
}: { 
  transaction: Transaction; transactionCount: number; totalAmount: number;
  onClose: () => void; onAskLeo: () => void;
}) {
  const name = transaction.amount < 0 ? transaction.to : transaction.from;
  const isExpense = transaction.amount < 0;
  const icon = CATEGORY_ICONS[transaction.category || "Sonstiges"] || "📦";
  const date = new Date(transaction.date);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-3xl overflow-hidden max-h-[85%] flex flex-col"
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <div className="flex items-center justify-between mb-5 pt-2">
            <h2 className="text-lg font-bold text-[#333]">Transaktionsdetails</h2>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
              {icon}
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg text-[#333]">{name}</div>
              <div className="text-xs text-gray-400">{transaction.category || transaction.type}</div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${isExpense ? "text-[#333]" : "text-green-600"}`}>
                {isExpense ? "" : "+"}{transaction.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-4">
            <DetailRow label="Datum" value={date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <DetailRow label="Verwendungszweck" value={transaction.reference || "-"} />
            <DetailRow label="Von" value={isExpense ? "Girokonto" : transaction.from} />
            <DetailRow label="An" value={isExpense ? transaction.to : "Girokonto"} />
            <DetailRow label="Status" value={
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                transaction.status === "completed" ? "bg-green-100 text-green-700" :
                transaction.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
              }`}>
                {transaction.status === "completed" ? "Abgeschlossen" : transaction.status === "pending" ? "Ausstehend" : "Fehlgeschlagen"}
              </span>
            } />
            <DetailRow label="Kategorie" value={`${icon} ${transaction.category || "Sonstiges"}`} />
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-bold text-orange-800 text-sm">Leo's Einblick</span>
              <span className="bg-[#FF6200] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">KI</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <Calendar size={12} className="text-orange-500 shrink-0" />
                <span>Du hast <b>{transactionCount}</b> Transaktionen mit {name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                {totalAmount < 0 ? (
                  <TrendingDown size={12} className="text-red-500 shrink-0" />
                ) : (
                  <TrendingUp size={12} className="text-green-500 shrink-0" />
                )}
                <span>Gesamt: <b>{totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</b> {totalAmount < 0 ? "ausgegeben" : "erhalten"}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onAskLeo}
            className="w-full bg-[#FF6200] text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
          >
            <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
            Leo über {name} fragen
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-medium text-[#333] text-right max-w-[60%]">{value}</span>
    </div>
  );
}
