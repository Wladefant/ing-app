import { useState } from "react";
import { ScreenHeader } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { AlertCircle, CheckCircle2, XCircle, ArrowRight, X, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Subscription {
    name: string;
    amount: number;
    date: string;
    status: "active" | "unused" | "cancelled";
    logo: string;
}

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
    { name: "Netflix", amount: 12.99, date: "15. Okt", status: "active", logo: "N" },
    { name: "Spotify", amount: 9.99, date: "20. Okt", status: "active", logo: "S" },
    { name: "Fitness Studio", amount: 29.90, date: "01. Okt", status: "unused", logo: "F" },
    { name: "Amazon Prime", amount: 8.99, date: "05. Okt", status: "active", logo: "A" },
];

export function AdultSubscriptionsScreen({
    onBack
}: {
    onBack: () => void
}) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
    const [cancelStep, setCancelStep] = useState<"confirm" | "success">("confirm");
    const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

    const activeSubscriptions = subscriptions.filter(s => s.status !== "cancelled");
    const monthlyTotal = activeSubscriptions.reduce((sum, s) => sum + s.amount, 0);
    const unusedSub = subscriptions.find(s => s.status === "unused");

    const handleCancelClick = (sub: Subscription) => {
        setCancelTarget(sub);
        setCancelStep("confirm");
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        if (cancelTarget) {
            setSubscriptions(subs => 
                subs.map(s => s.name === cancelTarget.name ? { ...s, status: "cancelled" as const } : s)
            );
            setCancelStep("success");
        }
    };

    const handleCloseModal = () => {
        setShowCancelModal(false);
        setCancelTarget(null);
        setCancelStep("confirm");
    };

    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader title="Abo-Manager" onBack={onBack} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-gray-500 text-sm font-medium">Monatliche Fixkosten</div>
                            <div className="text-3xl font-bold text-[#333333]">{monthlyTotal.toFixed(2)} €</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-[#FF6200]">{activeSubscriptions.length} Abos</div>
                            <div className="text-xs text-gray-400">aktiv</div>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                            className="bg-[#FF6200] h-full rounded-full" 
                            initial={{ width: "100%" }}
                            animate={{ width: `${(activeSubscriptions.length / INITIAL_SUBSCRIPTIONS.length) * 100}%` }}
                        />
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                        {activeSubscriptions.length < INITIAL_SUBSCRIPTIONS.length 
                            ? `${((1 - activeSubscriptions.length / INITIAL_SUBSCRIPTIONS.length) * 100).toFixed(0)}% weniger als ursprünglich`
                            : "Alle Abos aktiv"
                        }
                    </div>
                </div>

                {/* AI Alert - only show if there's an unused subscription */}
                {unusedSub && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3"
                    >
                        <AlertCircle className="text-red-500 shrink-0" size={24} />
                        <div>
                            <div className="font-bold text-red-700 text-sm mb-1">Ungenutztes Abo erkannt</div>
                            <p className="text-xs text-red-600 leading-relaxed mb-2">
                                Du warst seit 3 Monaten nicht mehr im {unusedSub.name}. Möchtest du das Abo kündigen und {unusedSub.amount.toFixed(2)}€ sparen?
                            </p>
                            <button 
                                onClick={() => handleCancelClick(unusedSub)}
                                className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-red-100 hover:bg-red-50 transition-colors"
                            >
                                Jetzt kündigen
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Subscription List */}
                <div className="space-y-3">
                    <div className="font-bold text-[#333333] px-2">Deine Abos</div>
                    <AnimatePresence>
                        {subscriptions.map((sub, index) => (
                            <motion.button 
                                key={sub.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: sub.status === "cancelled" ? 0.5 : 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                onClick={() => setSelectedSub(sub)}
                                className={`bg-white p-4 rounded-xl shadow-sm flex items-center justify-between w-full text-left hover:bg-gray-50 transition-colors ${
                                    sub.status === "cancelled" ? "opacity-50" : ""
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                        sub.status === "cancelled" 
                                            ? "bg-gray-200 text-gray-400"
                                            : "bg-gray-100 text-gray-600"
                                    }`}>
                                        {sub.logo}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${
                                            sub.status === "cancelled" ? "text-gray-400 line-through" : "text-[#333333]"
                                        }`}>
                                            {sub.name}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {sub.status === "cancelled" 
                                                ? "Gekündigt" 
                                                : `Nächste Abbuchung: ${sub.date}`
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className={`font-bold ${
                                            sub.status === "cancelled" ? "text-gray-400 line-through" : "text-[#333333]"
                                        }`}>
                                            {sub.amount.toFixed(2)} €
                                        </div>
                                        {sub.status === "unused" && (
                                            <div className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md inline-block mt-1">
                                                Ungenutzt
                                            </div>
                                        )}
                                        {sub.status === "cancelled" && (
                                            <div className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md inline-block mt-1">
                                                Gespart!
                                            </div>
                                        )}
                                    </div>
                                    {sub.status !== "cancelled" && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleCancelClick(sub); }}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            aria-label={`${sub.name} kündigen`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Subscription Detail Modal */}
            <AnimatePresence>
                {selectedSub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setSelectedSub(null)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white rounded-t-3xl p-6 pb-10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#333333]">Abo Details</h2>
                                <button
                                    onClick={() => setSelectedSub(null)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                    aria-label="Schließen"
                                >
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                                    selectedSub.status === "cancelled" 
                                        ? "bg-gray-200 text-gray-400"
                                        : "bg-gray-100 text-gray-600"
                                }`}>
                                    {selectedSub.logo}
                                </div>
                                <div>
                                    <div className={`font-bold text-xl ${
                                        selectedSub.status === "cancelled" ? "text-gray-400 line-through" : "text-[#333333]"
                                    }`}>
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

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Monatliche Kosten</span>
                                    <span className="font-bold text-[#333333]">{selectedSub.amount.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Jährliche Kosten</span>
                                    <span className="font-bold text-[#333333]">{(selectedSub.amount * 12).toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Nächste Abbuchung</span>
                                    <span className="font-bold text-[#333333]">{selectedSub.date}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Abbuchung von</span>
                                    <span className="font-bold text-[#333333]">Girokonto</span>
                                </div>
                            </div>

                            {selectedSub.status !== "cancelled" ? (
                                <button
                                    onClick={() => { setSelectedSub(null); handleCancelClick(selectedSub); }}
                                    className="w-full bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-colors"
                                >
                                    Abo kündigen
                                </button>
                            ) : (
                                <button
                                    onClick={() => setSelectedSub(null)}
                                    className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-bold"
                                >
                                    Schließen
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {showCancelModal && cancelTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-50 flex items-end"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white rounded-t-3xl p-6 pb-10"
                        >
                            {cancelStep === "confirm" && (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-[#333333]">Abo kündigen</h2>
                                        <button
                                            onClick={handleCloseModal}
                                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                            aria-label="Schließen"
                                        >
                                            <X size={18} className="text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-lg text-gray-600 shadow-sm">
                                                {cancelTarget.logo}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#333333]">{cancelTarget.name}</div>
                                                <div className="text-sm text-red-600">{cancelTarget.amount.toFixed(2)} € / Monat</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
                                        <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                                            <CheckCircle2 size={18} />
                                            <span>Du sparst jährlich</span>
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {(cancelTarget.amount * 12).toFixed(2)} €
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 mb-6">
                                        Möchtest du {cancelTarget.name} wirklich kündigen? Diese Aktion kann nicht rückgängig gemacht werden.
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleCloseModal}
                                            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            Abbrechen
                                        </button>
                                        <button
                                            onClick={handleConfirmCancel}
                                            className="flex-1 bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-colors"
                                        >
                                            Abo kündigen
                                        </button>
                                    </div>
                                </>
                            )}

                            {cancelStep === "success" && (
                                <div className="text-center py-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring" }}
                                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <Check size={40} className="text-green-600" />
                                    </motion.div>

                                    <h2 className="text-2xl font-bold text-[#333333] mb-2">Erfolgreich gekündigt!</h2>
                                    <p className="text-gray-500 mb-6">
                                        Du sparst ab sofort {cancelTarget.amount.toFixed(2)} € pro Monat.
                                    </p>

                                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
                                        <div className="text-sm text-green-600 mb-1">Jährliche Ersparnis</div>
                                        <div className="text-3xl font-bold text-green-600">
                                            {(cancelTarget.amount * 12).toFixed(2)} €
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCloseModal}
                                        className="w-full bg-[#FF6200] text-white py-4 rounded-xl font-bold hover:bg-[#e55800] transition-colors"
                                    >
                                        Fertig
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
