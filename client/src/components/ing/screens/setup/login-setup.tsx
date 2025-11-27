import { useState } from "react";
import { INGButton } from "../../layout";
import { X } from "lucide-react";

export function LoginSetupScreen({ onLogin, onCancel }: { onLogin: () => void; onCancel: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
        <button onClick={onCancel} className="text-gray-500 text-sm font-medium">
          Abbrechen
        </button>
        <h1 className="text-sm font-bold text-[#333333]">Log-in</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-6 overflow-y-auto">
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#333333] mb-2">Zugangsnummer oder Benutzername</label>
          <p className="text-gray-500 text-xs mb-2">Die letzten 10 Stellen Ihrer IBAN/Depotnummer oder selbst vergebener Benutzername</p>
          <div className="relative">
            <input 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-[#33307E] rounded px-3 py-3 text-lg outline-none focus:ring-1 focus:ring-[#33307E]"
            />
            {username && (
              <button onClick={() => setUsername("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                   <X size={14} className="text-white" strokeWidth={3} />
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-[#333333] mb-2">Internetbanking PIN oder Passwort</label>
          <p className="text-gray-500 text-xs mb-2">5- bis 10-stellige PIN oder Passwort, das Sie selbst vergeben haben</p>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-3 text-lg outline-none focus:border-[#33307E] focus:ring-1 focus:ring-[#33307E]"
          />
        </div>

        <div className="mb-auto">
          <p className="text-gray-500 text-xs mb-2">Sie haben Ihre Zugangsdaten vergessen oder noch keine erstellt?</p>
          <button className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-[#33307E] font-medium text-sm w-full justify-center hover:bg-gray-50">
            <span className="transform rotate-45 font-bold text-lg">↗</span> Zugangsdaten neu vergeben
          </button>
        </div>

        <div className="mb-6 mt-4">
           <INGButton variant="primary" onClick={onLogin}>
             Einloggen
           </INGButton>
        </div>
      </div>
    </div>
  );
}
