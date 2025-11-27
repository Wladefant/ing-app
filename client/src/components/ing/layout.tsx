import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen w-full bg-neutral-100 flex justify-center items-center p-4 font-sans">
      <div className={cn(
        "w-full max-w-[375px] h-[812px] bg-[#F3F3F3] shadow-2xl overflow-hidden relative flex flex-col rounded-[30px] border-8 border-orange-500 ring-4 ring-gray-200", 
        className
      )}>
        {/* Status Bar Mockup */}
        <div className="h-8 bg-[#F3F3F3] flex justify-between items-center px-6 text-xs font-medium text-gray-500 shrink-0 z-50">
          <span>09:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gray-300/50" />
            <div className="w-4 h-4 rounded-full bg-gray-300/50" />
            <div className="w-6 h-3 rounded-sm bg-gray-400/50" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ScreenHeader({ title, onBack, rightAction }: { title?: string; onBack?: () => void; rightAction?: ReactNode }) {
  return (
    <div className="h-14 px-4 flex items-center justify-between bg-[#F3F3F3] shrink-0">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="text-orange-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}
        {title && <h1 className="text-lg font-bold text-[#333333]">{title}</h1>}
      </div>
      {rightAction}
    </div>
  );
}

export function INGButton({ 
  children, 
  variant = "primary", 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" }) {
  return (
    <button 
      className={cn(
        "w-full py-3.5 rounded-md font-bold text-[15px] transition-all active:scale-[0.98]",
        variant === "primary" && "bg-[#FF6200] text-white hover:bg-[#E55800] shadow-sm",
        variant === "secondary" && "bg-[#33307E] text-white hover:bg-[#282668] shadow-sm",
        variant === "outline" && "bg-transparent border-2 border-white text-white hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
