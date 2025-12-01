import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, Clock, TrendingUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchStocks, getPopularStocks, formatStockPrice, type Stock } from "@/lib/stock-data";
import { cn } from "@/lib/utils";

interface StockSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectStock: (symbol: string) => void;
  trigger?: React.ReactNode;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function StockSearchModal({
  open,
  onOpenChange,
  onSelectStock,
  trigger,
}: StockSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Stock[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounced search query
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentStockSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);
  
  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!open) {
      setSearchQuery("");
      setResults([]);
    }
  }, [open]);
  
  // Search effect
  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      setIsSearching(true);
      // Simulate slight delay for smoother UX
      const timer = setTimeout(() => {
        const searchResults = searchStocks(debouncedQuery);
        setResults(searchResults);
        setIsSearching(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery]);
  
  // Save to recent searches
  const addToRecentSearches = useCallback((symbol: string) => {
    setRecentSearches(prev => {
      const updated = [symbol, ...prev.filter(s => s !== symbol)].slice(0, 5);
      localStorage.setItem("recentStockSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  // Handle stock selection
  const handleSelectStock = (stock: Stock) => {
    addToRecentSearches(stock.symbol);
    onSelectStock(stock.symbol);
    onOpenChange(false);
  };
  
  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentStockSearches");
  };
  
  // Handle search suggestion click
  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
  };
  
  const popularStocks = getPopularStocks();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className="w-[calc(100%-32px)] max-w-[340px] p-0 gap-0 bg-white rounded-2xl overflow-hidden max-h-[65vh] mx-auto"
        hideCloseButton
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Aktie suchen</DialogTitle>
          <DialogDescription>Suche nach Aktien, ETFs oder Fonds</DialogDescription>
        </DialogHeader>
        {/* Header with Search */}
        <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-full shrink-0"
              aria-label="Schließen"
            >
              <X size={20} className="text-gray-500" />
            </button>
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6200]" />
              <Input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Aktie, ETF oder Fonds suchen..."
                className="pl-10 pr-10 py-3 bg-gray-100 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-[#FF6200]/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                  aria-label="Suche löschen"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[55vh]">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6200] to-[#FF8533] flex items-center justify-center mb-3">
                  <Loader2 size={24} className="text-white animate-spin" />
                </div>
                <p className="text-sm text-gray-500">Suche...</p>
              </motion.div>
            )}
            
            {/* Search Results */}
            {!isSearching && debouncedQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="results"
                className="p-4"
              >
                {results.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Search size={28} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Keine Ergebnisse für "{debouncedQuery}"</p>
                    <p className="text-sm text-gray-400 mt-1">Versuche einen anderen Suchbegriff</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium mb-3">
                      {results.length} Ergebnis{results.length !== 1 ? "se" : ""} gefunden
                    </p>
                    {results.map((stock, index) => (
                      <motion.button
                        key={stock.symbol}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectStock(stock)}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-[#33307E] border border-gray-200 group-hover:border-[#FF6200] transition-colors text-base">
                            {stock.symbol.substring(0, 2)}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-[#333333]">{stock.symbol}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{stock.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#333333]">
                            {formatStockPrice(stock.price, stock.currency)}
                          </div>
                          <div className={cn(
                            "text-xs font-bold",
                            stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Default State - Recent & Popular */}
            {!isSearching && debouncedQuery.trim().length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="default"
              >
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-500">Letzte Suchen</span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-[#FF6200] font-bold hover:underline"
                      >
                        Löschen
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((symbol) => (
                        <button
                          key={symbol}
                          onClick={() => handleSuggestionClick(symbol)}
                          className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-[#333333] font-medium">{symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Popular Suggestions */}
                <div className="p-4">
                  <span className="text-sm font-bold text-gray-500 block mb-3">Beliebte Aktien</span>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Apple", "Tesla", "Microsoft", "NVIDIA", "Amazon", "SAP"].map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-[#333333] font-medium transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  
                  {/* Top Movers */}
                  <span className="text-sm font-bold text-gray-500 block mb-3">Top Performer</span>
                  <div className="space-y-2">
                    {popularStocks.slice(0, 4).map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => handleSelectStock(stock)}
                        className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            stock.changePercent >= 0 ? "bg-green-100" : "bg-red-100"
                          )}>
                            <TrendingUp size={18} className={cn(
                              stock.changePercent >= 0 ? "text-green-600" : "text-red-600 rotate-180"
                            )} />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-sm text-[#333333]">{stock.symbol}</div>
                            <div className="text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "text-sm font-bold",
                          stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
