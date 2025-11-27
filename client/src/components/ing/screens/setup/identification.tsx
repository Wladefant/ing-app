import { useState } from "react";
import { INGButton } from "../../layout";
import { MessageSquare, FileText } from "lucide-react";

export function IdentificationMethodScreen({ onSelectMethod, onCancel }: { onSelectMethod: (method: "sms" | "id") => void; onCancel: () => void }) {
  const [selected, setSelected] = useState<"sms" | "id" | null>(null);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <button onClick={onCancel} className="text-gray-500 text-sm font-medium">
          Abbrechen
        </button>
        <h1 className="text-sm font-bold text-[#333333]">Identifizierung</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-6">
        <h2 className="text-sm font-bold text-[#333333] mb-6">
          Wie möchten Sie sich identifizieren?
        </h2>

        <div className="space-y-6">
          <label className="flex items-start gap-4 cursor-pointer group">
             <div className="mt-1 text-[#FF6200]">
               <MessageSquare size={20} fill="currentColor" className="text-[#FF6200]" />
             </div>
             <div className="flex-1">
               <div className="font-bold text-sm text-[#333333] mb-1">SMS</div>
               <div className="text-xs text-gray-500">Wir senden Ihnen ein Einmalpasswort per SMS</div>
             </div>
             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === "sms" ? "border-[#FF6200]" : "border-gray-300"}`}>
               {selected === "sms" && <div className="w-2.5 h-2.5 bg-[#FF6200] rounded-full" />}
             </div>
             <input type="radio" className="hidden" name="method" onChange={() => setSelected("sms")} />
          </label>
          
          <div className="h-px bg-gray-100" />

          <label className="flex items-start gap-4 cursor-pointer group">
             <div className="mt-1 text-[#FF6200]">
               <FileText size={20} fill="currentColor" className="text-[#FF6200]" />
             </div>
             <div className="flex-1">
               <div className="font-bold text-sm text-[#333333] mb-1">Ausweisdokument</div>
               <div className="text-xs text-gray-500">Sie identifizieren sich mit Ihrem Personalausweis oder Reisepass</div>
             </div>
             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === "id" ? "border-[#FF6200]" : "border-gray-300"}`}>
               {selected === "id" && <div className="w-2.5 h-2.5 bg-[#FF6200] rounded-full" />}
             </div>
             <input type="radio" className="hidden" name="method" onChange={() => setSelected("id")} />
          </label>
        </div>

        <div className="mt-auto mb-6">
           <INGButton variant="primary" onClick={() => selected && onSelectMethod(selected)} disabled={!selected} className={!selected ? "opacity-50" : ""}>
             Weiter
           </INGButton>
        </div>
      </div>
    </div>
  );
}
