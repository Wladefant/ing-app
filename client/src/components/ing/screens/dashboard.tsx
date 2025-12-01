import { ScreenHeader, BottomNav } from "../layout";
import { Search, Menu, ArrowUpRight, Eye, CreditCard, MoreHorizontal, ChevronRight, ArrowUp, PieChart } from "lucide-react";
import { Screen } from "@/pages/ing-app";
import { useState, useEffect } from "react";
import { AccountOverviewSettingsScreen } from "./settings/account-overview";
import { getBalance, getPortfolio, formatCurrency } from "@/lib/storage";

export function DashboardScreen({
  onNavigate,
  onSelectAccount,
  onLeoClick
}: {
  onNavigate: (screen: Screen) => void;
  onSelectAccount: (acc: string) => void;
  onLeoClick?: () => void;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [balance, setBalance] = useState({ girokonto: 0, extraKonto: 0, depot: 0 });

  // Load dynamic balances from storage
  useEffect(() => {
    const loadBalances = () => {
      const storedBalance = getBalance();
      const portfolio = getPortfolio();
      const depotValue = portfolio.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
      setBalance({
        girokonto: storedBalance.girokonto,
        extraKonto: storedBalance.extraKonto,
        depot: depotValue
      });
    };
    
    loadBalances();
    // Refresh balances when window gains focus
    const handleFocus = () => loadBalances();
    window.addEventListener("focus", handleFocus);
    
    // Also listen for storage events for cross-tab sync
    const handleStorage = () => loadBalances();
    window.addEventListener("storage", handleStorage);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const totalBalance = balance.girokonto + balance.extraKonto + balance.depot;

  if (showSettings) {
    return <AccountOverviewSettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-white shadow-sm z-10">
        <div className="flex items-center gap-2 text-[#FF6200]">
          <span className="font-bold text-lg tracking-tight">Meine Konten</span>
        </div>
        <div className="flex gap-4 text-[#FF6200]">
          <Search size={24} strokeWidth={2.5} />
          <button onClick={() => setShowSettings(true)} title="Einstellungen">
            <MoreHorizontal size={24} strokeWidth={2.5} className="rotate-90" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Total Balance */}
        <div className="bg-white px-4 pt-6 pb-4 mb-2">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <span>Gesamt</span>
            <ChevronRight size={16} />
          </div>
          <div className="text-3xl font-bold text-[#333333]">
            {formatCurrency(totalBalance).replace('€', 'EUR')}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white px-4 pb-6 mb-4 grid grid-cols-4 gap-2">
          <QuickAction
            icon={<div className="w-6 h-6 flex items-center justify-center border-b-2 border-white pb-1"><ArrowUp size={20} className="text-white rotate-45" strokeWidth={3} /></div>}
            label="Überweisen"
            onClick={() => onNavigate("transfer")}
          />
          <QuickAction
            icon={<PieChart className="text-white" />}
            label="Statistik"
            onClick={() => onNavigate("statistics")}
          />
          <QuickAction
            icon={<CreditCard className="text-white" />}
            label="Abos"
            onClick={() => onNavigate("subscriptions")}
          />
          <QuickAction
            icon={<MoreHorizontal className="text-white" />}
            label="Mehr"
            onClick={() => onNavigate("service")}
          />
        </div>

        {/* Account Section: Girokonto */}
        <AccountSection title="Girokonto">
          <AccountCard
            icon={<div className="w-10 h-10 bg-[#FF6200] rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xl">🦁</span></div>}
            title="Girokonto"
            subtitle="DE10 1234 5678 1234 5678 90"
            balance={formatCurrency(balance.girokonto).replace('€', 'EUR')}
            onClick={() => onSelectAccount("Girokonto")}
          />
        </AccountSection>

        {/* Account Section: Sparen */}
        <AccountSection title="Sparen">
          <AccountCard
            icon={<div className="w-10 h-10 bg-[#FF6200] rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xl">🦁</span></div>}
            title="Extra-Konto"
            subtitle="DE12 5001 0517 1234 5678 66"
            balance={formatCurrency(balance.extraKonto).replace('€', 'EUR')}
            onClick={() => onSelectAccount("Extra-Konto")}
          />
        </AccountSection>

        {/* Account Section: Investieren */}
        <AccountSection title="Investieren">
          <AccountCard
            icon={<div className="w-10 h-10 bg-[#FF6200] rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xl">🦁</span></div>}
            title="Maxi Mustermensch"
            subtitle="Direkt-Depot 1234567890"
            balance={formatCurrency(balance.depot).replace('€', 'EUR')}
            onClick={() => onNavigate("invest")}
          />
        </AccountSection>
      </div>

      <BottomNav activeTab="dashboard" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="adult" />
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-[#33307E] flex items-center justify-center shadow-md active:scale-95 transition-transform">
        {icon}
      </div>
      <span className="text-xs text-gray-600 font-medium">{label}</span>
    </button>
  );
}

function AccountSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-4 py-2 text-[#FF6200] font-bold text-sm uppercase tracking-wide bg-white border-b border-gray-100">
        {title}
      </div>
      <div className="divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
}

function AccountCard({ icon, title, subtitle, balance, onClick }: { icon: React.ReactNode; title: string; subtitle: string; balance: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-white p-4 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <div className="font-bold text-[#333333]">{title}</div>
          <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
      </div>
      <div className="font-bold text-[#333333]">{balance}</div>
    </div>
  );
}
