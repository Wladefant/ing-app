import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Briefcase, Calendar, PieChart, User, Package, TrendingUp, Home, BookOpen, Trophy } from "lucide-react";
import lionIcon from "@assets/generated_images/minimalist_orange_app_icon_with_white_lion.png";

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

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ScreenHeader({ title, onBack, rightAction }: { title?: string; onBack?: () => void; rightAction?: ReactNode }) {
  return (
    <div className="h-14 px-4 flex items-center justify-between bg-[#F3F3F3] shrink-0">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="text-orange-500" title="Zurück">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
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

export function BottomNav({
  activeTab,
  onNavigate,
  onLeoClick,
  profile = "adult"
}: {
  activeTab: string;
  onNavigate: (tab: any) => void;
  onLeoClick?: () => void;
  profile?: "adult" | "junior";
}) {
  return (
    <div className="h-20 bg-white border-t border-gray-200 flex justify-around items-end pb-2 text-[10px] font-medium text-gray-500 shrink-0 z-20 relative">
      {profile === "adult" ? (
        <>
          <NavItem icon={<Briefcase size={24} />} label="Konten" active={activeTab === "dashboard"} onClick={() => onNavigate("dashboard")} />
          <NavItem icon={<TrendingUp size={24} />} label="Investieren" active={activeTab === "invest"} onClick={() => onNavigate("invest")} />
        </>
      ) : (
        <>
          <NavItem icon={<Home size={24} />} label="Home" active={activeTab === "dashboard"} onClick={() => onNavigate("dashboard")} />
          <NavItem icon={<PieChart size={24} />} label="Invest" active={activeTab === "invest"} onClick={() => onNavigate("invest")} />
        </>
      )}

      {/* Central Lion Button */}
      <div className="relative -top-6">
        <button
          onClick={onLeoClick}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(255,98,0,0.3)] border-4 border-[#F3F3F3] active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 bg-[#FF6200] rounded-full flex items-center justify-center overflow-hidden">
            <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain brightness-0 invert" />
          </div>
        </button>
      </div>

      {profile === "adult" ? (
        <>
          <NavItem icon={<Package size={24} />} label="Produkte" active={activeTab === "products"} onClick={() => onNavigate("products")} />
          <NavItem icon={<User size={24} />} label="Profil" active={activeTab === "service"} onClick={() => onNavigate("service")} />
        </>
      ) : (
        <>
          <NavItem icon={<BookOpen size={24} />} label="Lernen" active={activeTab === "learn"} onClick={() => onNavigate("learn")} />
          <NavItem icon={<Trophy size={24} />} label="Punkte" active={activeTab === "leaderboard"} onClick={() => onNavigate("leaderboard")} />
        </>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 w-1/5 py-2",
        active ? "text-[#FF6200]" : "text-gray-400 hover:text-gray-600"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
