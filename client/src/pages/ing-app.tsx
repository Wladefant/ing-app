import { useState } from "react";
import { MobileLayout } from "@/components/ing/layout";
import { WelcomeScreen } from "@/components/ing/screens/welcome";
import { LoginScreen } from "@/components/ing/screens/login";
import { DashboardScreen } from "@/components/ing/screens/dashboard";
import { TransactionDetailScreen } from "@/components/ing/screens/transactions";
import { TransferScreen } from "@/components/ing/screens/transfer";
import { InvestScreen } from "@/components/ing/screens/invest";
import { ServiceScreen } from "@/components/ing/screens/service";

export type Screen = 
  | "welcome" 
  | "login" 
  | "dashboard" 
  | "transactions" 
  | "transfer" 
  | "invest" 
  | "service";

export function INGApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedAccount, setSelectedAccount] = useState<string>("Girokonto");

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  return (
    <MobileLayout>
      {currentScreen === "welcome" && <WelcomeScreen onLogin={() => navigate("login")} />}
      
      {currentScreen === "login" && <LoginScreen onSuccess={() => navigate("dashboard")} />}
      
      {currentScreen === "dashboard" && (
        <DashboardScreen 
          onNavigate={navigate} 
          onSelectAccount={(acc: string) => {
            setSelectedAccount(acc);
            navigate("transactions");
          }} 
        />
      )}
      
      {currentScreen === "transactions" && (
        <TransactionDetailScreen 
          accountType={selectedAccount}
          onBack={() => navigate("dashboard")}
        />
      )}
      
      {currentScreen === "transfer" && (
        <TransferScreen onBack={() => navigate("dashboard")} />
      )}

      {currentScreen === "invest" && (
        <InvestScreen 
          onBack={() => navigate("dashboard")} 
          onNavigate={navigate}
        />
      )}

      {currentScreen === "service" && (
        <ServiceScreen 
          onBack={() => navigate("dashboard")} 
          onLogout={() => navigate("welcome")}
          onNavigate={navigate}
        />
      )}
    </MobileLayout>
  );
}
