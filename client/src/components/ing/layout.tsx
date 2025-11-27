import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Briefcase, Calendar, PieChart, User } from "lucide-react";

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
        
        {/* Persistent Bottom Navigation Bar */}
        {/* It should be visible on most main screens, but we need to conditionally hide it for setup/login/fullscreen flows */}
        {/* For simplicity in this mockup, I will include it here but hide it via CSS classes passed from children or handle it via state in parent if needed.
            However, user requested "the bottom bar should always be there... apart from that always".
            The setup flow usually DOES NOT have the bottom bar.
            The Login screen usually DOES NOT have the bottom bar.
            Only the authenticated area (Dashboard, Transactions, etc.) has it.
            
            Let's check the user request again: "the bottom bar should always be there, no matter what when you are in the app, if you only register not but apart from that always."
            
            So: Register/Setup -> NO bottom bar.
            App (Dashboard, etc) -> YES bottom bar.
            
            Since MobileLayout wraps everything, we might need to make the bar optional or controlled.
            But wait, the current architecture has the bar INSIDE the Dashboard/Service screens. 
            I should extract it to here OR keep it there.
            Refactoring to keep it simple: I will keep it inside the screens that need it (Dashboard, Transactions, Service, Invest) to ensure it doesn't overlap with Setup/Login.
        */}
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

export function BottomNav({ activeTab, onNavigate }: { activeTab: string; onNavigate: (tab: any) => void }) {
  return (
    <div className="h-16 bg-white border-t border-gray-200 flex justify-around items-center text-[10px] font-medium text-gray-500 shrink-0 z-20">
      <NavItem icon={<Briefcase size={24} />} label="Konten" active={activeTab === "dashboard"} onClick={() => onNavigate("dashboard")} />
      <NavItem icon={<Calendar size={24} />} label="Aufträge" active={activeTab === "transactions"} onClick={() => onNavigate("transactions")} />
      <NavItem icon={<PieChart size={24} />} label="Investieren" active={activeTab === "invest"} onClick={() => onNavigate("invest")} />
      <NavItem icon={<Briefcase size={24} />} label="Produkte" active={activeTab === "products"} />
      <NavItem icon={<User size={24} />} label="Service" active={activeTab === "service"} onClick={() => onNavigate("service")} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 w-1/5 py-1",
        active ? "text-[#FF6200]" : "text-gray-400 hover:text-gray-600"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
