import { ScreenHeader } from "../../layout";
import { ChevronRight, Bell, EyeOff, Smartphone, Zap, Camera, Sun, AppWindow, Info, MessageSquare, Shield } from "lucide-react";

export function AppSettingsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader title="App-Einstellungen" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto pb-8">
        
        <SectionHeader title="Mitteilungen" />
        <div className="bg-white divide-y divide-gray-100">
           <SettingRow 
             icon={<Bell size={20} className="text-[#FF6200]" />}
             label="Benachrichtigungen"
             subLabel="Mitteilungen an Ihr Smartphone"
             hasArrow
           />
        </div>

        <SectionHeader title="Anzeige in der App" />
        <div className="bg-white divide-y divide-gray-100">
           <SettingRow 
             icon={<EyeOff size={20} className="text-[#FF6200]" />}
             label="Privatsphäre-Modus"
             subLabel="Kontostände ein- oder ausblenden"
             value="Aus"
             hasArrow
           />
           <SettingRow 
             icon={<Smartphone size={20} className="text-[#FF6200]" />} // Using Smartphone as proxy for Calculator icon
             label="Gesamtsaldo"
             subLabel="Summe aller Konten anzeigen"
             value="Ein"
             hasArrow
           />
           <SettingRow 
             icon={<Zap size={20} className="text-[#FF6200]" />}
             label="Schnellzugriffe"
             subLabel="Schnellzugriffe in Übersicht verwalten"
             value="Ein"
             hasArrow
           />
           <SettingRow 
             icon={<Camera size={20} className="text-[#FF6200]" />}
             label="Screenshots zulassen"
             value="Aus"
             hasArrow
           />
           <SettingRow 
             icon={<Sun size={20} className="text-[#FF6200]" />}
             label="Erscheinungsbild"
             hasArrow
           />
           <SettingRow 
             icon={<AppWindow size={20} className="text-[#FF6200]" />}
             label="App-Symbol"
             hasArrow
           />
        </div>

        <SectionHeader title="Sonstiges" />
        <div className="bg-white divide-y divide-gray-100">
           {/* Add potential other settings if visible in scroll */}
        </div>

      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-4 py-3 text-sm font-bold text-[#333333]">
      {title}
    </div>
  );
}

function SettingRow({ icon, label, subLabel, value, hasArrow }: { icon?: React.ReactNode; label: string; subLabel?: string; value?: string; hasArrow?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
       <div className="flex items-center gap-4 overflow-hidden">
          {icon && <div className="shrink-0 w-6 flex justify-center">{icon}</div>}
          <div className="flex flex-col overflow-hidden">
             <span className="text-[#333333] font-medium text-[15px] truncate">{label}</span>
             {subLabel && <span className="text-gray-500 text-xs truncate">{subLabel}</span>}
          </div>
       </div>
       <div className="flex items-center gap-2 shrink-0 ml-2">
          {value && <span className="text-gray-500 text-sm">{value}</span>}
          {hasArrow && <ChevronRight size={20} className="text-gray-400" />}
       </div>
    </div>
  );
}
