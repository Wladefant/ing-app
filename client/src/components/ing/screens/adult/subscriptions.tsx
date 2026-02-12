import { useState, useCallback } from "react";
import { ScreenHeader } from "../../layout";
import {
  CheckCircle2, X, Check, Trash2,
  MessageCircle, Send, TrendingDown, Sparkles, FileText,
  ChevronRight, Shield, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";
import { sendMessageToOpenAI } from "@/lib/openai";

interface Subscription {
  name: string;
  amount: number;
  date: string;
  status: "active" | "unused" | "cancelled";
  logo: string;
  category: string;
  provider: string;
  contractStart: string;
  cancellationPeriod: string;
}

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { name: "Netflix", amount: 12.99, date: "15. des Monats", status: "active", logo: "🎬", category: "Streaming", provider: "Netflix Inc.", contractStart: "März 2023", cancellationPeriod: "Jederzeit kündbar" },
  { name: "Spotify", amount: 9.99, date: "20. des Monats", status: "active", logo: "🎵", category: "Musik", provider: "Spotify AB", contractStart: "Jan 2022", cancellationPeriod: "Jederzeit kündbar" },
  { name: "o2 Unlimited", amount: 39.99, date: "01. des Monats", status: "active", logo: "📱", category: "Mobilfunk", provider: "Telefónica Germany", contractStart: "Sep 2022", cancellationPeriod: "3 Monate zum Vertragsende" },
  { name: "Fitness Studio", amount: 29.90, date: "01. des Monats", status: "unused", logo: "💪", category: "Sport", provider: "FitX GmbH", contractStart: "Jun 2023", cancellationPeriod: "1 Monat zum Quartalsende" },
  { name: "Amazon Prime", amount: 8.99, date: "05. des Monats", status: "active", logo: "📦", category: "Shopping", provider: "Amazon.com", contractStart: "Dez 2021", cancellationPeriod: "Jederzeit kündbar" },
  { name: "iCloud+", amount: 2.99, date: "12. des Monats", status: "active", logo: "☁️", category: "Cloud", provider: "Apple Inc.", contractStart: "Aug 2022", cancellationPeriod: "Jederzeit kündbar" },
];

export function AdultSubscriptionsScreen({
  onBack,
  onLeoClick,
}: {
  onBack: () => void;
  onLeoClick?: () => void;
}) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
  const [cancelStep, setCancelStep] = useState<"confirm" | "drafting" | "draft-ready" | "sent" | "success">("confirm");
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatSub, setAiChatSub] = useState<Subscription | null>(null);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  const activeSubscriptions = subscriptions.filter(s => s.status !== "cancelled");
  const monthlyTotal = activeSubscriptions.reduce((sum, s) => sum + s.amount, 0);
  const yearlyTotal = monthlyTotal * 12;
  const cancelledSavings = subscriptions
    .filter(s => s.status === "cancelled")
    .reduce((sum, s) => sum + s.amount, 0);

  const handleCancelClick = (sub: Subscription) => {
    setCancelTarget(sub);
    setCancelStep("confirm");
    setDraftMessage("");
    setShowCancelModal(true);
  };

  const handleGenerateDraft = useCallback(async () => {
    if (!cancelTarget) return;
    setCancelStep("drafting");

    try {
      const response = await sendMessageToOpenAI(
        [{
          id: "system", sender: "user", text:
            `Schreibe eine professionelle Kündigungsemail auf Deutsch für folgendes Abo:
            - Anbieter: ${cancelTarget.provider}
            - Dienst: ${cancelTarget.name}
            - Monatliche Kosten: ${cancelTarget.amount.toFixed(2)}€
            - Vertragsbeginn: ${cancelTarget.contractStart}
            - Kündigungsfrist: ${cancelTarget.cancellationPeriod}
            
            Halte die Mail kurz und professionell. Verwende "Max Mustermann" als Absendernamen und "max.mustermann@ing.de" als E-Mail. Formatiere es als E-Mail mit Betreff, Anrede und Grußformel.`,
          timestamp: Date.now()
        }],
        "Du bist ein Experte für Vertragsrecht und Kündigungen. Schreibe professionelle Kündigungsbriefe.",
        "adult"
      );
      setDraftMessage(response.response);
      setCancelStep("draft-ready");
    } catch {
      setDraftMessage(
        `Betreff: Kündigung ${cancelTarget.name}\n\nSehr geehrte Damen und Herren,\n\nhiermit kündige ich mein Abonnement bei ${cancelTarget.name} (Vertragsbeginn: ${cancelTarget.contractStart}) fristgerecht zum nächstmöglichen Zeitpunkt.\n\nBitte bestätigen Sie mir die Kündigung und das Vertragsende schriftlich.\n\nMit freundlichen Grüßen\nMax Mustermann\nmax.mustermann@ing.de`
      );
      setCancelStep("draft-ready");
    }
  }, [cancelTarget]);

  const handleSendCancellation = () => {
    setCancelStep("sent");
    setTimeout(() => {
      if (cancelTarget) {
        setSubscriptions(subs =>
          subs.map(s => s.name === cancelTarget.name ? { ...s, status: "cancelled" as const } : s)
        );
      }
      setCancelStep("success");
    }, 2000);
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
    setCancelTarget(null);
    setCancelStep("confirm");
    setDraftMessage("");
  };

  const handleAskAI = async (sub: Subscription) => {
    setAiChatSub(sub);
    setAiMessages([{
      role: "ai",
      text: `Ich habe dein ${sub.name}-Abo analysiert (${sub.amount.toFixed(2)}€/Monat). Was möchtest du wissen? Ich kann dir z.B. sagen, ob es günstigere Alternativen gibt, wie du kündigen kannst, oder ob sich dieses Abo für dich lohnt.`
    }]);
    setShowAIChat(true);
  };

  const handleSendAIMessage = async () => {
    if (!aiInput.trim() || !aiChatSub) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setAiTyping(true);

    try {
      const context = `Der Nutzer fragt über sein ${aiChatSub.name}-Abo (${aiChatSub.amount.toFixed(2)}€/Monat, Kategorie: ${aiChatSub.category}, Anbieter: ${aiChatSub.provider}, seit ${aiChatSub.contractStart}, Kündigungsfrist: ${aiChatSub.cancellationPeriod}, Status: ${aiChatSub.status}). Antworte kurz und hilfreich auf Deutsch.`;
      const response = await sendMessageToOpenAI(
        [{ id: "q", sender: "user", text: userMsg, timestamp: Date.now() }],
        context,
        "adult"
      );
      setAiMessages(prev => [...prev, { role: "ai", text: response.response }]);
    } catch {
      setAiMessages(prev => [...prev, { role: "ai", text: "Entschuldigung, da ist etwas schiefgelaufen. Bitte versuche es nochmal." }]);
    } finally {
      setAiTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader title="Abo-Manager" onBack={onBack} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-500 text-xs font-medium">Monatliche Fixkosten</div>
              <div className="text-3xl font-bold text-[#333]">{monthlyTotal.toFixed(2)} €</div>
              <div className="text-xs text-gray-400 mt-1">{yearlyTotal.toFixed(2)} € / Jahr</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#FF6200]">{activeSubscriptions.length} aktiv</div>
              {cancelledSavings > 0 && (
                <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                  <TrendingDown size={12} />
                  {cancelledSavings.toFixed(2)}€ gespart
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#FF6200] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(activeSubscriptions.length / INITIAL_SUBSCRIPTIONS.length) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>

        {/* AI Agent Smart Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#33307E] to-[#4A47A3] p-4 rounded-2xl shadow-lg text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-sm">Leo Smart Agent</span>
            <span className="bg-white/20 text-[10px] font-black px-2 py-0.5 rounded-full ml-auto">KI</span>
          </div>
          <p className="text-sm text-white/90 leading-relaxed mb-3 relative z-10">
            Ich habe deine {activeSubscriptions.length} aktiven Abos analysiert. Du zahlst {monthlyTotal.toFixed(2)}€/Monat.
            {subscriptions.find(s => s.status === "unused")
              ? " Ich habe ein ungenutztes Abo erkannt — soll ich die Kündigung vorbereiten?"
              : " Alle Abos scheinen genutzt zu werden."}
          </p>
          <div className="flex gap-2 relative z-10">
            <button
              onClick={onLeoClick}
              className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-white/30 transition-colors"
            >
              <MessageCircle size={12} />
              Leo fragen
            </button>
            {subscriptions.find(s => s.status === "unused") && (
              <button
                onClick={() => {
                  const unused = subscriptions.find(s => s.status === "unused");
                  if (unused) handleCancelClick(unused);
                }}
                className="bg-[#FF6200] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Zap size={12} />
                Auto-Kündigung
              </button>
            )}
          </div>
        </motion.div>

        {/* Savings Potential */}
        {subscriptions.some(s => s.status === "unused") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-50 p-4 rounded-2xl border border-green-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-green-600" />
              <span className="font-bold text-green-700 text-sm">Sparpotenzial erkannt</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {subscriptions.filter(s => s.status === "unused").reduce((sum, s) => sum + s.amount * 12, 0).toFixed(2)} € / Jahr
            </div>
            <p className="text-xs text-green-600">
              Durch Kündigung ungenutzter Abos könntest du jährlich sparen.
            </p>
          </motion.div>
        )}

        {/* Subscription List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-[#333] text-sm">Deine Abos</span>
            <span className="text-xs text-gray-400">{subscriptions.length} gesamt</span>
          </div>

          <AnimatePresence>
            {subscriptions.map((sub, index) => (
              <motion.div
                key={sub.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: sub.status === "cancelled" ? 0.5 : 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setSelectedSub(sub)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      sub.status === "cancelled" ? "bg-gray-100" : "bg-gray-50"
                    }`}>
                      {sub.logo}
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${sub.status === "cancelled" ? "text-gray-400 line-through" : "text-[#333]"}`}>
                        {sub.name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {sub.status === "cancelled" ? "Gekündigt" : `${sub.category} • ${sub.date}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={`font-bold text-sm ${sub.status === "cancelled" ? "text-gray-400 line-through" : "text-[#333]"}`}>
                        {sub.amount.toFixed(2)} €
                      </div>
                      {sub.status === "unused" && (
                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">
                          Ungenutzt
                        </span>
                      )}
                      {sub.status === "cancelled" && (
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
                          Gespart!
                        </span>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Subscription Detail Modal ─── */}
      <AnimatePresence>
        {selectedSub && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setSelectedSub(null)}
          >
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#333]">Abo Details</h2>
                <button onClick={() => setSelectedSub(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" title="Schließen">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">{selectedSub.logo}</div>
                <div>
                  <div className={`font-bold text-lg ${selectedSub.status === "cancelled" ? "text-gray-400 line-through" : "text-[#333]"}`}>
                    {selectedSub.name}
                  </div>
                  <div className={`text-sm ${
                    selectedSub.status === "cancelled" ? "text-gray-400" :
                    selectedSub.status === "unused" ? "text-red-500" : "text-green-600"
                  }`}>
                    {selectedSub.status === "cancelled" ? "Gekündigt" :
                     selectedSub.status === "unused" ? "Ungenutzt seit 3 Monaten" : "Aktiv"}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: "Monatliche Kosten", value: `${selectedSub.amount.toFixed(2)} €` },
                  { label: "Jährliche Kosten", value: `${(selectedSub.amount * 12).toFixed(2)} €` },
                  { label: "Kategorie", value: selectedSub.category },
                  { label: "Anbieter", value: selectedSub.provider },
                  { label: "Vertragsbeginn", value: selectedSub.contractStart },
                  { label: "Kündigungsfrist", value: selectedSub.cancellationPeriod },
                  { label: "Nächste Abbuchung", value: selectedSub.date },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="font-bold text-sm text-[#333]">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {selectedSub.status !== "cancelled" ? (
                  <>
                    <button onClick={() => { setSelectedSub(null); handleAskAI(selectedSub); }}
                      className="flex-1 bg-[#33307E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      <MessageCircle size={16} /> Leo fragen
                    </button>
                    <button onClick={() => { setSelectedSub(null); handleCancelClick(selectedSub); }}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Trash2 size={16} /> Kündigen
                    </button>
                  </>
                ) : (
                  <button onClick={() => setSelectedSub(null)}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">Schließen</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── AI Cancel Flow Modal ─── */}
      <AnimatePresence>
        {showCancelModal && cancelTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 flex items-end" onClick={handleCloseModal}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto">

              {cancelStep === "confirm" && (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-[#333]">Abo kündigen</h2>
                    <button onClick={handleCloseModal} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <X size={18} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">{cancelTarget.logo}</div>
                      <div>
                        <div className="font-bold text-[#333]">{cancelTarget.name}</div>
                        <div className="text-sm text-red-600">{cancelTarget.amount.toFixed(2)} € / Monat</div>
                        <div className="text-xs text-gray-500">{cancelTarget.cancellationPeriod}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-4">
                    <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-1">
                      <CheckCircle2 size={16} /> Du sparst jährlich
                    </div>
                    <div className="text-2xl font-bold text-green-600">{(cancelTarget.amount * 12).toFixed(2)} €</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-[#FF6200]" />
                      <span className="font-bold text-orange-700 text-sm">KI-Assistent</span>
                    </div>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      Leo kann automatisch ein professionelles Kündigungsschreiben erstellen und direkt an {cancelTarget.provider} senden.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleCloseModal} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold">Abbrechen</button>
                    <button onClick={handleGenerateDraft}
                      className="flex-1 bg-[#FF6200] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                      <FileText size={16} /> Entwurf erstellen
                    </button>
                  </div>
                </>
              )}

              {cancelStep === "drafting" && (
                <div className="text-center py-10">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-16 h-16 mx-auto mb-4">
                    <div className="w-full h-full bg-[#FF6200] rounded-full flex items-center justify-center">
                      <img src={lionIcon} alt="Leo" className="w-12 h-12 object-contain" />
                    </div>
                  </motion.div>
                  <h3 className="font-bold text-[#333] text-lg mb-2">Leo erstellt Kündigung...</h3>
                  <p className="text-sm text-gray-500">Das professionelle Schreiben wird generiert</p>
                  <div className="flex justify-center gap-1 mt-4">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-2 h-2 bg-[#FF6200] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, type: "tween" }} />
                    ))}
                  </div>
                </div>
              )}

              {cancelStep === "draft-ready" && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-[#FF6200]" />
                      <h2 className="text-lg font-bold text-[#333]">Kündigungsentwurf</h2>
                    </div>
                    <button onClick={handleCloseModal} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <X size={18} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-3 bg-green-50 p-2 rounded-lg border border-green-200">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span className="text-xs font-bold text-green-700">Von Leo erstellt — bereit zum Senden</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{draftMessage}</pre>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCancelStep("confirm")} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold">Zurück</button>
                    <button onClick={handleSendCancellation}
                      className="flex-1 bg-[#FF6200] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Send size={16} /> Absenden
                    </button>
                  </div>
                </>
              )}

              {cancelStep === "sent" && (
                <div className="text-center py-10">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1.1, 1] }} transition={{ duration: 0.5, type: "tween" }}
                    className="w-16 h-16 bg-[#FF6200] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={28} className="text-white" />
                  </motion.div>
                  <h3 className="font-bold text-[#333] text-lg mb-2">Wird gesendet...</h3>
                  <p className="text-sm text-gray-500">Kündigung wird an {cancelTarget?.provider} übermittelt</p>
                </div>
              )}

              {cancelStep === "success" && (
                <div className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check size={40} className="text-green-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-[#333] mb-2">Kündigung gesendet!</h2>
                  <p className="text-gray-500 text-sm mb-5">Erfolgreich an {cancelTarget?.provider} gesendet.</p>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
                    <div className="text-sm text-green-600 mb-1">Monatliche Ersparnis</div>
                    <div className="text-3xl font-bold text-green-600">{cancelTarget?.amount.toFixed(2)} €</div>
                    <div className="text-xs text-green-500 mt-1">= {((cancelTarget?.amount || 0) * 12).toFixed(2)} € / Jahr</div>
                  </div>
                  <button onClick={handleCloseModal} className="w-full bg-[#FF6200] text-white py-3.5 rounded-xl font-bold">Fertig</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── AI Chat about specific subscription ─── */}
      <AnimatePresence>
        {showAIChat && aiChatSub && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 flex items-end">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full bg-white rounded-t-3xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center overflow-hidden">
                    <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#333]">Leo × {aiChatSub.name}</div>
                    <div className="text-[10px] text-gray-400">KI-Abo-Berater</div>
                  </div>
                </div>
                <button onClick={() => setShowAIChat(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" title="Schließen">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiMessages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-[#FF6200] text-white rounded-br-md" : "bg-gray-100 text-[#333] rounded-bl-md"
                    }`}>{msg.text}</div>
                  </motion.div>
                ))}
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, type: "tween" }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
                {["Günstigere Alternativen?", "Wie kündigen?", "Lohnt sich das?"].map(q => (
                  <button key={q} onClick={() => setAiInput(q)}
                    className="bg-gray-100 text-xs text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
                <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendAIMessage(); }}
                  placeholder="Frage zu diesem Abo..."
                  className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6200]/20" />
                <button onClick={handleSendAIMessage} disabled={!aiInput.trim()} title="Senden"
                  className="w-10 h-10 bg-[#FF6200] rounded-xl flex items-center justify-center disabled:opacity-40 transition-opacity">
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
