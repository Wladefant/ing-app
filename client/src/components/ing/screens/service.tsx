import { ScreenHeader, BottomNav } from "../layout";
import { Screen } from "@/pages/ing-app";
import { Mail, CreditCard, User, Settings, LogOut, ChevronRight } from "lucide-react";

export function ServiceScreen({ onBack, onLogout, onNavigate }: { onBack: () => void; onLogout: () => void; onNavigate: (s: Screen) => void }) {
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            />
             <ServiceRow 
              icon={<Settings size={20} className="text-[#FF6200]" />}
              title="Konto verwalten"
              subtitle="Verwaltung, Einstellungen, Aufträge"
            />
         </div>
      </div>

      <BottomNav activeTab="service" onNavigate={onNavigate} />
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

function ServiceRow({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50">
       <div className="shrink-0 w-8">{icon}</div>
       <div className="flex-1">
          <div className="font-medium text-[#333333]">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
       </div>
       <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
}
