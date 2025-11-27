import { INGButton } from "../../layout";
import { ScanFace } from "lucide-react";

export function FaceIDScreen({ onEnable, onSkip, onCancel }: { onEnable: () => void; onSkip: () => void; onCancel: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0">
        <button onClick={onCancel} className="text-gray-500 text-sm font-medium">
          Abbrechen
        </button>
        <h1 className="text-sm font-bold text-[#333333]">Face ID</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8">
        <div className="flex justify-center mb-8">
           <ScanFace size={64} className="text-[#FF6200]" strokeWidth={1.5} />
        </div>

        <h2 className="font-bold text-[#333333] mb-4 text-sm">
          Face ID für Log-in und Auftragsfreigabe nutzen?
        </h2>

        <p className="text-gray-500 text-xs mb-6 leading-relaxed">
          Wenn Sie das aktivieren, nutzen Sie die Gesichtserkennung. Bitte merken Sie sich dennoch Ihre mobilePIN, diese wird immer noch gebraucht.
        </p>

        <div className="border border-[#33307E] rounded-md p-3 flex gap-3 items-start mb-auto">
           <div className="bg-[#33307E] text-white w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 text-xs font-serif font-bold">i</div>
           <p className="text-gray-600 text-xs leading-relaxed">
             Verwenden Sie diese Option nicht, wenn eine andere Person ihr Gesicht auf diesem Gerät registriert hat. Sonst kann auch sie die App bedienen.
           </p>
        </div>

        <div className="mb-6 space-y-3">
           <INGButton variant="primary" onClick={onEnable}>
             Face ID aktivieren
           </INGButton>
           <INGButton variant="outline" onClick={onSkip} className="text-[#FF6200] border-[#FF6200] hover:bg-orange-50">
             Jetzt nicht
           </INGButton>
        </div>
      </div>
    </div>
  );
}
