import { INGButton } from "../layout";
import lionIcon from "@assets/generated_images/minimalist_orange_app_icon_with_white_lion.png";

export function WelcomeScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-[#FF6200] text-white relative overflow-hidden">
      {/* Background texture/gradient subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="mt-20 flex flex-col items-center z-10">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-8">
           {/* Use the generated asset but styled as an icon */}
           <img src={lionIcon} alt="ING Lion" className="w-20 h-20 object-contain" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Willkommen</h1>
        <p className="text-white/80 text-center max-w-[200px]">
          Banking, das einfach einfach ist.
        </p>
      </div>

      <div className="w-full space-y-4 mb-8 z-10">
        <INGButton variant="outline" onClick={onLogin} className="bg-white text-[#FF6200] hover:bg-white/90 border-none">
          Ich bin Kunde
        </INGButton>
        <INGButton variant="outline">
          Girokonto eröffnen
        </INGButton>
      </div>
    </div>
  );
}
