import { ScreenHeader } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { AlertCircle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const SUBSCRIPTIONS = [
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
    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader title="Abo-Manager" onBack={onBack} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-gray-500 text-sm font-medium">Monatliche Fixkosten</div>
                            <div className="text-3xl font-bold text-[#333333]">61,87 €</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-[#FF6200]">4 Abos</div>
                            <div className="text-xs text-gray-400">aktiv</div>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#FF6200] w-3/4 h-full rounded-full" />
                    </div>
                    <div className="mt-2 text-xs text-gray-400">3% weniger als letzten Monat</div>
                </div>

                {/* AI Alert */}
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3">
                    <AlertCircle className="text-red-500 shrink-0" size={24} />
                    <div>
                        <div className="font-bold text-red-700 text-sm mb-1">Ungenutztes Abo erkannt</div>
                        <p className="text-xs text-red-600 leading-relaxed mb-2">
                            Du warst seit 3 Monaten nicht mehr im Fitness Studio. Möchtest du das Abo kündigen und 29,90€ sparen?
                        </p>
                        <button className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-red-100">
                            Jetzt kündigen
                        </button>
                    </div>
                </div>

                {/* Subscription List */}
                <div className="space-y-3">
                    <div className="font-bold text-[#333333] px-2">Deine Abos</div>
                    {SUBSCRIPTIONS.map((sub, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                    {sub.logo}
                                </div>
                                <div>
                                    <div className="font-bold text-[#333333] text-sm">{sub.name}</div>
                                    <div className="text-xs text-gray-400">Nächste Abbuchung: {sub.date}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-[#333333]">{sub.amount} €</div>
                                {sub.status === "unused" && (
                                    <div className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md inline-block mt-1">
                                        Ungenutzt
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
