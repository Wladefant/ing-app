import { INGButton } from "../layout";
import lionIcon from "@assets/generated_images/minimalist_orange_app_icon_with_white_lion.png";
import welcomeIllustration from "@assets/generated_images/minimalist_illustration_of_woman_relaxing_on_beanbag_with_tablet.png";
import { MoreHorizontal } from "lucide-react";

export function WelcomeScreen({ onLogin, onStartSetup }: { onLogin: () => void; onStartSetup: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-8" /> {/* Spacer */}
        <div className="flex items-center gap-2">
          <span className="text-[#33307E] font-bold text-2xl tracking-tight">ING</span>
          <div className="w-8 h-8 bg-[#FF6200] rounded-lg flex items-center justify-center">
             <img src={lionIcon} alt="ING Lion" className="w-6 h-6 object-contain brightness-0 invert" />
          </div>
        </div>
        <button className="text-[#FF6200]">
           <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Illustration */}
      <div className="flex justify-center mb-8">
        <img 
          src={welcomeIllustration} 
          alt="Welcome Illustration" 
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Content */}
      <div className="mb-auto">
        <h1 className="text-lg font-bold text-[#333333] mb-4">Willkommen</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Machen Sie Ihr Banking bequem von unterwegs oder entspannt vom Sofa aus. Legen Sie gleich los.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-8">
        <INGButton variant="primary" onClick={onLogin}>
          Ich bin Kunde
        </INGButton>
        <INGButton variant="primary" onClick={onStartSetup} className="bg-[#33307E] hover:bg-[#282668]">
          Ich bin Kunde (NEU)
        </INGButton>
        <INGButton variant="primary" className="bg-white text-[#FF6200] border-2 border-[#FF6200] hover:bg-orange-50 shadow-none">
          Girokonto eröffnen
        </INGButton>
      </div>
    </div>
  );
}
