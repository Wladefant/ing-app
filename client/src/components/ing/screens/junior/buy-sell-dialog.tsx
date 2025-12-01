import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, Check, AlertTriangle, X, TrendingUp, TrendingDown, Wallet, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buyJuniorStock,
  sellJuniorStock,
  getJuniorPortfolio,
  addXP,
  type JuniorPortfolio
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import lionIcon from "@/assets/lion-logo.png";

interface BuySellDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "buy" | "sell";
  stock: {
    symbol: string;
    name: string;
    price: number;
    logo: string;
    color: string;
  };
  onSuccess?: () => void;
}

export function BuySellDialog({ isOpen, onClose, mode, stock, onSuccess }: BuySellDialogProps) {
  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [quantity, setQuantity] = useState<number>(1);
  const [portfolio, setPortfolio] = useState<JuniorPortfolio | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const data = getJuniorPortfolio();
      setPortfolio(data);
      setStep("input");
      setQuantity(1);
    }
  }, [isOpen, stock.price]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    // Limit based on balance for buy, or holdings for sell
    if (mode === "buy") {
      const maxAffordable = Math.floor((portfolio?.cashBalance || 0) / stock.price);
      setQuantity(Math.min(newQuantity, Math.max(1, maxAffordable)));
    } else {
      const maxSellable = currentHolding?.shares || 0;
      setQuantity(Math.min(newQuantity, maxSellable));
    }
  };

  const totalCost = quantity * stock.price;
  const currentHolding = portfolio?.holdings.find(h => h.symbol === stock.symbol);
  const maxSellable = currentHolding?.shares || 0;

  // Calculate profit/loss for selling
  const profitLoss = mode === "sell" && currentHolding
    ? (stock.price - currentHolding.buyPrice) * quantity
    : 0;
  const profitLossPercent = mode === "sell" && currentHolding && currentHolding.buyPrice > 0
    ? ((stock.price - currentHolding.buyPrice) / currentHolding.buyPrice) * 100
    : 0;

  // Validation
  const canBuy = portfolio ? portfolio.cashBalance >= totalCost : false;
  const canSell = maxSellable >= quantity;
  const isValid = mode === "buy" ? canBuy : canSell;

  const handleExecute = () => {
    if (mode === "buy") {
      const result = buyJuniorStock(stock.symbol, stock.name, stock.logo, quantity, stock.price);
      if (result.success) {
        // Award XP - first trade gets more
        const isFirstTrade = (portfolio?.trades.length || 0) === 0;
        const xpAmount = isFirstTrade ? 100 : 20;
        addXP(xpAmount);
        setStep("success");
        if (onSuccess) onSuccess();
      } else {
        toast({ title: "Fehler", description: result.error, variant: "destructive" });
      }
    } else {
      const result = sellJuniorStock(stock.symbol, quantity, stock.price);
      if (result.success) {
        setStep("success");
        if (onSuccess) onSuccess();
      } else {
        toast({ title: "Fehler", description: result.error, variant: "destructive" });
      }
    }
  };

  if (!isOpen || !portfolio) return null;

  // Find the mobile container to render within phone frame
  const container = typeof document !== 'undefined' ? document.getElementById('mobile-container') : null;
  
  // Render into the mobile container if available
  const dialogContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 z-50 flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-white rounded-t-3xl overflow-hidden max-h-[85vh]"
        >
          {/* Input Step */}
          {step === "input" && (
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#333333]">
                  {mode === "buy" ? "Aktie kaufen" : "Aktie verkaufen"}
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                  aria-label="Schließen"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Stock Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gray-100">
                    {stock.logo}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-[#333333]">{stock.name}</div>
                    <div className="text-sm text-gray-500">{stock.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-[#333333]">€{stock.price.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">pro Aktie</div>
                  </div>
                </div>

                {/* Balance/Holdings Info */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <Wallet size={20} className="text-blue-500" />
                  <div className="flex-1">
                    <span className="text-sm text-blue-600">
                      {mode === "buy" ? "Verfügbares Spielgeld" : `Du besitzt ${maxSellable} Aktien`}
                    </span>
                  </div>
                  <span className="font-bold text-blue-700">
                    {mode === "buy" ? `€${portfolio.cashBalance.toFixed(2)}` : ""}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="text-center">
                  <label className="text-sm text-gray-500 block mb-4">Anzahl Aktien</label>
                  <div className="flex items-center justify-center gap-8">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 transition-colors"
                      title="Weniger"
                    >
                      <Minus size={24} className="text-gray-600" />
                    </button>
                    <div className="w-24">
                      <div className="text-5xl font-black text-[#333333]">{quantity}</div>
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      title="Mehr"
                    >
                      <Plus size={24} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                  <div className="p-4 flex justify-between">
                    <span className="text-gray-500">Kurs pro Aktie</span>
                    <span className="font-bold text-[#333333]">€{stock.price.toFixed(2)}</span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="text-gray-500">Anzahl</span>
                    <span className="font-bold text-[#333333]">× {quantity}</span>
                  </div>
                  {mode === "sell" && profitLoss !== 0 && (
                    <div className="p-4 flex justify-between">
                      <span className="text-gray-500">Gewinn/Verlust</span>
                      <span className={`font-bold flex items-center gap-1 ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {profitLoss >= 0 ? '+' : ''}€{profitLoss.toFixed(2)} ({profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(1)}%)
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex justify-between bg-gray-50">
                    <span className="font-bold text-[#333333]">Gesamt</span>
                    <span className="font-bold text-2xl text-[#333333]">€{totalCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Leo Tip */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
                  <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
                    <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="font-bold text-orange-700 text-sm mb-1">Leo erklärt:</div>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      {mode === "buy"
                        ? `Mit ${quantity} Aktie${quantity > 1 ? 'n' : ''} von ${stock.name} investierst du €${totalCost.toFixed(2)} von deinem Spielgeld. Danach hast du noch €${(portfolio.cashBalance - totalCost).toFixed(2)} übrig.`
                        : `Wenn du ${quantity} Aktie${quantity > 1 ? 'n' : ''} verkaufst, erhältst du €${totalCost.toFixed(2)} zurück auf dein Spielgeld-Konto.`
                      }
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {!isValid && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertTriangle size={16} />
                    <span>
                      {mode === "buy" ? "Nicht genügend Spielgeld" : "Nicht genügend Aktien"}
                    </span>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={() => setStep("confirm")}
                  disabled={!isValid || quantity < 1}
                  className={`w-full py-4 text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors ${mode === "buy"
                    ? "bg-[#FF6200] hover:bg-[#e55800] text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Weiter
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Confirm Step */}
          {step === "confirm" && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#333333]">Bestätigen</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                  aria-label="Schließen"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Summary */}
                <div className="text-center py-4">
                  <span className="text-5xl mb-4 block">{stock.logo}</span>
                  <div className="text-gray-500 mb-1">Du {mode === "buy" ? "kaufst" : "verkaufst"}</div>
                  <div className="text-3xl font-black text-[#333333] mb-2">
                    {quantity}× {stock.symbol}
                  </div>
                  <div className={`text-2xl font-bold ${mode === "buy" ? 'text-[#FF6200]' : 'text-red-500'}`}>
                    für €{totalCost.toFixed(2)}
                  </div>
                </div>

                {/* Details Card */}
                <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Kurs pro Aktie</span>
                    <span className="font-bold">€{stock.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gebühren</span>
                    <span className="font-bold text-green-600">Kostenlos</span>
                  </div>
                  {mode === "buy" && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="text-gray-500">Neuer Kontostand</span>
                      <span className="font-bold">€{(portfolio.cashBalance - totalCost).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("input")}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold"
                  >
                    Zurück
                  </button>
                  <button
                    onClick={handleExecute}
                    className={`flex-1 py-4 rounded-xl font-bold text-white ${mode === "buy"
                      ? "bg-[#FF6200] hover:bg-[#e55800]"
                      : "bg-red-500 hover:bg-red-600"
                      }`}
                  >
                    {mode === "buy" ? "Jetzt kaufen" : "Jetzt verkaufen"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="flex flex-col">
              <div className="p-6 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${mode === "buy" ? "bg-green-100" : "bg-red-100"
                    }`}
                >
                  <Check size={48} className={mode === "buy" ? "text-green-600" : "text-red-600"} />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-black text-[#333333] mb-2">
                    {mode === "buy" ? "Gekauft! 🎉" : "Verkauft!"}
                  </h2>
                  <p className="text-gray-500">
                    Du hast {quantity} Aktie{quantity > 1 ? 'n' : ''} von {stock.name} {mode === "buy" ? "gekauft" : "verkauft"}.
                  </p>
                </div>

                {mode === "buy" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-purple-50 p-4 rounded-xl border border-purple-100"
                  >
                    <div className="text-sm font-bold text-purple-600 mb-1">🌟 XP erhalten!</div>
                    <p className="text-xs text-purple-500">+{(portfolio?.trades.length || 0) === 0 ? 100 : 20} XP für deinen Trade</p>
                  </motion.div>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-4 bg-[#FF6200] text-white rounded-xl font-bold text-lg"
                >
                  Fertig
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // If container found, use portal to render inside phone frame
  if (container) {
    return createPortal(dialogContent, container);
  }
  
  return dialogContent;
}
