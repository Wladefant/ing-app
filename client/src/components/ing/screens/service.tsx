import { ScreenHeader, BottomNav, INGButton } from "../layout";
import { Screen } from "@/pages/ing-app";
import { Mail, CreditCard, User, Settings, LogOut, ChevronRight, Shield, FileText, HelpCircle, MessageSquare, Info, Smartphone, Camera } from "lucide-react";
import { useState } from "react";
import { AppSettingsScreen } from "./settings/app-settings";
import { PersonalDataScreen } from "./settings/personal-data";

export function ServiceScreen({ onBack, onLogout, onNavigate }: { onBack: () => void; onLogout: () => void; onNavigate: (s: Screen) => void }) {
  const [subScreen, setSubScreen] = useState<"none" | "app-settings" | "personal-data">("none");

  if (subScreen === "app-settings") {
    return <AppSettingsScreen onBack={() => setSubScreen("none")} />;
  }

  if (subScreen === "personal-data") {
    return <PersonalDataScreen onBack={() => setSubScreen("none")} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="px-6 pt-12 pb-6 bg-white">
         <h1 className="text-3xl font-bold text-[#333333] mb-6">Service</h1>
         
         <div className="flex items-center justify-between">
           <div>
             <div className="text-xs text-gray-500 mb-1">Zugang verwalten für</div>
             <div className="font-bold text-lg flex items-center gap-2">
               Maxi Mustermensch <ChevronRight size={16} className="rotate-90" />
             </div>
           </div>
           <button onClick={onLogout} className="text-[#FF6200]">
             <LogOut size={24} />
           </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
         <div className="p-4 space-y-4">
            <ServiceCard 
                icon={<Mail size={24} className="text-[#FF6200]" />}
                title="Post-Box"
                subtitle="Kontoauszüge, Zinserträge"
                badge="8"
            />
            
            <ServiceCard 
                icon={<CreditCard size={24} className="text-[#FF6200]" />}
                title="Karten"
                subtitle="Sperren, Limits, PIN, Umsätze"
            />

            <h3 className="text-[#FF6200] text-lg font-normal mt-8 mb-2 px-2">Meine Daten und Einstellungen</h3>
            
            <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
                <ServiceRow 
                  icon={<User size={20} className="text-[#FF6200]" />}
                  title="Persönliche Daten"
                  subtitle="Adresse, Kontaktdaten, Steuerinformation"
                  onClick={() => setSubScreen("personal-data")}
                />
                <ServiceRow 
                  icon={<Settings size={20} className="text-[#FF6200]" />}
                  title="Konto verwalten"
                  subtitle="Verwaltung, Einstellungen, Aufträge"
                />
                <ServiceRow 
                  icon={<Settings size={20} className="text-[#FF6200]" />} // Assuming App Settings icon
                  title="App-Einstellungen"
                  subtitle="Benachrichtigungen, App anpassen"
                  onClick={() => setSubScreen("app-settings")}
                />
                <ServiceRow 
                  icon={<Shield size={20} className="text-[#FF6200]" />}
                  title="Login und Sicherheit"
                  subtitle="mobilePIN, weitere Geräte, internetbanking PIN"
                />
            </div>

            <h3 className="text-[#FF6200] text-lg font-normal mt-8 mb-2 px-2">Funktionen verwalten</h3>
            
            <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
                <ServiceRow 
                  icon={<Info size={20} className="text-[#FF6200]" />} // Placeholder icon
                  title="Überweisungsvorlagen"
                  subtitle=""
                />
                <ServiceRow 
                  icon={<Camera size={20} className="text-[#FF6200]" />}
                  title="Fotoüberweisung"
                  subtitle=""
                />
                <ServiceRow 
                  icon={<FileText size={20} className="text-[#FF6200]" />}
                  title="Freistellungsauftrag"
                  subtitle=""
                />
            </div>

            <h3 className="text-[#FF6200] text-lg font-normal mt-8 mb-2 px-2">Hilfe und Feedback</h3>
            
            <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
                <ServiceRow 
                  icon={<HelpCircle size={20} className="text-[#FF6200]" />}
                  title="Hilfe"
                  subtitle=""
                />
                <ServiceRow 
                  icon={<MessageSquare size={20} className="text-[#FF6200]" />}
                  title="Feedback an die ING"
                  subtitle=""
                />
                <ServiceRow 
                  icon={<Info size={20} className="text-[#FF6200]" />}
                  title="Rechtliches und Datenschutz"
                  subtitle=""
                />
            </div>

            <div className="mt-8 mb-4">
               <button onClick={onLogout} className="w-full py-3 border-2 border-[#FF6200] rounded-lg text-[#FF6200] font-bold flex items-center justify-center gap-2 hover:bg-orange-50">
                  <LogOut size={20} /> Logout
               </button>
               <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
                 Zur Sicherheit werden Sie automatisch nach 2 Minuten abgemeldet.
               </p>
            </div>

            <div className="bg-gray-200/50 rounded-lg p-4 flex items-center gap-3 justify-center mb-8">
               <div className="w-8 h-8 bg-gray-300/50 rounded-full flex items-center justify-center">🦁</div>
               <span className="text-gray-500 text-sm font-medium">App-Version 8.20.0</span>
            </div>
         </div>
      </div>

      <BottomNav activeTab="service" onNavigate={onNavigate} profile="adult" />
    </div>
  );
}

function ServiceCard({ icon, title, subtitle, badge }: { icon: React.ReactNode; title: string; subtitle: string; badge?: string }) {
  return (
    <div className="bg-white p-5 rounded-xl flex items-center gap-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform border border-transparent hover:border-gray-100">
       <div className="shrink-0">{icon}</div>
       <div className="flex-1">
          <div className="font-bold text-[#333333] flex items-center justify-between">
            {title}
            {badge && <span className="bg-[#33307E] text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
          </div>
          <div className="text-xs text-gray-500">{subtitle}</div>
       </div>
       <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
}

function ServiceRow({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50">
       <div className="shrink-0 w-8">{icon}</div>
       <div className="flex-1">
          <div className="font-medium text-[#333333]">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
       </div>
       <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
}
