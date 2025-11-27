import { ScreenHeader } from "../layout";
import { Search, ChevronRight, X, User, Info, Camera, Paperclip, BookOpen, CreditCard, Banknote, FileText } from "lucide-react";
import { useState } from "react";

export function TransferScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<"recipient" | "templates" | "amount">("recipient");

  if (step === "templates") {
     return <TransferTemplatesScreen onBack={() => setStep("recipient")} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]">
             <X size={24} />
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Empfänger</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6">
         {/* Form Fields */}
         <div className="mb-6">
            <label className="block text-sm font-bold text-[#333333] mb-2">Empfänger</label>
            <div className="relative">
               <input className="w-full border border-[#33307E] rounded px-3 py-3 text-lg outline-none focus:ring-1 focus:ring-[#33307E]" />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">0/70</div>
         </div>

         <div className="mb-8">
            <label className="block text-sm font-bold text-[#333333] mb-2">IBAN</label>
            <div className="relative">
               <input className="w-full border border-gray-300 rounded px-3 py-3 text-lg outline-none focus:border-[#33307E] focus:ring-1 focus:ring-[#33307E] bg-gray-50" />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">0/34</div>
         </div>

         {/* Options */}
         <div className="mb-4 text-sm font-bold text-[#333333]">Optionen</div>
         
         <div className="divide-y divide-gray-100 border-t border-gray-100">
             <OptionRow icon={<User className="text-[#FF6200]" size={20} />} label="An eigenes Konto überweisen" />
             <OptionRow icon={<BookOpen className="text-[#FF6200]" size={20} />} label="Aus Vorlage überweisen" onClick={() => setStep("templates")} />
             <OptionRow icon={<Camera className="text-[#FF6200]" size={20} />} label="Rechnung fotografieren oder QR-Code scannen" />
             <OptionRow icon={<Paperclip className="text-[#FF6200]" size={20} />} label="Rechnung aus Dateien hochladen" />
         </div>
      </div>

      {/* Footer Button */}
      <div className="p-4 border-t border-gray-100">
         <button className="w-full py-3.5 bg-[#33307E] text-white font-bold rounded-lg hover:bg-[#282668] transition-colors">
            Weiter
         </button>
      </div>
    </div>
  );
}

function OptionRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
     <button onClick={onClick} className="w-full py-4 flex items-center gap-3 text-left hover:bg-gray-50">
        <div className="w-6 flex justify-center">{icon}</div>
        <span className="text-gray-600 text-sm">{label}</span>
     </button>
  );
}

export function TransferTemplatesScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]">
             <X size={24} />
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Überweisungsvorlagen</h1>
        </div>
        <Search size={24} className="text-[#FF6200]" strokeWidth={2.5} />
      </div>

      <div className="flex-1 overflow-y-auto">
         {/* Alpha Index */}
         <div className="bg-gray-50 px-4 py-1 text-xs font-bold text-gray-500">A</div>
         
         <TemplateRow 
            initials="AM"
            name="Andreas Mustermann"
            sub="Andreas Kontoverbindung"
            iban="DE10 1234 5678 1234 5678 91"
         />

         {/* Alpha Index */}
         <div className="bg-gray-50 px-4 py-1 text-xs font-bold text-gray-500 flex justify-between">
            <span>E</span>
            <span>EUR</span>
         </div>

         <div className="bg-gray-50 px-4 py-1 text-xs font-bold text-gray-500 flex justify-between">
            <span>M</span>
         </div>
         
         <TemplateRow 
            initials="MP"
            name="Marios Pizza"
            sub="Bestellung Nr. 192"
            iban="DE45 1234 5678 1234 5678 91"
            color="bg-[#FF6200]"
         />
         
         <TemplateRow 
            initials="MM"
            name="Martin Müller"
            sub="Mietanteil"
            iban="DE34 1234 5678 1234 5678 01"
            color="bg-[#33307E]"
         />
      </div>
    </div>
  );
}

function TemplateRow({ initials, name, sub, iban, color = "bg-purple-700" }: { initials: string; name: string; sub: string; iban: string; color?: string }) {
  return (
     <div className="p-4 flex items-center gap-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
        <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
           {initials}
        </div>
        <div className="overflow-hidden">
           <div className="font-bold text-[#333333] text-sm truncate">{name}</div>
           <div className="text-xs text-gray-500 truncate">{sub}</div>
           <div className="text-xs text-gray-400 truncate">{iban}</div>
        </div>
     </div>
  );
}
