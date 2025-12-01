import { ScreenHeader } from "../layout";
import { Search, ChevronRight, X, User, Info, Camera, Paperclip, BookOpen, CreditCard, Banknote, FileText, Check, ArrowRight, AlertTriangle, Calendar, ArrowLeft, RefreshCw } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addTransaction, updateBalance, getBalance, type Transaction } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface TransferData {
  recipient: string;
  iban: string;
  amount: string;
  reference: string;
  date: "now" | "scheduled";
  scheduledDate?: string;
}

/**
 * Validates German IBAN format
 * @param iban - The IBAN string to validate
 * @returns Object with isValid boolean and optional error message
 */
function validateIBAN(iban: string): { isValid: boolean; error?: string } {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, "").toUpperCase();
  
  if (!cleanIban) {
    return { isValid: false, error: "IBAN ist erforderlich" };
  }
  
  // Check for German IBAN format (DE + 20 characters)
  if (!cleanIban.startsWith("DE")) {
    return { isValid: false, error: "Nur deutsche IBANs werden unterstützt (DE...)" };
  }
  
  if (cleanIban.length !== 22) {
    return { isValid: false, error: `IBAN muss 22 Zeichen haben (aktuell: ${cleanIban.length})` };
  }
  
  // Check if remaining characters are digits
  const numericPart = cleanIban.substring(2);
  if (!/^\d+$/.test(numericPart)) {
    return { isValid: false, error: "IBAN enthält ungültige Zeichen" };
  }
  
  return { isValid: true };
}

/**
 * Validates transfer amount
 */
function validateAmount(amount: string, availableBalance: number): { isValid: boolean; error?: string } {
  if (!amount || amount.trim() === "") {
    return { isValid: false, error: "Betrag ist erforderlich" };
  }
  
  const numericAmount = parseFloat(amount.replace(",", "."));
  
  if (isNaN(numericAmount)) {
    return { isValid: false, error: "Ungültiger Betrag" };
  }
  
  if (numericAmount <= 0) {
    return { isValid: false, error: "Betrag muss größer als 0 sein" };
  }
  
  if (numericAmount > availableBalance) {
    return { isValid: false, error: `Nicht genügend Guthaben (verfügbar: €${availableBalance.toFixed(2)})` };
  }
  
  return { isValid: true };
}

/** Progress Indicator component for transfer steps */
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3 bg-gray-50 border-b border-gray-100">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              index + 1 < currentStep
                ? "bg-green-500 text-white"
                : index + 1 === currentStep
                ? "bg-[#FF6200] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {index + 1 < currentStep ? <Check size={16} /> : index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-8 h-0.5 transition-all ${
                index + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
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
  const [ibanError, setIbanError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current step number for progress indicator
  const getCurrentStepNumber = () => {
    switch (step) {
      case "recipient": return 1;
      case "templates": return 1;
      case "amount": return 2;
      case "confirm": return 3;
      case "success": return 4;
      default: return 1;
    }
  };

  // Handle step 1 -> step 2 transition with validation
  const handleRecipientContinue = useCallback(() => {
    // Validate recipient
    if (!transferData.recipient.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Empfänger ein",
        variant: "destructive",
      });
      return;
    }

    // Validate IBAN
    const ibanValidation = validateIBAN(transferData.iban);
    if (!ibanValidation.isValid) {
      setIbanError(ibanValidation.error || "Ungültige IBAN");
      toast({
        title: "IBAN ungültig",
        description: ibanValidation.error,
        variant: "destructive",
      });
      return;
    }

    setIbanError(null);
    setStep("amount");
  }, [transferData.recipient, transferData.iban, toast]);

  // Reset and start new transfer
  const handleNewTransfer = () => {
    setTransferData({
      recipient: "",
      iban: "",
      amount: "",
      reference: "",
      date: "now",
    });
    setIbanError(null);
    setStep("recipient");
  };

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
        stepNumber={2}
      />
    );
  }

  if (step === "confirm") {
    return (
      <TransferConfirmScreen
        transferData={transferData}
        onBack={() => setStep("amount")}
        onConfirm={() => setStep("success")}
        stepNumber={3}
      />
    );
  }

  if (step === "success") {
    return (
      <TransferSuccessScreen
        transferData={transferData}
        onDone={onBack}
        onNewTransfer={handleNewTransfer}
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
          <h1 className="text-lg font-bold text-[#333333]">Überweisung</h1>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={getCurrentStepNumber()} totalSteps={3} />

      <div className="flex-1 overflow-y-auto px-6 pt-6">
         {/* Step Label */}
         <div className="text-xs text-gray-500 mb-4 font-medium">Schritt 1 von 3 – Empfänger angeben</div>

         {/* Form Fields */}
         <div className="mb-6">
            <label className="block text-sm font-bold text-[#333333] mb-2">Empfänger *</label>
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
            <label className="block text-sm font-bold text-[#333333] mb-2">IBAN *</label>
            <div className="relative">
               <input 
                 value={transferData.iban}
                 onChange={(e) => {
                   setTransferData({ ...transferData, iban: e.target.value.toUpperCase() });
                   if (ibanError) setIbanError(null);
                 }}
                 placeholder="DE00 0000 0000 0000 0000 00"
                 className={`w-full border rounded px-3 py-3 text-lg outline-none focus:ring-1 bg-gray-50 font-mono tracking-wider ${
                   ibanError 
                     ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                     : "border-gray-300 focus:border-[#33307E] focus:ring-[#33307E]"
                 }`} 
               />
            </div>
            {ibanError ? (
              <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {ibanError}
              </div>
            ) : (
              <div className="text-right text-xs text-gray-400 mt-1">{transferData.iban.replace(/\s/g, "").length}/22</div>
            )}
         </div>

         {/* Options */}
         <div className="mb-4 text-sm font-bold text-[#333333]">Schnellauswahl</div>
         
         <div className="divide-y divide-gray-100 border-t border-gray-100">
             <OptionRow icon={<User className="text-[#FF6200]" size={20} />} label="An eigenes Konto überweisen" onClick={() => {
               setTransferData({ ...transferData, recipient: "Eigenes Extra-Konto", iban: "DE12 5001 0517 1234 5678 66" });
               setStep("amount");
             }} />
             <OptionRow icon={<BookOpen className="text-[#FF6200]" size={20} />} label="Aus Vorlage überweisen" onClick={() => setStep("templates")} />
             <OptionRow icon={<Camera className="text-[#FF6200]" size={20} />} label="Rechnung fotografieren oder QR-Code scannen" onClick={() => {
               toast({ title: "Kamera", description: "Kamerazugriff ist in der Demo nicht verfügbar" });
             }} />
             <OptionRow icon={<Paperclip className="text-[#FF6200]" size={20} />} label="Rechnung aus Dateien hochladen" onClick={() => {
               toast({ title: "Upload", description: "Datei-Upload ist in der Demo nicht verfügbar" });
             }} />
         </div>
      </div>

      {/* Footer Button */}
      <div className="p-4 border-t border-gray-100">
         <button 
            onClick={handleRecipientContinue}
            disabled={!transferData.recipient || !transferData.iban}
            className="w-full py-3.5 bg-[#FF6200] text-white font-bold rounded-lg hover:bg-[#e55800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
         >
            Weiter
            <ArrowRight size={18} />
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
  onContinue,
  stepNumber = 2,
}: { 
  transferData: TransferData; 
  setTransferData: (data: TransferData) => void;
  onBack: () => void; 
  onContinue: () => void;
  stepNumber?: number;
}) {
  const [amountError, setAmountError] = useState<string | null>(null);
  const { toast } = useToast();
  const balance = getBalance();
  const availableBalance = balance.girokonto;

  const handleContinue = () => {
    const validation = validateAmount(transferData.amount, availableBalance);
    if (!validation.isValid) {
      setAmountError(validation.error || "Ungültiger Betrag");
      toast({
        title: "Betrag ungültig",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    setAmountError(null);
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Betrag & Details</h1>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={stepNumber} totalSteps={3} />

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        {/* Step Label */}
        <div className="text-xs text-gray-500 mb-4 font-medium">Schritt 2 von 3 – Betrag eingeben</div>

        {/* Recipient Summary */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Empfänger</div>
          <div className="font-bold text-[#333333]">{transferData.recipient}</div>
          <div className="text-sm text-gray-500 font-mono">{transferData.iban}</div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#333333] mb-2">Betrag *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">€</span>
            <input 
              type="text"
              inputMode="decimal"
              value={transferData.amount}
              onChange={(e) => {
                // Allow only numbers and one decimal point
                const value = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                setTransferData({ ...transferData, amount: value });
                if (amountError) setAmountError(null);
              }}
              placeholder="0.00"
              className={`w-full border rounded px-3 py-4 pl-10 text-2xl font-bold outline-none focus:ring-1 text-right ${
                amountError 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                  : "border-[#33307E] focus:ring-[#33307E]"
              }`}
            />
          </div>
          {amountError ? (
            <div className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <AlertTriangle size={12} />
              {amountError}
            </div>
          ) : (
            <div className="text-xs text-gray-500 mt-2">
              Verfügbar: <span className="font-semibold">€{availableBalance.toFixed(2)}</span> auf Girokonto
            </div>
          )}
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
          <label className="block text-sm font-bold text-[#333333] mb-3">Ausführungsdatum</label>
          <div className="flex gap-3">
            <button
              onClick={() => setTransferData({ ...transferData, date: "now" })}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                transferData.date === "now" 
                  ? "border-[#FF6200] bg-[#FF6200]/5" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`font-bold text-sm ${transferData.date === "now" ? "text-[#FF6200]" : "text-gray-600"}`}>
                Sofort
              </div>
              <div className="text-xs text-gray-500">Heute ausführen</div>
            </button>
            <button
              onClick={() => setTransferData({ ...transferData, date: "scheduled" })}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                transferData.date === "scheduled" 
                  ? "border-[#FF6200] bg-[#FF6200]/5" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`font-bold text-sm ${transferData.date === "scheduled" ? "text-[#FF6200]" : "text-gray-600"}`}>
                Terminiert
              </div>
              <div className="text-xs text-gray-500">Datum wählen</div>
            </button>
          </div>
        </div>

        {/* Fee Info */}
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <Check size={16} className="text-green-600" />
          <span className="text-sm text-green-700">Kostenlose Überweisung (SEPA)</span>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleContinue}
          disabled={!transferData.amount || parseFloat(transferData.amount) <= 0}
          className="w-full py-3.5 bg-[#FF6200] text-white font-bold rounded-lg hover:bg-[#e55800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Weiter zur Bestätigung
          <ArrowRight size={18} />
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
  stepNumber = 3,
}: {
  transferData: TransferData;
  onBack: () => void;
  onConfirm: () => void;
  stepNumber?: number;
}) {
  const amount = parseFloat(transferData.amount) || 0;
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
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

      toast({
        title: "Überweisung erfolgreich!",
        description: `€${amount.toFixed(2)} an ${transferData.recipient}`,
      });

      // Continue to success screen
      onConfirm();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Überweisung konnte nicht durchgeführt werden",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück" disabled={isProcessing}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Bestätigung</h1>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={stepNumber} totalSteps={3} />

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        {/* Step Label */}
        <div className="text-xs text-gray-500 mb-4 font-medium">Schritt 3 von 3 – Prüfen & Bestätigen</div>

        {/* Amount Display */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Du überweist</div>
          <div className="text-4xl font-bold text-[#333333]">€{amount.toFixed(2)}</div>
        </div>

        {/* Transfer Details */}
        <div className="bg-gray-50 rounded-xl overflow-hidden mb-6 border border-gray-200">
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
          <div className="p-4 border-b border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Ausführung</div>
            <div className="text-[#333333] flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              {transferData.date === "now" ? `Sofort (${today})` : `Geplant für ${transferData.scheduledDate || "später"}`}
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">Gebühren</div>
            <div className="text-[#333333] text-green-600 font-medium">Kostenlos (SEPA)</div>
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
          disabled={isProcessing}
          className="w-full py-3.5 bg-[#FF6200] text-white font-bold rounded-lg hover:bg-[#e55800] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Wird verarbeitet...
            </>
          ) : (
            <>
              <Check size={20} />
              Jetzt senden
            </>
          )}
        </button>
        <button 
          onClick={onBack}
          disabled={isProcessing}
          className="w-full py-3.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Zurück bearbeiten
        </button>
      </div>
    </div>
  );
}

// Success Screen
function TransferSuccessScreen({
  transferData,
  onDone,
  onNewTransfer,
}: {
  transferData: TransferData;
  onDone: () => void;
  onNewTransfer: () => void;
}) {
  const amount = parseFloat(transferData.amount) || 0;
  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="flex-1 flex flex-col bg-white items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <Check size={48} className="text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center w-full"
      >
        <h2 className="text-2xl font-bold text-[#333333] mb-2">Überweisung erfolgreich!</h2>
        <p className="text-gray-500 mb-6">
          <span className="text-[#FF6200] font-bold">€{amount.toFixed(2)}</span> an {transferData.recipient}
        </p>

        <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left border border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Referenznummer</div>
              <div className="font-mono text-sm text-[#333333]">TRF{Date.now().toString().slice(-10)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <div className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                <Check size={14} />
                Abgeschlossen
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Ausgeführt am</div>
            <div className="text-sm text-[#333333]">{today}</div>
          </div>
          {transferData.reference && (
            <div className="pt-3 mt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Verwendungszweck</div>
              <div className="text-sm text-[#333333]">{transferData.reference}</div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button 
            onClick={onDone}
            className="w-full py-3.5 bg-[#FF6200] text-white font-bold rounded-lg hover:bg-[#e55800] transition-colors"
          >
            Fertig
          </button>
          <button 
            onClick={onNewTransfer}
            className="w-full py-3.5 bg-gray-100 text-[#FF6200] font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Neue Überweisung
          </button>
        </div>
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
