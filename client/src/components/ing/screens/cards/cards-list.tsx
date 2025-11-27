import { ScreenHeader } from "../../layout";
import { ChevronRight, Plus, ArrowRightLeft, Zap } from "lucide-react";
import { useState } from "react";
import { CardLimitsScreen } from "./card-details";
import orangeCard from "@assets/generated_images/orange_debit_card_icon.png";
import visaCard from "@assets/generated_images/visa_debit_card_icon.png";

export function CardsListScreen({ onBack }: { onBack: () => void }) {
  const [selectedLimitCard, setSelectedLimitCard] = useState<"giro" | "visa" | null>(null);

  if (selectedLimitCard) {
    return <CardLimitsScreen cardType={selectedLimitCard} onBack={() => setSelectedLimitCard(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header with + girocard action */}
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Karten</h1>
        </div>
        <button className="text-[#FF6200] text-sm font-medium flex items-center gap-1">
          <Plus size={16} /> girocard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {/* Girocard */}
         <div className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform">
             <div className="p-6 bg-white flex flex-col items-center border-b border-gray-50">
                 <img src={orangeCard} alt="girocard" className="w-48 h-auto rounded-lg shadow-md mb-6" />
                 
                 {/* Pagination Dots */}
                 <div className="flex gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6200]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                 </div>

                 <div className="font-bold text-[#333333]">girocard</div>
                 <div className="text-xs text-gray-500 mb-1">Maxi Mustermensch</div>
                 <div className="text-xs text-gray-400">DE10 1234 5678 1234 5678 90 (12/28)</div>
             </div>

             <div className="px-4 py-3 bg-gray-50 text-xs font-bold text-[#333333] border-b border-gray-100">
                 Bezahlen und abheben
             </div>
             
             <div 
                onClick={() => setSelectedLimitCard("giro")}
                className="px-4 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
             >
                <div className="flex items-center gap-3">
                   <ArrowRightLeft size={20} className="text-[#FF6200]" />
                   <div>
                      <div className="text-sm font-medium text-[#333333]">Kartenlimits</div>
                      <div className="text-xs text-gray-500">Heute noch verfügbar: 1.000,00 €</div>
                   </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
             </div>

             <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                   <Zap size={20} className="text-[#FF6200]" />
                   <div className="text-sm font-medium text-[#333333]">Umsatz beanstanden</div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
             </div>
         </div>

         {/* VISA Card */}
         <div className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform">
             <div className="p-6 bg-white flex flex-col items-center border-b border-gray-50">
                 <img src={visaCard} alt="visa card" className="w-48 h-auto rounded-lg shadow-md mb-6" />
                 
                 {/* Pagination Dots */}
                 <div className="flex gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6200]" />
                 </div>

                 <div className="font-bold text-[#333333]">VISA Card</div>
                 <div className="text-xs text-gray-500 mb-1">Maxi Mustermensch</div>
                 <div className="text-xs text-gray-400">**** 1000 (12/27)</div>
             </div>

             <div className="px-4 py-3 bg-gray-50 text-xs font-bold text-[#333333] border-b border-gray-100">
                 Bezahlen und abheben
             </div>
             
             <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="w-5 h-5 rounded border border-gray-400 flex items-center justify-center text-[10px] font-bold text-gray-600">G</div>
                   <div className="text-sm font-medium text-[#333333]">Google Pay Einstellungen</div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
             </div>

             <div 
                onClick={() => setSelectedLimitCard("visa")}
                className="px-4 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
             >
                <div className="flex items-center gap-3">
                   <ArrowRightLeft size={20} className="text-[#FF6200]" />
                   <div>
                      <div className="text-sm font-medium text-[#333333]">Kartenlimits</div>
                      <div className="text-xs text-gray-500">Heute noch verfügbar: 1.000,00 €</div>
                   </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
             </div>
         </div>
      </div>
    </div>
  );
}
