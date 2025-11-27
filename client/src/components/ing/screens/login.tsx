import { useState } from "react";
import { INGButton, ScreenHeader } from "../layout";
import lionIcon from "@assets/generated_images/minimalist_orange_app_icon_with_white_lion.png";
import { Delete } from "lucide-react";

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState<string>("");

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
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center pt-10 px-6">
        <div className="w-16 h-16 bg-[#FF6200] rounded-xl flex items-center justify-center mb-8 shadow-sm">
           <img src={lionIcon} alt="ING Lion" className="w-12 h-12 object-contain brightness-0 invert" />
        </div>

        <h2 className="text-xl font-bold text-[#333333] mb-8">Anmelden</h2>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full border-2 border-gray-300 transition-colors ${
                i < pin.length ? "bg-[#FF6200] border-[#FF6200]" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        <button className="text-[#33307E] font-medium text-sm mb-auto hover:underline">
          mobilePIN vergessen?
        </button>
      </div>

      {/* Keypad */}
      <div className="bg-[#F3F3F3] pb-8 pt-4 px-6 rounded-t-3xl shadow-inner">
        <div className="grid grid-cols-3 gap-y-6 gap-x-8 max-w-[300px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="flex flex-col items-center justify-center h-16 active:bg-gray-200 rounded-full transition-colors"
            >
              <span className="text-3xl font-light text-[#333333]">{num}</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                {["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"][num - 1]}
              </span>
            </button>
          ))}
          <div /> {/* Empty slot */}
          <button
            onClick={() => handleNumberClick(0)}
            className="flex flex-col items-center justify-center h-16 active:bg-gray-200 rounded-full transition-colors"
          >
            <span className="text-3xl font-light text-[#333333]">0</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center h-16 active:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <Delete size={28} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
