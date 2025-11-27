import { INGButton } from "../../layout";
import { ScreenHeader } from "../../layout";
import { X, Info } from "lucide-react";
import { useState } from "react";

export function SetupPinScreen({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) {
  const [pin, setPin] = useState<string>("");

  const handleNumberClick = (num: number) => {
    if (pin.length < 5) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Custom Header for Setup */}
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <button onClick={onCancel} className="text-gray-500 text-sm font-medium">
          Abbrechen
        </button>
        <h1 className="text-sm font-bold text-[#333333]">App einrichten</h1>
        <div className="w-16" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8">
        {/* Orange Dots Icon */}
        <div className="flex flex-col items-center mb-8">
           <div className="grid grid-cols-3 gap-1.5 mb-1">
              <div className="w-3 h-3 rounded-full border-2 border-[#FF6200]" />
              <div className="w-3 h-3 rounded-full border-2 border-[#FF6200]" />
              <div className="w-3 h-3 rounded-full border-2 border-[#FF6200]" />
           </div>
           <div className="grid grid-cols-3 gap-1.5">
              <div className="w-3 h-3 rounded-full border-2 border-[#FF6200]" />
              <div className="w-3 h-3 rounded-full border-2 border-[#FF6200]" />
              <div className="w-3 h-3 rounded-full border-2 border-[#FF6200]" />
           </div>
           <div className="w-3 h-3 rounded-full border-2 border-[#FF6200] mt-1.5" />
        </div>

        <h2 className="text-center font-bold text-[#333333] mb-4">
          Wählen Sie Ihre 5-stellige mobilePIN
        </h2>
        
        <p className="text-center text-gray-500 text-xs mb-6 px-4">
          Merken Sie sich diese gut. Sie brauchen die mobilePIN für den Log-in und zur Freigabe von Aufträgen, z.B. Überweisungen oder Online-Zahlungen.
        </p>

        <div className="border border-[#33307E] rounded-md p-3 flex gap-3 items-start mb-auto">
           <div className="bg-[#33307E] text-white w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 text-xs font-serif font-bold">i</div>
           <p className="text-gray-600 text-xs leading-relaxed">
             Zahlenfolgen wie "12345" oder "11111" sind nicht erlaubt. Außerdem raten wir von Geburtstagen ab, weil sie leicht zu erraten sind.
           </p>
        </div>

        <div className="mb-6">
           <INGButton variant="primary" onClick={onNext} disabled={false} className="bg-[#FF6200]/50">
             mobilePIN festlegen
           </INGButton>
        </div>
      </div>
    </div>
  );
}

export function PinEntryScreen({ title, onNext, onCancel }: { title: string; onNext: () => void; onCancel: () => void }) {
  const [pin, setPin] = useState<string>("");

  const handleNumberClick = (num: number) => {
    if (pin.length < 5) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 5) {
        setTimeout(onNext, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0">
        <button onClick={onCancel} className="text-gray-500 text-sm font-medium">
          Abbrechen
        </button>
        <h1 className="text-sm font-bold text-[#333333]">mobilePIN</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center pt-12">
         <h2 className="text-sm font-bold text-[#333333] mb-12">
           {title}
         </h2>

         {/* Dots */}
         <div className="flex gap-4 mb-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full border-2 border-[#FF6200] transition-colors ${
                i < pin.length ? "bg-[#FF6200]" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Keypad - Simplified style for setup */}
        <div className="w-full pb-8 px-6">
          <div className="grid grid-cols-3 gap-y-4 gap-x-8 max-w-[300px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="flex flex-col items-center justify-center h-14 active:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-3xl font-light text-[#FF6200]">{num}</span>
                <span className="text-[8px] font-bold text-gray-300 tracking-widest uppercase">
                  {["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"][num - 1]}
                </span>
              </button>
            ))}
            <div />
            <button
              onClick={() => handleNumberClick(0)}
              className="flex flex-col items-center justify-center h-14 active:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-3xl font-light text-[#FF6200]">0</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center h-14 active:bg-gray-100 rounded-full transition-colors text-[#FF6200]"
            >
              <X size={24} strokeWidth={1.5} className="rotate-[-90deg] border border-[#FF6200] rounded p-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
