import { INGButton } from "../../layout";
import { ChevronLeft, Search, Check } from "lucide-react";
import magnifyingGlass from "@assets/generated_images/magnifying_glass_held_by_hand_icon.png";
import idFront from "@assets/generated_images/german_id_card_icon_front.png";
import idBack from "@assets/generated_images/german_id_card_icon_back.png";
import partyPopper from "@assets/generated_images/party_popper_confetti_illustration.png";

export function IDScanIntroScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-500 text-sm font-medium flex items-center gap-1">
          <ChevronLeft size={20} /> Zurück
        </button>
        <h1 className="text-sm font-bold text-[#333333]">Identifizierung</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8">
        <div className="flex justify-center mb-8">
           <img src={magnifyingGlass} alt="Scan ID" className="h-24 object-contain" />
        </div>

        <h2 className="text-sm font-bold text-[#333333] mb-4">
          Gleich wird Ihr Ausweisdokument gescannt
        </h2>
        
        <p className="text-gray-500 text-xs mb-6">
          Achten Sie dabei auf folgende Punkte:
        </p>

        <ul className="space-y-2 mb-auto">
           {["Stabile Internetverbindung", "Gute Beleuchtung", "Neutraler, ebener Untergrund", "Ausweisdokument im Rahmen ausrichten", "Hinweis: Beim Extra-Konto Junior oder Direkt-Depot Junior wird das Dokument der erziehungsberechtigten Person gescannt"].map((item, i) => (
             <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
               <span className="text-[#FF6200] mt-1">•</span>
               <span>{item}</span>
             </li>
           ))}
        </ul>

        <div className="mb-6">
           <INGButton variant="primary" onClick={onNext}>
             Aufnahme starten
           </INGButton>
        </div>
      </div>
    </div>
  );
}

export function CameraMockScreen({ side, onCapture, onBack }: { side: "front" | "back"; onCapture: () => void; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#888888]">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0">
        <button onClick={onBack} className="text-gray-500 text-sm font-medium flex items-center gap-1">
          <ChevronLeft size={20} /> Zurück
        </button>
        <h1 className="text-sm font-bold text-[#333333]">{side === "front" ? "Vorderseite" : "Rückseite"}</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative cursor-pointer" onClick={onCapture}>
         <div className="w-full aspect-[1.58] bg-gray-200 rounded-xl border-4 border-white/50 overflow-hidden relative shadow-2xl">
            <img src={side === "front" ? idFront : idBack} className="w-full h-full object-cover opacity-90" alt="ID Card" />
         </div>
         <div className="absolute bottom-10 text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full">
           Tippen zum Aufnehmen
         </div>
      </div>
    </div>
  );
}

export function ProcessingScreen({ onComplete }: { onComplete: () => void }) {
  // Auto proceed after timeout
  setTimeout(onComplete, 2000);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="text-gray-500 text-sm font-medium">Abbrechen</div>
        <h1 className="text-sm font-bold text-[#333333]">Identifizierung</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="mb-6 relative">
           <Search size={48} className="text-[#33307E]" strokeWidth={1.5} />
           <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF6200] rounded-full animate-bounce" />
        </div>

        <h2 className="text-sm font-bold text-[#333333] mb-2">
          Ihre Aufnahmen werden überprüft
        </h2>
        
        <p className="text-center text-gray-500 text-xs max-w-[250px]">
          Bitte warten Sie einen Moment, Sie werden automatisch weitergeleitet.
        </p>
      </div>
    </div>
  );
}

export function SuccessScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white">
       <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <button className="text-gray-500 text-sm font-medium flex items-center gap-1">
          <ChevronLeft size={20} /> Zurück
        </button>
        <h1 className="text-sm font-bold text-[#333333]">Identifizierung</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="mb-6 w-16 h-16 rounded-full border-4 border-[#008000] flex items-center justify-center">
           <Check size={32} className="text-[#008000]" strokeWidth={3} />
        </div>

        <h2 className="text-sm font-bold text-[#333333] mb-2">
          Hat geklappt!
        </h2>
        
        <p className="text-center text-gray-500 text-xs mb-8">
          Als nächstes nehmen wir die Rückseite auf.
        </p>

        <div className="w-full">
           <INGButton variant="primary" onClick={onNext}>
             Weiter
           </INGButton>
        </div>
      </div>
    </div>
  );
}

export function FinalSuccessScreen({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white">
       <div className="h-14 px-4 flex items-center justify-center bg-white shrink-0 border-b border-gray-100">
        <h1 className="text-sm font-bold text-[#333333]">Danke</h1>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-12">
        <div className="flex justify-center mb-8">
           <img src={partyPopper} alt="Celebration" className="h-24 object-contain" />
        </div>

        <h2 className="text-sm font-bold text-[#333333] mb-4">
          Geschafft!
        </h2>
        
        <p className="text-gray-500 text-xs mb-auto leading-relaxed">
          Jetzt können Sie loslegen. Übrigens: Sie können die ING App noch auf <strong className="text-black">2 weiteren Geräten</strong> aktivieren.
        </p>

        <div className="mb-6">
           <INGButton variant="primary" onClick={onFinish}>
             Weiter
           </INGButton>
        </div>
      </div>
    </div>
  );
}
