import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertTriangle, CheckCircle, TrendingUp, FileText, Calculator, Mail, ChevronRight, AlertCircle, Shield, Briefcase } from "lucide-react";
import { MobileLayout } from "@/components/ing/layout";
import { JuniorDashboardScreen } from "@/components/ing/screens/junior/dashboard";
import { LeoChatOverlay } from "@/components/ing/leo/chat-overlay";
import { ChatMessage } from "@/lib/demo-scenarios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import lionIcon from "@/assets/lion-logo.png";

type DemoStep =
  | "splash"
  | "chat-open"
  | "cash-flow-question"
  | "cash-flow-response"
  | "cancellation-draft"
  | "cancellation-sent"
  | "stock-question"
  | "stock-response"
  | "landlord-question"
  | "landlord-response"
  | "afford-question"
  | "afford-response"
  | "tax-agent";

export function AIAgentDemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("splash");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const pushMessage = (message: Omit<ChatMessage, "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        timestamp: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const timings: Record<DemoStep, number> = {
      splash: 2500,
      "chat-open": 800,
      "cash-flow-question": 2500,
      "cash-flow-response": 3800,
      "cancellation-draft": 3800,
      "cancellation-sent": 2000,
      "stock-question": 2800,
      "stock-response": 3800,
      "landlord-question": 2400,
      "landlord-response": 3200,
      "afford-question": 2200,
      "afford-response": 3200,
      "tax-agent": 5200,
    };

    const timer = setTimeout(() => {
      switch (currentStep) {
        case "splash":
          setIsChatOpen(true);
          setCurrentStep("chat-open");
          break;
        case "chat-open":
          pushMessage({
            id: "msg-1",
            sender: "user",
            text: "Leo, ich muss meinen Cash Flow verstehen.",
          });
          setIsTyping(true);
          setCurrentStep("cash-flow-question");
          break;
        case "cash-flow-question":
          pushMessage({
            id: "msg-2",
            sender: "leo",
            text: "Analyse abgeschlossen. Monatliches Einkommen: **€1.200** (Freelance). Monatliche Ausgaben: **€980**. Ich habe doppelte Mobilfunkvertraege gefunden.",
            widget: <CashFlowAnalysisWidget />,
          });
          setIsTyping(false);
          setCurrentStep("cash-flow-response");
          break;
        case "cash-flow-response":
          pushMessage({
            id: "msg-3",
            sender: "leo",
            text: "Ich habe die Kuendigung fuer O2 erstellt. Betreff: **Kuendigung Mobilfunkvertrag**. Klicke zum Pruefen und Senden.",
            widget: <CancellationDraftWidget sent={emailSent} onSend={() => setEmailSent(true)} />,
          });
          setCurrentStep("cancellation-draft");
          break;
        case "cancellation-draft":
          setEmailSent(true);
          setCurrentStep("cancellation-sent");
          break;
        case "cancellation-sent":
          pushMessage({
            id: "msg-4",
            sender: "user",
            text: "Ich moechte investieren. Was ist mit dem Automobilsektor?",
          });
          setIsTyping(true);
          setCurrentStep("stock-question");
          break;
        case "stock-question":
          pushMessage({
            id: "msg-5",
            sender: "leo",
            text: "Smart Agent Analyse: Ich habe 200 Nachrichtenberichte von Reuters, Bloomberg und Handelsblatt gescannt. Der Automobilsektor ist derzeit instabil.",
            widget: <StockAnalysisWidget />,
          });
          setIsTyping(false);
          setCurrentStep("stock-response");
          break;
        case "stock-response":
          pushMessage({
            id: "msg-6",
            sender: "user",
            text: "Und die E-Mail vom Vermieter?",
          });
          setIsTyping(true);
          setCurrentStep("landlord-question");
          break;
        case "landlord-question":
          pushMessage({
            id: "msg-7",
            sender: "leo",
            text: "Ich habe das PDF gelesen. Es enthaelt eine **Staffelmiete** Klausel.",
            widget: <LandlordAnalysisWidget />,
          });
          setIsTyping(false);
          setCurrentStep("landlord-response");
          break;
        case "landlord-response":
          pushMessage({
            id: "msg-8",
            sender: "user",
            text: "Kann ich mir das leisten?",
          });
          setIsTyping(true);
          setCurrentStep("afford-question");
          break;
        case "afford-question":
          pushMessage({
            id: "msg-9",
            sender: "leo",
            text: "Ja. Ich habe deine Sparrate von **€220/Monat** auf **€190/Monat** angepasst, damit es passt.",
            widget: <AffordResponseWidget />,
          });
          setIsTyping(false);
          setCurrentStep("afford-response");
          break;
        case "afford-response":
          pushMessage({
            id: "msg-10",
            sender: "leo",
            text: "Zum Schluss: Fuer dein Freelance-Einkommen diesen Monat (**€1.200**) habe ich automatisch **30% (€360)** fuer die Steuer zurueckgelegt. Du bist fuer die naechste Steuererklaerung abgesichert.",
            widget: <TaxAgentWidget />,
          });
          setCurrentStep("tax-agent");
          break;
        case "tax-agent":
          setIsAutoPlaying(false);
          break;
      }
    }, timings[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, isPaused, emailSent]);

  const restartDemo = () => {
    setCurrentStep("splash");
    setMessages([]);
    setEmailSent(false);
    setIsAutoPlaying(true);
    setIsPaused(false);
    setIsChatOpen(false);
    setIsTyping(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 font-sans">
      <MobileLayout>
        <JuniorDashboardScreen onNavigate={() => {}} onLeoClick={() => setIsChatOpen(true)} />

        <LeoChatOverlay
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={() => {}}
          isTyping={isTyping}
        />

        <AnimatePresence mode="wait">
          {currentStep === "splash" && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-[#FF6200] to-[#E55800] flex flex-col items-center justify-center px-8 z-50"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
              >
                <img src={lionIcon} alt="Leo" className="w-20 h-20 object-contain" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-3xl font-bold mt-6"
              >
                LEO
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 mt-2 text-center"
              >
                Dein Finanzassistent
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </MobileLayout>

      <button
        onClick={() => setShowExtras(!showExtras)}
        className="fixed top-4 right-4 z-[100] p-3 bg-black/80 backdrop-blur rounded-full text-white hover:bg-black transition-colors"
        title={showExtras ? "Hide controls (Recording mode)" : "Show controls"}
      >
        {showExtras ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      <div className="fixed bottom-4 right-4 z-[60]">
        <div className="flex gap-2 bg-black/80 backdrop-blur rounded-full px-4 py-2">
          <button
            onClick={restartDemo}
            className="text-white text-xs font-medium hover:text-[#FF6200] transition-colors px-2"
          >
            ↺ Restart
          </button>
          <div className="w-px bg-white/30" />
          <button
            onClick={togglePause}
            className="text-white text-xs font-medium hover:text-[#FF6200] transition-colors px-2"
          >
            {isPaused ? "▶ Play" : "⏸ Pause"}
          </button>
          {showExtras && (
            <>
              <div className="w-px bg-white/30" />
              <span className="text-white/60 text-xs px-2">
                {currentStep}
              </span>
            </>
          )}
        </div>
      </div>

      {showExtras && (
        <div className="hidden lg:block ml-8 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🤖</span>
              AI Agent Demo
            </h2>
            <p className="text-gray-600 mb-4">
              Ein schneller Walkthrough durch die wichtigsten Agent-Features.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cash Flow Analyse</p>
                  <p className="text-sm text-gray-500">Erkennt doppelte Vertraege automatisch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Auto-Kuendigung</p>
                  <p className="text-sm text-gray-500">Entwurf inkl. Versand</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Smart Stock Agent</p>
                  <p className="text-sm text-gray-500">200+ Quellen gescannt</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dokumenten-Scanner</p>
                  <p className="text-sm text-gray-500">PDF-Analyse mit Staffelmiete</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Steuer-Agent</p>
                  <p className="text-sm text-gray-500">Automatische Ruecklage + Pie Chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CashFlowAnalysisWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Monatliches Einkommen</span>
        <span className="font-bold text-green-600">€1.200</span>
      </div>
      <div className="text-xs text-gray-400">Freelance</div>
      <div className="h-px bg-gray-100" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Monatliche Ausgaben</span>
        <span className="font-bold text-gray-700">€980</span>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-700">Doppelte Mobilfunkvertraege</p>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-red-600">O2</span>
                <span className="font-bold text-red-700">€19,99/Monat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Telekom</span>
                <span className="font-bold text-red-700">€24,99/Monat</span>
              </div>
            </div>
            <p className="text-xs text-red-700 font-bold mt-2">Du zahlst doppelt.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CancellationDraftWidget({ sent, onSend }: { sent: boolean; onSend: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-gray-400" />
        <span className="text-xs text-gray-500">E-Mail Vorschau</span>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-2">
        <div className="flex gap-2">
          <span className="text-gray-400 w-12">An:</span>
          <span className="text-gray-700">kuendigung@o2online.de</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 w-12">Betreff:</span>
          <span className="text-gray-700 font-medium">Kuendigung Mobilfunkvertrag</span>
        </div>
        <div className="h-px bg-gray-200 my-2" />
        <div className="text-gray-600 leading-relaxed">
          Sehr geehrte Damen und Herren,<br /><br />
          hiermit kuendige ich meinen Mobilfunkvertrag fristgerecht zum naechstmoeglichen Zeitpunkt...<br /><br />
          Mit freundlichen Gruessen,<br />
          Sofia Mueller
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.button
            key="send"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={onSend}
            className="w-full bg-[#FF6200] text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Senden ✉️
          </motion.button>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-green-500 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle size={14} />
            Erfolgreich gesendet
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StockAnalysisWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp size={14} className="text-[#FF6200]" />
        <span className="text-xs font-bold text-gray-700">Smart Agent Analyse</span>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">Automobilsektor: Instabil</p>
            <ul className="text-xs text-amber-700 mt-2 space-y-1">
              <li>• Lieferkettenprobleme</li>
              <li>• Ruecklaeufige EV-Subventionen</li>
              <li>• Hohe Volatilitaet</li>
            </ul>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] text-amber-700">Risiko-Level:</span>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">HOCH</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={12} className="text-green-600" />
          <span className="text-xs font-bold text-green-700">Empfehlung: Abwarten</span>
        </div>
        <div className="text-xs text-green-700 space-y-1">
          {["Erneuerbare Energien", "Healthcare Tech", "Cloud Computing"].map((sector) => (
            <div key={sector} className="flex items-center gap-1">
              <ChevronRight size={12} />
              <span>{sector}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandlordAnalysisWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-[#FF6200]" />
        <span className="text-xs font-bold text-gray-700">Dokumenten-Scanner</span>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-orange-800">Staffelmiete erkannt</p>
            <p className="text-xs text-orange-700 mt-1">
              Miete steigt automatisch um <span className="font-bold">€30/Monat</span> ab dem 1. Maerz.
            </p>
            <div className="bg-white rounded-lg p-2 mt-2 border border-orange-200">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Alt:</span>
                <span className="text-gray-700">€800</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-orange-600 font-medium">Neu:</span>
                <span className="text-orange-700 font-bold">€830</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AffordResponseWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-xs font-bold text-green-700">Budget angepasst</span>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-3">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Alte Sparrate</span>
          <span className="text-gray-400 line-through">€220/Monat</span>
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className="text-green-700 font-medium">Neue Sparrate</span>
          <span className="text-green-700 font-bold">€190/Monat</span>
        </div>
      </div>
    </div>
  );
}

function TaxAgentWidget() {
  const data = useMemo(() => ([
    { name: "Miete", value: 830, color: "#FF6200", className: "bg-[#FF6200]" },
    { name: "Steuerruecklage", value: 360, color: "#FF8F00", className: "bg-[#FF8F00]" },
    { name: "Investments", value: 180, color: "#4CAF50", className: "bg-[#4CAF50]" },
    { name: "Ausgaben", value: 430, color: "#7E57C2", className: "bg-[#7E57C2]" },
  ]), []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator size={14} className="text-[#FF6200]" />
        <span className="text-xs font-bold text-gray-700">Freelance Steuer-Agent</span>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Einkommen</span>
          <span className="font-bold text-gray-800">€1.200</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-600">Steuerruecklage (30%)</span>
          <span className="font-bold text-red-600">€360</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
        <div className="text-xs font-bold text-gray-700 mb-2">Savings Breakdown</div>
        <div className="h-40 flex">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 flex flex-col justify-center gap-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-[10px]">
                <div className={`w-3 h-3 rounded-full ${item.className}`} />
                <span className="text-gray-600 truncate">{item.name}</span>
                <span className="font-bold ml-auto">€{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-green-700">
        <CheckCircle size={12} className="text-green-500" />
        Du bist fuer die naechste Steuererklaerung abgesichert.
      </div>
    </div>
  );
}
