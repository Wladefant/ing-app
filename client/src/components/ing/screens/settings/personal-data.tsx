import { ScreenHeader } from "../../layout";
import { User, MapPin, Mail, Truck, Smartphone, FileText, Shield, UserCheck, ExternalLink } from "lucide-react";

export function PersonalDataScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader title="Persönliche Daten" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="bg-white mt-4 divide-y divide-gray-100">
           <ActionRow 
             icon={<User size={20} className="text-[#FF6200]" />}
             label="Name ändern"
             isExternal
           />
           <ActionRow 
             icon={<MapPin size={20} className="text-[#FF6200]" />}
             label="Adresse ändern"
             isExternal
           />
           <ActionRow 
             icon={<Mail size={20} className="text-[#FF6200]" />}
             label="E-Mail und Telefonnummer ändern"
             isExternal
           />
           <ActionRow 
             icon={<Truck size={20} className="text-[#FF6200]" />}
             label="Abweichende Versandadresse verwalten"
             isExternal
           />
           <ActionRow 
             icon={<Smartphone size={20} className="text-[#FF6200]" />}
             label="Mobilnummer für Sicherheitsprozesse verwalten"
             isExternal
           />
        </div>

        <div className="px-4 py-3 text-sm font-bold text-[#333333]">
          Weitere Optionen
        </div>

        <div className="bg-white divide-y divide-gray-100">
           <ActionRow 
             icon={<FileText size={20} className="text-[#FF6200]" />}
             label="Steuer und Belege"
             subLabel="Freistellungsauftrag, Steuerinformation"
             hasArrow
           />
           <ActionRow 
             icon={<Shield size={20} className="text-[#FF6200]" />}
             label="Einwilligungen verwalten"
             isExternal
           />
           <ActionRow 
             icon={<UserCheck size={20} className="text-[#FF6200]" />}
             label="Persönliche Daten überprüfen"
             isExternal
           />
        </div>
      </div>
    </div>
  );
}

function ActionRow({ icon, label, subLabel, hasArrow, isExternal }: { icon?: React.ReactNode; label: string; subLabel?: string; hasArrow?: boolean; isExternal?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer min-h-[64px]">
       <div className="flex items-center gap-4">
          {icon && <div className="shrink-0 w-6 flex justify-center">{icon}</div>}
          <div className="flex flex-col">
             <span className="text-[#333333] font-medium text-[15px]">{label}</span>
             {subLabel && <span className="text-gray-500 text-xs mt-0.5">{subLabel}</span>}
          </div>
       </div>
       <div className="flex items-center gap-2 text-gray-400">
          {hasArrow && <span className="text-lg">›</span>}
          {isExternal && <ExternalLink size={18} />}
       </div>
    </div>
  );
}
