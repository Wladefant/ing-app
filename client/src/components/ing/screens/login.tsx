import { useState } from "react";
import { INGButton, ScreenHeader } from "../layout";
import lionIcon from "@assets/generated_images/minimalist_orange_app_icon_with_white_lion.png";
import { Delete, MoreVertical, MapPin, CreditCard, MessageSquare, Camera, Lightbulb, BarChart2, Scale, Info, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState<string>("");
  const [showMenu, setShowMenu] = useState(false);

  const handleNumberClick = (num: number) => {
    if (pin.length < 5) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 5) {
        setTimeout(onSuccess, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      {/* Overlay Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <div className="absolute inset-0 bg-black/50 z-40" onClick={() => setShowMenu(false)} />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 bg-[#F3F3F3] z-50 rounded-t-2xl overflow-hidden max-h-[80%] flex flex-col"
            >
               <div className="bg-white p-6 flex flex-col items-center border-b border-gray-100">
                  <div className="w-12 h-12 bg-[#FF6200] rounded-lg flex items-center justify-center mb-4">
                     <img src={lionIcon} alt="ING Lion" className="w-8 h-8 object-contain brightness-0 invert" />
                  </div>
               </div>
               
               <div className="overflow-y-auto bg-white pb-8">
                  <MenuItem icon={<MapPin size={20} className="text-[#FF6200]" />} label="Geldautomatensuche" />
                  <MenuItem icon={<CreditCard size={20} className="text-[#FF6200]" />} label="Kartensperre" />
                  <MenuItem icon={<MessageSquare size={20} className="text-[#FF6200]" />} label="Virtueller Assistent" />
                  <MenuItem icon={<Camera size={20} className="text-[#FF6200]" />} label="Screenshots" />
                  <MenuItem icon={<Lightbulb size={20} className="text-[#FF6200]" />} label="Erscheinungsbild" />
                  <MenuItem icon={<BarChart2 size={20} className="text-[#FF6200]" />} label="Analyse" />
                  <MenuItem icon={<Info size={20} className="text-[#FF6200]" />} label="Rechtliches" sub="Impressum, Datenschutz, AGB, Lizenzen" />
                  
                  <div className="bg-[#F3F3F3] p-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
                     <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center">🦁</div>
                     App-Version 8.24.1
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0">
        <div className="text-sm font-medium text-gray-700">Anmelden</div>
        <button onClick={() => setShowMenu(true)} className="text-[#FF6200]">
          <MoreVertical size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center pt-6 px-6">
        <div className="w-16 h-16 bg-[#FF6200] rounded-xl flex items-center justify-center mb-8 shadow-sm">
           <img src={lionIcon} alt="ING Lion" className="w-12 h-12 object-contain brightness-0 invert" />
        </div>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full border-2 border-[#FF6200] transition-colors ${
                i < pin.length ? "bg-[#FF6200]" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-y-6 gap-x-8 max-w-[300px] mx-auto w-full mb-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="flex flex-col items-center justify-center h-14 active:bg-gray-50 rounded-full transition-colors"
            >
              <span className="text-3xl font-light text-[#FF6200]">{num}</span>
              <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">
                {["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"][num - 1]}
              </span>
            </button>
          ))}
          <div /> {/* Empty slot */}
          <button
            onClick={() => handleNumberClick(0)}
            className="flex flex-col items-center justify-center h-14 active:bg-gray-50 rounded-full transition-colors"
          >
            <span className="text-3xl font-light text-[#FF6200]">0</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center h-14 active:bg-gray-50 rounded-full transition-colors text-[#FF6200]"
          >
            <Delete size={28} strokeWidth={1.5} className="rotate-180 border border-[#FF6200] rounded p-0.5" />
          </button>
        </div>

        <button className="text-[#33307E] font-bold text-sm mb-8 hover:underline">
          mobilePIN vergessen?
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer">
       <div className="shrink-0 w-6">{icon}</div>
       <div className="flex flex-col">
         <span className="text-[#333333] font-medium text-sm">{label}</span>
         {sub && <span className="text-gray-500 text-xs mt-0.5">{sub}</span>}
       </div>
    </div>
  );
}
