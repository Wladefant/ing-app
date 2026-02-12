import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import {
  Search, ChevronRight, ArrowUp, PieChart as PieChartIcon, CreditCard, MoreHorizontal,
  TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Shield, Eye, EyeOff,
  ArrowRight, Sparkles, ChevronDown, FileText, Wallet, Bell
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { getBalance, getTransactions, getSpendingByCategory, formatCurrency, type Transaction } from "@/lib/storage";
import lionIcon from "@/assets/lion-logo.png";

const CATEGORY_ICONS: Record<string, string> = {
  "Wohnen": "🏠", "Miete": "🏠", "Essen": "🍕", "Restaurant": "🍕",
  "Lebensmittel": "🛒", "Transport": "🚗", "Mobilität": "🚗",
  "Freizeit": "🎮", "Entertainment": "🎮", "Shopping": "🛍️",
  "Gehalt": "💰", "Einkommen": "💰", "Investment": "📈",
  "Überweisung": "💸", "Sonstiges": "📦",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Wohnen": "#FF6200", "Miete": "#FF6200", "Essen": "#FF8F00",
  "Restaurant": "#FF8F00", "Lebensmittel": "#FF8F00", "Transport": "#FFB74D",
  "Mobilität": "#FFB74D", "Freizeit": "#8B5CF6", "Entertainment": "#8B5CF6",
  "Shopping": "#EC4899", "Gehalt": "#22C55E", "Einkommen": "#22C55E",
  "Investment": "#3B82F6", "Überweisung": "#6B7280", "Sonstiges": "#9CA3AF",
};

export function AdultDashboardScreen({
  onNavigate,
  onSelectAccount,
  onLeoClick,
}: {
  onNavigate: (screen: Screen) => void;
  onSelectAccount: (acc: string) => void;
  onLeoClick?: () => void;
}) {
  const [balance, setBalance] = useState({ girokonto: 0, extraKonto: 0, depot: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showBalance, setShowBalance] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showTransferDone, setShowTransferDone] = useState(false);

  useEffect(() => {
    const load = () => {
      setBalance(getBalance());
      setTransactions(getTransactions());
    };
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const totalBalance = balance.girokonto + balance.extraKonto + balance.depot;

  // Spending analysis
  const spendingData = useMemo(() => {
    const categories = getSpendingByCategory();
    return categories
      .filter((cat) => cat.amount > 0)
      .map((cat) => ({
        name: cat.name,
        value: Math.round(cat.amount),
        color: CATEGORY_COLORS[cat.name] || "#9CA3AF",
        icon: CATEGORY_ICONS[cat.name] || "📦",
        percentage: cat.percentage,
        trend: cat.trend,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  const totalSpending = spendingData.reduce((sum, item) => sum + item.value, 0);

  // Recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  // Anomaly detection
  const anomalies = useMemo(() => {
    const results: { type: string; message: string; severity: "warning" | "info" }[] = [];
    // Check for duplicate subscriptions
    const subs = transactions.filter((t) => t.category === "Abo");
    const subNames = subs.map((s) => s.to?.toLowerCase() || "");
    const seen = new Set<string>();
    for (const name of subNames) {
      if (seen.has(name) && name) {
        results.push({ type: "duplicate", message: `Doppelte Abbuchung: ${name}`, severity: "warning" });
      }
      seen.add(name);
    }
    // Check for large single transactions
    const large = transactions.filter((t) => Math.abs(t.amount) > 500);
    if (large.length > 0) {
      results.push({
        type: "large",
        message: `${large.length} Transaktion(en) über €500`,
        severity: "info",
      });
    }
    return results;
  }, [transactions]);

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-white shadow-sm z-10">
        <div className="flex items-center gap-2 text-[#FF6200]">
          <span className="font-bold text-lg tracking-tight">Meine Konten</span>
        </div>
        <div className="flex gap-3 text-[#FF6200]">
          <button onClick={() => setShowBalance(!showBalance)} title="Kontostand">
            {showBalance ? <Eye size={22} strokeWidth={2.5} /> : <EyeOff size={22} strokeWidth={2.5} />}
          </button>
          <Search size={22} strokeWidth={2.5} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Total Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white px-4 pt-6 pb-4 mb-2"
        >
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <span>Gesamt</span>
            <ChevronRight size={16} />
          </div>
          <motion.div
            className="text-3xl font-bold text-[#333333]"
            key={showBalance ? "show" : "hide"}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {showBalance ? formatCurrency(totalBalance).replace("€", "EUR") : "•••••• EUR"}
          </motion.div>
          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
            <TrendingUp size={14} />
            <span>+2,4% diesen Monat</span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="bg-white px-4 pb-6 mb-3 grid grid-cols-4 gap-2">
          <QuickAction
            icon={<ArrowUp size={20} className="text-white rotate-45" strokeWidth={3} />}
            label="Überweisen"
            onClick={() => onNavigate("transfer")}
          />
          <QuickAction
            icon={<PieChartIcon size={20} className="text-white" />}
            label="Analyse"
            onClick={() => setShowAnalysis(true)}
            highlight
          />
          <QuickAction
            icon={<CreditCard size={20} className="text-white" />}
            label="Abos"
            onClick={() => onNavigate("subscriptions")}
          />
          <QuickAction
            icon={<MoreHorizontal size={20} className="text-white" />}
            label="Mehr"
            onClick={() => onNavigate("service")}
          />
        </div>

        {/* AI Insights Card */}
        {anomalies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-4 mb-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-bold text-orange-800 text-sm">Leo's Analyse</span>
              <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                {anomalies.length} Hinweis{anomalies.length > 1 ? "e" : ""}
              </span>
            </div>
            {anomalies.slice(0, 2).map((a, i) => (
              <div key={i} className="flex items-center gap-2 mt-2 text-xs text-orange-700">
                {a.severity === "warning" ? (
                  <AlertTriangle size={12} className="text-orange-500 shrink-0" />
                ) : (
                  <AlertCircle size={12} className="text-blue-500 shrink-0" />
                )}
                <span>{a.message}</span>
              </div>
            ))}
            <button
              onClick={() => setShowAnalysis(true)}
              className="mt-3 text-xs font-bold text-[#FF6200] flex items-center gap-1"
            >
              Vollständige Analyse öffnen <ArrowRight size={12} />
            </button>
          </motion.div>
        )}

        {/* Account Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AccountSection title="Girokonto">
            <AccountCard
              icon="🦁"
              title="Girokonto"
              subtitle="DE10 •••• •••• 1234"
              balance={showBalance ? formatCurrency(balance.girokonto) : "••••"}
              onClick={() => onSelectAccount("Girokonto")}
            />
          </AccountSection>

          <AccountSection title="Sparen">
            <AccountCard
              icon="🦁"
              title="Extra-Konto"
              subtitle="DE12 •••• •••• 5678"
              balance={showBalance ? formatCurrency(balance.extraKonto) : "••••"}
              onClick={() => onSelectAccount("Extra-Konto")}
            />
          </AccountSection>

          <AccountSection title="Investieren">
            <AccountCard
              icon="📈"
              title="Direkt-Depot"
              subtitle="Depot 1234567890"
              balance={showBalance ? formatCurrency(balance.depot) : "••••"}
              onClick={() => onNavigate("invest")}
            />
          </AccountSection>
        </motion.div>

        {/* Mini Spending Chart */}
        {spendingData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-4 mt-3 bg-white rounded-2xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#333]">Ausgaben diesen Monat</h3>
              <button
                onClick={() => setShowAnalysis(true)}
                className="text-xs text-[#FF6200] font-bold flex items-center gap-1"
              >
                Details <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {spendingData.slice(0, 4).map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  onClick={() => { setSelectedCategory(cat.name); setShowAnalysis(true); }}
                  className="flex-1 min-w-[70px] bg-gray-50 rounded-xl p-3 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-[10px] text-gray-500 truncate">{cat.name}</div>
                  <div className="text-xs font-bold text-[#333] mt-1">{cat.value}€</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="font-bold text-sm text-[#333]">Letzte Umsätze</h3>
              <button
                onClick={() => onSelectAccount("Girokonto")}
                className="text-xs text-[#FF6200] font-bold flex items-center gap-1"
              >
                Alle <ChevronRight size={14} />
              </button>
            </div>
            {recentTransactions.map((txn, i) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="px-4 py-3 flex items-center justify-between border-t border-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {CATEGORY_ICONS[txn.category || "Sonstiges"] || "📦"}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#333]">
                      {txn.amount < 0 ? txn.to : txn.from}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(txn.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                </div>
                <span className={`font-bold text-sm ${txn.amount < 0 ? "text-[#333]" : "text-green-600"}`}>
                  {txn.amount < 0 ? "" : "+"}
                  {txn.amount.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="h-4" />
      </div>

      <BottomNav activeTab="dashboard" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="adult" />

      {/* Full Analysis Overlay */}
      <AnimatePresence>
        {showAnalysis && (
          <TransactionAnalysisOverlay
            transactions={transactions}
            spendingData={spendingData}
            totalSpending={totalSpending}
            anomalies={anomalies}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onClose={() => { setShowAnalysis(false); setSelectedCategory(null); }}
            onLeoClick={onLeoClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Transaction Analysis Overlay ─── */

interface AnalysisOverlayProps {
  transactions: Transaction[];
  spendingData: { name: string; value: number; color: string; icon: string; percentage: number; trend?: number }[];
  totalSpending: number;
  anomalies: { type: string; message: string; severity: "warning" | "info" }[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  onClose: () => void;
  onLeoClick?: () => void;
}

function TransactionAnalysisOverlay({
  transactions, spendingData, totalSpending, anomalies,
  selectedCategory, onSelectCategory, onClose, onLeoClick,
}: AnalysisOverlayProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "categories" | "insights">("overview");

  // Monthly comparison
  const monthlyData = useMemo(() => {
    const months = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString("de-DE", { month: "short" });
      const entry = months.get(key) || { income: 0, expense: 0 };
      if (t.amount > 0) entry.income += t.amount;
      else entry.expense += Math.abs(t.amount);
      months.set(key, entry);
    });
    return Array.from(months.entries()).map(([name, data]) => ({
      name,
      income: Math.round(data.income),
      expense: Math.round(data.expense),
    }));
  }, [transactions]);

  // Transactions filtered by category
  const filteredTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return transactions.filter((t) => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  // Financial score
  const financialScore = useMemo(() => {
    const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
    const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0);
    if (totalIncome === 0) return 75;
    const savingsRate = (totalIncome - totalExpense) / totalIncome;
    return Math.min(100, Math.max(50, Math.round(50 + savingsRate * 166)));
  }, [monthlyData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/50"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute inset-x-0 bottom-0 top-6 bg-white rounded-t-3xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6200] to-[#FF8534] rounded-xl flex items-center justify-center">
              <PieChartIcon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#333]">Transaktionsanalyse</h2>
              <p className="text-xs text-gray-400">KI-gestützte Auswertung</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2 flex gap-2 shrink-0">
          {(["overview", "categories", "insights"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab
                  ? "bg-[#FF6200] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab === "overview" ? "Übersicht" : tab === "categories" ? "Kategorien" : "Insights"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4 pt-2"
              >
                {/* Financial Score */}
                <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-xs font-medium mb-1">Finanz-Score</div>
                    <div className="text-4xl font-bold text-[#333]">
                      {financialScore}<span className="text-lg text-gray-400">/100</span>
                    </div>
                    <div className={`text-xs font-bold mt-1 ${
                      financialScore >= 80 ? "text-green-500" : financialScore >= 60 ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {financialScore >= 80 ? "Gut aufgestellt!" : financialScore >= 60 ? "Verbesserungspotenzial" : "Achtung!"}
                    </div>
                  </div>
                  <div className="w-20 h-20 relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="#f3f3f3" strokeWidth="8" fill="none" />
                      <motion.circle
                        cx="40" cy="40" r="36" stroke="#FF6200" strokeWidth="8" fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: 226, strokeDashoffset: 226 }}
                        animate={{ strokeDashoffset: 226 - (226 * financialScore) / 100 }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Pie Chart */}
                {spendingData.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-4">
                    <h3 className="font-bold text-sm text-[#333] mb-3">Ausgaben-Verteilung</h3>
                    <div className="h-48 flex">
                      <div className="w-1/2 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={spendingData}
                              innerRadius={40}
                              outerRadius={60}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {spendingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-1/2 flex flex-col justify-center gap-2">
                        {spendingData.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => { onSelectCategory(item.name); setActiveTab("categories"); }}
                            className="flex items-center gap-2 text-xs hover:bg-gray-50 rounded-lg px-1 py-0.5 transition-colors"
                          >
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-600 truncate">{item.icon} {item.name}</span>
                            <span className="font-bold ml-auto">{item.value}€</span>
                          </button>
                        ))}
                        <div className="border-t pt-2 mt-1 flex items-center text-xs px-1">
                          <span className="text-gray-600 font-bold">Gesamt</span>
                          <span className="font-bold ml-auto text-[#FF6200]">{totalSpending}€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Monthly Bar Chart */}
                {monthlyData.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-4">
                    <h3 className="font-bold text-sm text-[#333] mb-3">Einnahmen vs. Ausgaben</h3>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#999" }} />
                          <Tooltip
                            cursor={{ fill: "#f3f3f3" }}
                            contentStyle={{ borderRadius: "8px", border: "none", fontSize: 12 }}
                          />
                          <Bar dataKey="income" fill="#4CAF50" radius={[4, 4, 0, 0]} name="Einnahmen" />
                          <Bar dataKey="expense" fill="#FF6200" radius={[4, 4, 0, 0]} name="Ausgaben" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "categories" && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3 pt-2"
              >
                {/* Category Pills */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onSelectCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      !selectedCategory ? "bg-[#FF6200] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Alle
                  </button>
                  {spendingData.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => onSelectCategory(cat.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        selectedCategory === cat.name ? "text-white" : "bg-gray-100 text-gray-600"
                      }`}
                      style={selectedCategory === cat.name ? { backgroundColor: cat.color } : {}}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>

                {/* Selected Category Detail */}
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${CATEGORY_COLORS[selectedCategory] || "#9CA3AF"}20` }}
                      >
                        {CATEGORY_ICONS[selectedCategory] || "📦"}
                      </div>
                      <div>
                        <div className="font-bold text-[#333]">{selectedCategory}</div>
                        <div className="text-sm text-gray-500">
                          {spendingData.find((s) => s.name === selectedCategory)?.value || 0}€ diesen Monat
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-sm font-bold text-[#FF6200]">
                          {spendingData.find((s) => s.name === selectedCategory)?.percentage || 0}%
                        </div>
                        <div className="text-xs text-gray-400">vom Gesamt</div>
                      </div>
                    </div>

                    {/* Category transactions */}
                    <div className="space-y-2 mt-3">
                      {filteredTransactions.slice(0, 5).map((txn) => (
                        <div key={txn.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-[#333]">{txn.to || txn.from}</div>
                            <div className="text-[10px] text-gray-400">
                              {new Date(txn.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                            </div>
                          </div>
                          <span className={`font-bold text-sm ${txn.amount < 0 ? "text-[#333]" : "text-green-600"}`}>
                            {txn.amount.toLocaleString("de-DE", { minimumFractionDigits: 2, signDisplay: "always" })} €
                          </span>
                        </div>
                      ))}
                      {filteredTransactions.length === 0 && (
                        <div className="text-center text-gray-400 text-sm py-4">
                          Keine Transaktionen in dieser Kategorie
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* All Categories - spending bars */}
                {!selectedCategory && (
                  <div className="space-y-3">
                    {spendingData.map((cat, i) => (
                      <motion.button
                        key={cat.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => onSelectCategory(cat.name)}
                        className="w-full bg-white rounded-xl p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                          style={{ backgroundColor: `${cat.color}15` }}
                        >
                          {cat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-[#333]">{cat.name}</span>
                            <span className="font-bold text-sm text-[#333]">{cat.value}€</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: cat.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(cat.value / totalSpending) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                            />
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "insights" && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3 pt-2"
              >
                {/* AI Leo Card */}
                <div className="bg-gradient-to-br from-[#33307E]/5 to-[#33307E]/10 border border-[#33307E]/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#33307E] rounded-full flex items-center justify-center overflow-hidden">
                      <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <div className="font-bold text-[#333] flex items-center gap-2">
                        Leo Analyse
                        <span className="bg-[#FF6200] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">KI</span>
                      </div>
                      <div className="text-xs text-gray-500">Basierend auf deinen Transaktionen</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Insight 1: Spending trend */}
                    <InsightCard
                      icon={<TrendingUp size={16} className="text-green-600" />}
                      title="Sparquote verbessert"
                      description="Du sparst 2,3% mehr als letzten Monat. Weiter so!"
                      color="green"
                    />

                    {/* Insight 2: Category alert */}
                    {spendingData.length > 0 && (
                      <InsightCard
                        icon={<AlertTriangle size={16} className="text-amber-500" />}
                        title={`${spendingData[0]?.name} ist Top-Ausgabe`}
                        description={`${spendingData[0]?.value}€ diesen Monat (${spendingData[0]?.percentage}% deiner Ausgaben). Liegt über dem Durchschnitt.`}
                        color="amber"
                      />
                    )}

                    {/* Insight 3: Savings potential */}
                    <InsightCard
                      icon={<Shield size={16} className="text-blue-500" />}
                      title="Sparpotenzial erkannt"
                      description="Bei Abos und wiederkehrenden Zahlungen könntest du bis zu €45/Monat sparen."
                      color="blue"
                    />

                    {/* Anomalies */}
                    {anomalies.map((a, i) => (
                      <InsightCard
                        key={i}
                        icon={<AlertCircle size={16} className="text-red-500" />}
                        title={a.message}
                        description="Klicke, um mehr zu erfahren."
                        color="red"
                      />
                    ))}
                  </div>
                </div>

                {/* Ask Leo button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onLeoClick}
                  className="w-full bg-[#FF6200] text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                >
                  <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
                  Leo um Detailanalyse bitten
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Helper Components ─── */

function QuickAction({ icon, label, onClick, highlight }: { icon: React.ReactNode; label: string; onClick?: () => void; highlight?: boolean }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
          highlight ? "bg-[#FF6200]" : "bg-[#33307E]"
        }`}
      >
        {icon}
      </motion.div>
      <span className="text-xs text-gray-600 font-medium">{label}</span>
    </button>
  );
}

function AccountSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="px-4 py-2 text-[#FF6200] font-bold text-xs uppercase tracking-wider bg-white border-b border-gray-100">
        {title}
      </div>
      {children}
    </div>
  );
}

function AccountCard({ icon, title, subtitle, balance, onClick }: {
  icon: string; title: string; subtitle: string; balance: string; onClick?: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white p-4 flex items-center justify-between text-left active:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FF6200] rounded-xl flex items-center justify-center">
          <span className="text-white text-xl">{icon}</span>
        </div>
        <div>
          <div className="font-bold text-[#333]">{title}</div>
          <div className="text-[10px] text-gray-400">{subtitle}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#333]">{balance}</span>
        <ChevronRight size={16} className="text-gray-300" />
      </div>
    </motion.button>
  );
}

function InsightCard({ icon, title, description, color }: {
  icon: React.ReactNode; title: string; description: string; color: string;
}) {
  const bgMap: Record<string, string> = {
    green: "bg-green-50 border-green-100",
    amber: "bg-amber-50 border-amber-100",
    blue: "bg-blue-50 border-blue-100",
    red: "bg-red-50 border-red-100",
  };

  return (
    <div className={`${bgMap[color] || "bg-gray-50 border-gray-100"} border rounded-xl p-3`}>
      <div className="flex items-start gap-2">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div>
          <div className="text-xs font-bold text-[#333]">{title}</div>
          <div className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">{description}</div>
        </div>
      </div>
    </div>
  );
}
