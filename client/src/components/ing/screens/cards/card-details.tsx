import { ScreenHeader } from "../../layout";
import { ChevronRight, ArrowRightLeft, CreditCard, Banknote } from "lucide-react";
import { useState } from "react";
import orangeCard from "@assets/generated_images/orange_debit_card_icon.png";
import visaCard from "@assets/generated_images/visa_debit_card_icon.png";
import { INGButton } from "../../layout";

export function CardDetailsScreen({ cardType, onBack }: { cardType: "giro" | "visa"; onBack: () => void }) {
  const [view, setView] = useState<"overview" | "limits">("overview");

  if (view === "limits") {
    return <CardLimitsScreen cardType={cardType} onBack={() => setView("overview")} />;
  }

  // For now, clicking the card row in the main list goes straight to limits in the screenshots provided,
  // or allows drilling down. The screenshots show "Karten" list view, then clicking "Kartenlimits" goes to limits.
  // But clicking the card itself might go to details.
  // Based on screenshots, we have a "Karten" screen which lists cards with actions inside them.
  // So CardDetailsScreen might actually be redundant if everything is in the list.
  // But let's assume "Kartenlimits" click leads to limits screen.
  
  // Wait, the CardsListScreen I built ALREADY HAS the "Kartenlimits" row.
  // So clicking THAT row should trigger the limits screen.
  // I will refactor CardsListScreen to accept onSelectLimit.
  
  return null; // Should not be reached if logic is moved
}

export function CardLimitsScreen({ cardType, onBack }: { cardType: "giro" | "visa"; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#FF6200]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[#333333]">Kartenlimits</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
         {/* Header Card Info */}
         <div className="bg-white rounded-lg p-4 flex items-center gap-4 mb-6 shadow-sm">
             <img src={cardType === "giro" ? orangeCard : visaCard} className="w-16 h-auto rounded shadow-sm" />
             <div>
                 <div className="font-bold text-[#333333]">{cardType === "giro" ? "girocard" : "VISA Card"}</div>
                 <div className="text-xs text-gray-500">Maxi Mustermensch</div>
                 <div className="text-xs text-gray-400">
                   {cardType === "giro" ? "DE10 1234 5678 1234 5678 90 (12/28)" : "**** 1000 (12/27)"}
                 </div>
             </div>
         </div>

         {/* Tageslimit */}
         <div className="mb-8">
            <div className="font-bold text-sm text-[#333333] mb-2">Tageslimit</div>
            <div className="text-xs text-gray-500 mb-4">Verfügbar 1.000,00 EUR von 1.000,00 EUR</div>

            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
               <Banknote className="text-[#FF6200]" size={20} />
               <span>Bargeldabhebungen</span>
            </div>
            
            <button className="w-full py-3 border border-[#33307E] rounded text-[#33307E] font-bold text-sm hover:bg-blue-50">
               Tageslimit anpassen
            </button>
         </div>

         {/* Wochenlimit */}
         <div>
            <div className="font-bold text-sm text-[#333333] mb-2">Wochenlimit</div>
            <div className="text-xs text-gray-500 mb-4">Verfügbar 4.000,00 EUR von 4.000,00 EUR</div>

            <div className="space-y-3 mb-4">
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Banknote className="text-[#FF6200]" size={20} />
                  <span>Bargeldabhebungen</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CreditCard className="text-[#FF6200]" size={20} />
                  <span>Kartenzahlungen</span>
               </div>
            </div>
            
            <button className="w-full py-3 border border-[#33307E] rounded text-[#33307E] font-bold text-sm hover:bg-blue-50">
               Wochenlimit anpassen
            </button>
         </div>

      </div>
    </div>
  );
}
