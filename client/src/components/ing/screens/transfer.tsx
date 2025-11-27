import { useState } from "react";
import { ScreenHeader, INGButton } from "../layout";
import { X, Home, Image, Paperclip, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TransferScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  // Step 1: Recipient
  const renderStep1 = () => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack}><X className="text-gray-400" /></button>
        <h1 className="font-bold text-lg">Empfänger</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Empfänger</label>
          <input 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full border-b-2 border-[#33307E] py-2 text-lg font-medium outline-none bg-transparent"
            placeholder=""
            autoFocus
          />
          <div className="text-right text-xs text-gray-400 mt-1">0/70</div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">IBAN</label>
          <input 
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            className="w-full border-b border-gray-300 py-2 text-lg font-medium outline-none bg-transparent focus:border-[#33307E]"
            placeholder=""
          />
          <div className="text-right text-xs text-gray-400 mt-1">0/34</div>
        </div>

        <div className="pt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Optionen</h3>
          <div className="space-y-1">
             <OptionRow icon={<Home size={20} className="text-[#FF6200]" />} label="An eigenes Konto überweisen" />
             <OptionRow icon={<Image size={20} className="text-[#FF6200]" />} label="Aus Vorlage überweisen" />
             <OptionRow icon={<div className="border-2 border-[#FF6200] rounded px-0.5 text-[10px] font-bold text-[#FF6200]">QR</div>} label="Rechnung fotografieren oder QR-Code scannen" />
             <OptionRow icon={<Paperclip size={20} className="text-[#FF6200]" />} label="Rechnung aus Dateien hochladen" />
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100">
         <INGButton variant="secondary" onClick={() => setStep(2)}>Weiter</INGButton>
      </div>
    </div>
  );

  // Step 2: Amount
  const renderStep2 = () => (
    <div className="flex-1 flex flex-col bg-white">
       <ScreenHeader title="Überweisung" onBack={() => setStep(1)} />
       
       <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center w-full">
            <div className="text-sm text-gray-500 mb-2">Betrag</div>
            <div className="relative flex items-center justify-center">
              <input 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-5xl font-bold text-center w-full outline-none bg-transparent placeholder-gray-200 text-[#333333]"
                placeholder="0,00"
                type="text"
                inputMode="decimal"
              />
              <span className="text-5xl font-bold text-[#333333] absolute right-4 pointer-events-none opacity-0">EUR</span>
            </div>
            <div className="text-xl font-medium text-gray-400 mt-2">EUR</div>
          </div>

          <div className="w-full mt-12">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
               <span className="font-medium text-gray-700">Terminüberweisung</span>
               <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="w-6 h-6 bg-white rounded-full shadow-sm border border-gray-300 absolute left-0 top-0" />
               </div>
            </div>
          </div>
       </div>

       <div className="mt-auto p-4 border-t border-gray-100">
         <INGButton variant="secondary" onClick={() => setStep(3)}>Weiter</INGButton>
      </div>
    </div>
  );

  // Step 3: Reference
  const renderStep3 = () => (
    <div className="flex-1 flex flex-col bg-white">
       <ScreenHeader title="Verwendungszweck" onBack={() => setStep(2)} />
       <div className="p-6">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Verwendungszweck</label>
          <textarea 
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full border-b-2 border-[#33307E] py-2 text-lg font-medium outline-none bg-transparent resize-none"
            rows={3}
            placeholder="Rechnungsnummer, Kundennummer..."
            autoFocus
          />
          <div className="text-right text-xs text-gray-400 mt-1">0/140</div>
       </div>
       <div className="mt-auto p-4 border-t border-gray-100">
         <INGButton variant="secondary" onClick={() => setStep(4)}>Weiter</INGButton>
      </div>
    </div>
  );

  // Step 4: Confirmation
  const renderStep4 = () => (
    <div className="flex-1 flex flex-col bg-[#F3F3F3]">
       <ScreenHeader title="Übersicht" onBack={() => setStep(3)} />
       
       <div className="p-4 space-y-6">
         <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-[#FF6200] text-lg font-normal">Alles auf einen Blick</h2>
            
            <DetailRow label="Von" value="Maxi Mustermensch" subValue="DE10 1234 5678 1234 5678 90" />
            <DetailRow label="An" value={recipient || "Andreas Mustermann"} subValue={iban || "DE10 1234 5678 1234 5678 91"} />
            <DetailRow label="Betrag" value={`${amount || "50,00"} EUR`} />
            <DetailRow label="Verwendungszweck" value={reference || "Danke"} />
         </div>
       </div>

       <div className="mt-auto p-4 bg-white border-t border-gray-100">
         <INGButton variant="primary" onClick={() => setStep(5)} className="bg-[#FF6200] hover:bg-[#E55800]">Übernehmen</INGButton>
      </div>
    </div>
  );

  // Step 5: PIN (Simplified)
  const renderStep5 = () => (
    <div className="flex-1 flex flex-col bg-white items-center justify-center p-6">
        <h2 className="text-xl font-bold mb-8">Freigabe mit PIN</h2>
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-[#FF6200]" />
          ))}
        </div>
        <div className="text-center text-gray-500 text-sm mb-8">Bitte bestätigen Sie die Überweisung.</div>
        <INGButton variant="primary" onClick={() => setStep(6)}>Freigeben</INGButton>
    </div>
  );

  // Step 6: Success
  const renderStep6 = () => (
    <div className="flex-1 flex flex-col bg-white items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-[#008000] rounded-full flex items-center justify-center mb-6"
        >
           <Check size={48} className="text-white" strokeWidth={3} />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#333333] mb-2">Das hat geklappt!</h2>
        <p className="text-gray-500 text-center mb-12">Die Überweisung wurde entgegengenommen.</p>
        
        <INGButton variant="secondary" onClick={onBack}>Zurück zur Übersicht</INGButton>
    </div>
  );

  return (
    <div className="h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full flex flex-col"
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OptionRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
      <div className="w-8 flex justify-center">{icon}</div>
      <span className="text-sm text-gray-600 font-medium flex-1">{label}</span>
    </div>
  );
}

function DetailRow({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div>
      <div className="font-bold text-[#333333] mb-1">{label}</div>
      <div className="text-gray-600">{value}</div>
      {subValue && <div className="text-gray-400 text-sm">{subValue}</div>}
    </div>
  );
}
