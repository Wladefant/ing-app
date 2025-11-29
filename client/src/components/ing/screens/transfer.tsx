import { ScreenHeader } from "../layout";
import { Search, ChevronRight, X, User, Info, Camera, Paperclip, BookOpen, CreditCard, Banknote, FileText, Check, ArrowRight, AlertTriangle, Calendar } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addTransaction, updateBalance, type Transaction } from "@/lib/storage";

interface TransferData {
  recipient: string;
  iban: string;
  amount: string;
  reference: string;
  date: "now" | "scheduled";
  scheduledDate?: string;
}

export function TransferScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<"recipient" | "templates" | "amount" | "confirm" | "success">("recipient");
  const [transferData, setTransferData] = useState<TransferData>({
    recipient: "",
    iban: "",
    amount: "",
    reference: "",
    date: "now",
  });

  if (step === "templates") {
    return (
      <TransferTemplatesScreen 
        onBack={() => setStep("recipient")} 
        onSelect={(name, iban) => {
          setTransferData({ ...transferData, recipient: name, iban });
          setStep("amount");
        }}
      />
    );
  }

  if (step === "amount") {
    return (
      <TransferAmountScreen
        transferData={transferData}
        setTransferData={setTransferData}
        onBack={() => setStep("recipient")}
        onContinue={() => setStep("confirm")}
      />
    );
  }

  if (step === "confirm") {
    return (
      <TransferConfirmScreen
        transferData={transferData}
        onBack={() => setStep("amount")}
        onConfirm={() => setStep("success")}
      />
    );
  }

  if (step === "success") {
    return (
      <TransferSuccessScreen
        transferData={transferData}
        onDone={onBack}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]" aria-label="Schließen">
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
               <input 
                 value={transferData.recipient}
                 onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })}
                 placeholder="Name eingeben..."
                 className="w-full border border-[#33307E] rounded px-3 py-3 text-lg outline-none focus:ring-1 focus:ring-[#33307E]" 
               />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">{transferData.recipient.length}/70</div>
         </div>

         <div className="mb-8">
            <label className="block text-sm font-bold text-[#333333] mb-2">IBAN</label>
            <div className="relative">
               <input 
                 value={transferData.iban}
                 onChange={(e) => setTransferData({ ...transferData, iban: e.target.value.toUpperCase() })}
                 placeholder="DE..."
                 className="w-full border border-gray-300 rounded px-3 py-3 text-lg outline-none focus:border-[#33307E] focus:ring-1 focus:ring-[#33307E] bg-gray-50 font-mono tracking-wider" 
               />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">{transferData.iban.length}/34</div>
         </div>

         {/* Options */}
         <div className="mb-4 text-sm font-bold text-[#333333]">Optionen</div>
         
         <div className="divide-y divide-gray-100 border-t border-gray-100">
             <OptionRow icon={<User className="text-[#FF6200]" size={20} />} label="An eigenes Konto überweisen" onClick={() => {
               setTransferData({ ...transferData, recipient: "Eigenes Extra-Konto", iban: "DE12 5001 0517 1234 5678 66" });
               setStep("amount");
             }} />
             <OptionRow icon={<BookOpen className="text-[#FF6200]" size={20} />} label="Aus Vorlage überweisen" onClick={() => setStep("templates")} />
             <OptionRow icon={<Camera className="text-[#FF6200]" size={20} />} label="Rechnung fotografieren oder QR-Code scannen" />
             <OptionRow icon={<Paperclip className="text-[#FF6200]" size={20} />} label="Rechnung aus Dateien hochladen" />
         </div>
      </div>

      {/* Footer Button */}
      <div className="p-4 border-t border-gray-100">
         <button 
            onClick={() => {
              if (transferData.recipient && transferData.iban) {
                setStep("amount");
              }
            }}
            disabled={!transferData.recipient || !transferData.iban}
            className="w-full py-3.5 bg-[#33307E] text-white font-bold rounded-lg hover:bg-[#282668] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
         >
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

// Amount Entry Screen
function TransferAmountScreen({ 
  transferData, 
  setTransferData, 
  onBack, 
  onContinue 
}: { 
  transferData: TransferData; 
  setTransferData: (data: TransferData) => void;
  onBack: () => void; 
  onContinue: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
            <X size={24} />
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Überweisung</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        {/* Recipient Summary */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <div className="text-xs text-gray-500 mb-1">An</div>
          <div className="font-bold text-[#333333]">{transferData.recipient}</div>
          <div className="text-sm text-gray-500 font-mono">{transferData.iban}</div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#333333] mb-2">Betrag</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">€</span>
            <input 
              type="number"
              value={transferData.amount}
              onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
              placeholder="0,00"
              className="w-full border border-[#33307E] rounded px-3 py-4 pl-10 text-2xl font-bold outline-none focus:ring-1 focus:ring-[#33307E] text-right"
            />
          </div>
          <div className="text-xs text-gray-500 mt-2">Verfügbar: 2.101,10 € auf Girokonto</div>
        </div>

        {/* Reference */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#333333] mb-2">Verwendungszweck (optional)</label>
          <input 
            value={transferData.reference}
            onChange={(e) => setTransferData({ ...transferData, reference: e.target.value })}
            placeholder="z.B. Miete Januar"
            className="w-full border border-gray-300 rounded px-3 py-3 outline-none focus:border-[#33307E] focus:ring-1 focus:ring-[#33307E]"
          />
          <div className="text-right text-xs text-gray-400 mt-1">{transferData.reference.length}/140</div>
        </div>

        {/* Schedule */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#333333] mb-3">Wann soll überwiesen werden?</label>
          <div className="flex gap-3">
            <button
              onClick={() => setTransferData({ ...transferData, date: "now" })}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                transferData.date === "now" 
                  ? "border-[#33307E] bg-[#33307E]/5" 
                  : "border-gray-200"
              }`}
            >
              <div className={`font-bold text-sm ${transferData.date === "now" ? "text-[#33307E]" : "text-gray-600"}`}>
                Sofort
              </div>
              <div className="text-xs text-gray-500">Heute ausführen</div>
            </button>
            <button
              onClick={() => setTransferData({ ...transferData, date: "scheduled" })}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                transferData.date === "scheduled" 
                  ? "border-[#33307E] bg-[#33307E]/5" 
                  : "border-gray-200"
              }`}
            >
              <div className={`font-bold text-sm ${transferData.date === "scheduled" ? "text-[#33307E]" : "text-gray-600"}`}>
                Terminiert
              </div>
              <div className="text-xs text-gray-500">Datum wählen</div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onContinue}
          disabled={!transferData.amount || parseFloat(transferData.amount) <= 0}
          className="w-full py-3.5 bg-[#33307E] text-white font-bold rounded-lg hover:bg-[#282668] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}

// Confirmation Screen
function TransferConfirmScreen({
  transferData,
  onBack,
  onConfirm,
}: {
  transferData: TransferData;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const amount = parseFloat(transferData.amount) || 0;

  const handleConfirm = () => {
    // Save transaction to storage
    addTransaction({
      type: "transfer",
      amount: -amount,
      currency: "EUR",
      from: "Girokonto",
      to: transferData.recipient,
      reference: transferData.reference || "Überweisung",
      date: new Date().toISOString().split("T")[0],
      status: transferData.date === "now" ? "completed" : "pending",
    });

    // Update balance
    updateBalance("girokonto", -amount);

    // Continue to success screen
    onConfirm();
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
            <X size={24} />
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Bestätigen</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        {/* Amount Display */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Du überweist</div>
          <div className="text-4xl font-bold text-[#333333]">€{amount.toFixed(2)}</div>
        </div>

        {/* Transfer Details */}
        <div className="bg-gray-50 rounded-xl overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="text-xs text-gray-500 mb-1">An</div>
            <div className="font-bold text-[#333333]">{transferData.recipient}</div>
            <div className="text-sm text-gray-500 font-mono">{transferData.iban}</div>
          </div>
          <div className="p-4 border-b border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Von</div>
            <div className="font-bold text-[#333333]">Girokonto</div>
            <div className="text-sm text-gray-500">DE10 1234 5678 1234 5678 90</div>
          </div>
          {transferData.reference && (
            <div className="p-4 border-b border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Verwendungszweck</div>
              <div className="text-[#333333]">{transferData.reference}</div>
            </div>
          )}
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">Ausführung</div>
            <div className="text-[#333333]">
              {transferData.date === "now" ? "Sofort" : `Geplant für ${transferData.scheduledDate || "später"}`}
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            Bitte prüfe die Angaben sorgfältig. Nach der Bestätigung kann die Überweisung nicht mehr geändert werden.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <button 
          onClick={handleConfirm}
          className="w-full py-3.5 bg-[#FF6200] text-white font-bold rounded-lg hover:bg-[#e55800] transition-colors flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Überweisung bestätigen
        </button>
        <button 
          onClick={onBack}
          className="w-full py-3.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}

// Success Screen
function TransferSuccessScreen({
  transferData,
  onDone,
}: {
  transferData: TransferData;
  onDone: () => void;
}) {
  const amount = parseFloat(transferData.amount) || 0;

  return (
    <div className="flex-1 flex flex-col bg-white items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <Check size={48} className="text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-[#333333] mb-2">Überweisung erfolgreich!</h2>
        <p className="text-gray-500 mb-8">
          €{amount.toFixed(2)} an {transferData.recipient}
        </p>

        <div className="bg-gray-50 p-4 rounded-xl mb-8 text-left">
          <div className="text-xs text-gray-500 mb-1">Referenznummer</div>
          <div className="font-mono text-sm text-[#333333]">TRF{Date.now().toString().slice(-10)}</div>
        </div>

        <button 
          onClick={onDone}
          className="w-full py-3.5 bg-[#FF6200] text-white font-bold rounded-lg hover:bg-[#e55800] transition-colors"
        >
          Fertig
        </button>
      </motion.div>
    </div>
  );
}

export function TransferTemplatesScreen({ 
  onBack,
  onSelect,
}: { 
  onBack: () => void;
  onSelect?: (name: string, iban: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
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
            onClick={() => onSelect?.("Andreas Mustermann", "DE10 1234 5678 1234 5678 91")}
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
            onClick={() => onSelect?.("Marios Pizza", "DE45 1234 5678 1234 5678 91")}
         />
         
         <TemplateRow 
            initials="MM"
            name="Martin Müller"
            sub="Mietanteil"
            iban="DE34 1234 5678 1234 5678 01"
            color="bg-[#33307E]"
            onClick={() => onSelect?.("Martin Müller", "DE34 1234 5678 1234 5678 01")}
         />
      </div>
    </div>
  );
}

function TemplateRow({ initials, name, sub, iban, color = "bg-purple-700", onClick }: { initials: string; name: string; sub: string; iban: string; color?: string; onClick?: () => void }) {
  return (
     <button onClick={onClick} className="w-full p-4 flex items-center gap-4 border-b border-gray-100 hover:bg-gray-50 text-left">
        <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
           {initials}
        </div>
        <div className="overflow-hidden">
           <div className="font-bold text-[#333333] text-sm truncate">{name}</div>
           <div className="text-xs text-gray-500 truncate">{sub}</div>
           <div className="text-xs text-gray-400 truncate">{iban}</div>
        </div>
     </button>
  );
}
