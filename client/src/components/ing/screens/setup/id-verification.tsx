import { INGButton } from "../../layout";
import idIcon from "@assets/generated_images/german_id_card_icon_front.png";
import handsIcon from "@assets/generated_images/hands_holding_id_card_icon.png";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { useState } from "react";

export function IDPrepScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-500 text-sm font-medium flex items-center gap-1">
          <ChevronLeft size={20} /> Zurück
        </button>
        <h1 className="text-sm font-bold text-[#333333]">Identifizierung</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8 items-center">
         <div className="mb-8 relative">
            {/* Illustration composition */}
            <div className="w-32 h-24 bg-[#FFEAD5] rounded-md flex items-center justify-center relative">
               <div className="w-16 h-20 bg-white border border-gray-200 rounded shadow-sm absolute -bottom-4 left-4 z-10 p-1">
                  <div className="w-full h-2 bg-gray-200 mb-1" />
                  <div className="w-2/3 h-2 bg-gray-200" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full mt-2" />
               </div>
               <div className="w-24 h-16 bg-white border border-gray-200 rounded shadow-sm absolute -top-2 right-2 p-2">
                   <div className="w-full h-2 bg-gray-200 mb-1" />
                   <div className="w-full h-2 bg-gray-200" />
               </div>
            </div>
         </div>

         <h2 className="text-sm font-bold text-[#333333] mb-4 text-center">
           Halten Sie Ihr Ausweisdokument bereit
         </h2>
         
         <p className="text-center text-gray-500 text-xs mb-auto leading-relaxed max-w-[280px]">
           Um Ihre Identität sicherzustellen und Ihr Konto bestmöglich zu schützen, führen wir eine Ausweisprüfung durch.
         </p>

         <div className="w-full mb-6 space-y-3">
           <INGButton variant="primary" onClick={onNext}>
             Weiter
           </INGButton>
           <button className="w-full py-3 text-[#33307E] font-bold text-sm">
             Andere Identifizierungsmethode
           </button>
         </div>
      </div>
    </div>
  );
}

export function GDPRConsentScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [consented, setConsented] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-500 text-sm font-medium flex items-center gap-1">
          <ChevronLeft size={20} /> Zurück
        </button>
        <h1 className="text-sm font-bold text-[#333333]">Identifizierung</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-6">
        <h2 className="text-sm font-bold text-[#333333] mb-4">
          Ihre Zustimmung wird benötigt
        </h2>
        
        <p className="text-gray-500 text-xs mb-6 leading-relaxed">
          Zur Ausweisprüfung sind sowohl deutsche Personalausweise als auch Reisepässe aus EU, UK, Norwegen und Schweiz zugelassen.
        </p>

        <label className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg cursor-pointer">
           <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${consented ? "bg-[#FF6200] border-[#FF6200]" : "border-gray-300 bg-white"}`}>
             {consented && <span className="text-white font-bold text-xs">✓</span>}
           </div>
           <input type="checkbox" className="hidden" checked={consented} onChange={() => setConsented(!consented)} />
           <span className="text-xs text-gray-600 leading-relaxed">
             Ich willige gem. Art. 6 Abs 1 lit. a) DSGVO ein, dass mein Ausweisdokument und die sich darauf enthaltenen Daten inkl. Dokumentennummer für ING durch ihren Partner Mitek Systems B.V. gespeichert und verarbeitet werden. Die Daten werden nach 24 Stunden gelöscht. Diese Einwilligung kann ich jederzeit mit Wirkung für die Zukunft widerrufen. Wenden Sie sich hierzu an datenschutz@ing.de.
           </span>
        </label>
        
        <button className="flex items-center gap-1 text-gray-500 text-xs mt-4">
          Datenschutzerklärung der ING <ExternalLink size={12} />
        </button>

        <div className="mt-auto mb-6 space-y-3">
           <INGButton variant="primary" onClick={onNext} disabled={!consented} className={!consented ? "opacity-50" : ""}>
             Weiter
           </INGButton>
           <button className="w-full py-3 text-[#33307E] font-bold text-sm">
             Andere Identifizierungsmethode
           </button>
        </div>
      </div>
    </div>
  );
}

export function IDSelectionScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<"id" | "passport" | null>("id");

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-500 text-sm font-medium flex items-center gap-1">
          <ChevronLeft size={20} /> Zurück
        </button>
        <h1 className="text-sm font-bold text-[#333333]">Identifizierung</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-6">
        <div className="flex justify-center mb-6">
           <img src={handsIcon} alt="Hands holding ID" className="h-24 object-contain" />
        </div>

        <h2 className="text-sm font-bold text-[#333333] mb-4">
          Mit welchem Ausweisdokument möchten Sie sich identifizieren?
        </h2>
        
        <p className="text-gray-500 text-xs mb-6">
          Das Ausweisdokument wird benötigt, um Ihre Identität zu überprüfen.
        </p>

        <div className="space-y-0 border-t border-b border-gray-100 divide-y divide-gray-100">
          <label className="flex items-center justify-between py-4 cursor-pointer">
             <span className="text-sm text-gray-700">Deutscher Personalausweis</span>
             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === "id" ? "border-[#FF6200]" : "border-gray-300"}`}>
               {selected === "id" && <div className="w-2.5 h-2.5 bg-[#FF6200] rounded-full" />}
             </div>
             <input type="radio" className="hidden" name="idtype" checked={selected === "id"} onChange={() => setSelected("id")} />
          </label>
          
          <label className="flex items-center justify-between py-4 cursor-pointer">
             <span className="text-sm text-gray-700">Reisepass (EU, UK, Norwegen, Schweiz)</span>
             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === "passport" ? "border-[#FF6200]" : "border-gray-300"}`}>
               {selected === "passport" && <div className="w-2.5 h-2.5 bg-[#FF6200] rounded-full" />}
             </div>
             <input type="radio" className="hidden" name="idtype" checked={selected === "passport"} onChange={() => setSelected("passport")} />
          </label>
        </div>

        <div className="mt-auto mb-6 space-y-3">
           <INGButton variant="primary" onClick={onNext} disabled={!selected} className={!selected ? "opacity-50" : ""}>
             Weiter
           </INGButton>
           <button className="w-full py-3 text-[#33307E] font-bold text-sm">
             Diese Dokumente habe ich nicht
           </button>
        </div>
      </div>
    </div>
  );
}
