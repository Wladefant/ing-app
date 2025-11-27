import { useState } from "react";
import { ScreenHeader, INGButton } from "../../layout";
import { Check, ChevronRight, Eye, EyeOff, Zap } from "lucide-react";

export function AccountOverviewSettingsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader title="Kontenübersicht" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white mt-4">
           <div className="divide-y divide-gray-100">
              <SettingRow 
                icon={<div className="w-6" />} // Placeholder or custom icon
                label="Angezeigte Konten" 
                value="" 
                hasArrow 
              />
              <SettingRow 
                icon={<div className="w-6 text-gray-400"><CalculatorIcon /></div>} 
                label="Gesamtsaldo" 
                value="An" 
                hasArrow 
              />
              <SettingRow 
                icon={<div className="w-6 text-gray-400"><Zap size={20} strokeWidth={1.5} /></div>} 
                label="Schnellzugriffe" 
                value="An" 
                hasArrow 
              />
              <SettingRow 
                icon={<div className="w-6 text-gray-400"><EyeOff size={20} strokeWidth={1.5} /></div>} 
                label="Privatsphäre-Modus" 
                value="Aus" 
                hasArrow 
              />
           </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, value, hasArrow }: { icon?: React.ReactNode; label: string; value?: string; hasArrow?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
       <div className="flex items-center gap-4">
          {icon}
          <span className="text-[#333333] font-medium text-[15px]">{label}</span>
       </div>
       <div className="flex items-center gap-2">
          {value && <span className="text-gray-500 text-sm">{value}</span>}
          {hasArrow && <ChevronRight size={20} className="text-gray-400" />}
       </div>
    </div>
  );
}

function CalculatorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}
