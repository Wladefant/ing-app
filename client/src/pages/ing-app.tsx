
import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/ing/layout";
import { WelcomeScreen } from "@/components/ing/screens/welcome";
import { LoginScreen } from "@/components/ing/screens/login";
import { DashboardScreen } from "@/components/ing/screens/dashboard";
import { TransactionDetailScreen } from "@/components/ing/screens/transactions";
import { TransferScreen } from "@/components/ing/screens/transfer";
import { InvestScreen } from "@/components/ing/screens/invest";
import { ServiceScreen } from "@/components/ing/screens/service";
import { OrdersScreen } from "@/components/ing/screens/orders";
import { ProductsScreen } from "@/components/ing/screens/products";
import { SetupFlow } from "@/components/ing/screens/setup";
import { LeoChatOverlay } from "@/components/ing/leo/chat-overlay";
import { DemoSidebar } from "@/components/ing/leo/demo-sidebar";
import { DEMO_SCENARIOS, DemoScenarioId, ChatMessage } from "@/lib/demo-scenarios";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import lionIcon from "@assets/generated_images/minimalist_orange_app_icon_with_white_lion.png";

// Junior Screens
import { JuniorDashboardScreen } from "@/components/ing/screens/junior/dashboard";
import { JuniorInvestmentScreen } from "@/components/ing/screens/junior/invest";
import { JuniorQuizScreen } from "@/components/ing/screens/junior/quiz";
import { JuniorLeaderboardScreen } from "@/components/ing/screens/junior/leaderboard";
import { JuniorSavingsScreen } from "@/components/ing/screens/junior/savings";

// Adult Screens
import { AdultStatisticsScreen } from "@/components/ing/screens/adult/statistics";
import { AdultSubscriptionsScreen } from "@/components/ing/screens/adult/subscriptions";

// Stock Detail Screen
import { StockDetailScreen } from "@/components/ing/screens/stock-detail";

export type Screen =
  | "setup"
  | "welcome"
  | "login"
  | "dashboard"
  | "transactions"
  | "transfer"
  | "invest"
  | "orders"
  | "products"
  | "service"
  | "learn"
  | "statistics"
  | "subscriptions"
  | "stock-detail"
  | "leaderboard"
  | "savings";

import { sendMessageToOpenAI, WidgetAction } from "@/lib/openai";

export function INGApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedAccount, setSelectedAccount] = useState<string>("Girokonto");
  const [userProfile, setUserProfile] = useState<"adult" | "junior">("adult");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // New state for typing indicator
  const [activeScenarioContext, setActiveScenarioContext] = useState<string | undefined>(undefined); // New state for context
  const [pendingWidgets, setPendingWidgets] = useState<WidgetAction[]>([]); // Widgets from AI agent

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "leo",
      text: "Hallo! Ich bin Leo, dein Finanzassistent. Wie kann ich dir helfen?",
      timestamp: Date.now(),
    }
  ]);
  const { toast } = useToast();

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  // Handle navigation from AI agent
  const handleAgentNavigate = (screen: string) => {
    const screenMap: Record<string, Screen> = {
      dashboard: "dashboard",
      invest: "invest",
      transfer: "transfer",
      subscriptions: "subscriptions",
      statistics: "statistics",
      savings: "savings",
      quiz: "learn",
      profile: "service",
      settings: "service",
      leaderboard: "leaderboard",
    };
    const targetScreen = screenMap[screen] || "dashboard";
    setIsChatOpen(false);
    navigate(targetScreen);
  };

  // Handle quiz start from AI agent
  const handleStartQuiz = (topic: string, difficulty?: string) => {
    setIsChatOpen(false);
    // Navigate to quiz screen - in the future, pass topic/difficulty as state
    navigate("learn");
  };

  const handleTriggerScenario = (id: DemoScenarioId) => {
    const scenario = DEMO_SCENARIOS[id];
    if (!scenario) return;

    // Set the active context for the AI
    setActiveScenarioContext(scenario.systemContext);

    // Add scenario messages
    setChatMessages(prev => [...prev, ...scenario.initialMessages]);

    // Show notification if applicable
    if (scenario.notification) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6200] rounded-full flex items-center justify-center">
              <img src={lionIcon} alt="Leo" className="w-4 h-4 object-contain brightness-0 invert" />
            </div>
            <span>{scenario.notification.title}</span>
          </div>
        ) as any,
        description: scenario.notification.message,
        action: (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-[#FF6200] text-white px-3 py-1 rounded-md text-xs font-bold"
          >
            {scenario.notification.actionLabel}
          </button>
        ),
        duration: 5000,
      });
    } else {
      // Open chat directly for non-notification scenarios
      setIsChatOpen(true);
    }
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    setPendingWidgets([]); // Clear previous widgets

    // Call OpenAI with agent capabilities
    const agentResponse = await sendMessageToOpenAI(
      [...chatMessages, newMessage], 
      activeScenarioContext,
      userProfile
    );

    setIsTyping(false);

    // Create response message - may include widget type if agent returned widgets
    const response: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: "leo",
      text: agentResponse.response,
      timestamp: Date.now(),
    };

    // If we have widgets from the agent, attach the first one to the message
    if (agentResponse.widgets && agentResponse.widgets.length > 0) {
      const firstWidget = agentResponse.widgets[0];
      
      // Map agent actions to widget types
      const widgetTypeMap: Record<string, string> = {
        show_stock_widget: "stock",
        show_transfer_widget: "transfer",
        start_quiz: "quiz",
        show_achievement: "achievement",
        show_savings_goal: "savings_goal",
        show_spending_chart: "spending_chart",
      };

      if (widgetTypeMap[firstWidget.action]) {
        response.widgetType = widgetTypeMap[firstWidget.action] as any;
        response.widgetData = firstWidget.data;
      }

      // Store remaining widgets as pending
      if (agentResponse.widgets.length > 1) {
        setPendingWidgets(agentResponse.widgets.slice(1));
      }

      // Handle navigation action immediately
      if (firstWidget.action === "navigate_to_screen") {
        setTimeout(() => handleAgentNavigate(firstWidget.data.screen), 1500);
      }
    }

    setChatMessages(prev => [...prev, response]);
  };

  return (
    <MobileLayout>
      {/* Demo Sidebar - Only visible on larger screens or via toggle */}
      <DemoSidebar
        onTriggerScenario={handleTriggerScenario}
        currentProfile={userProfile}
        onToggleProfile={setUserProfile}
      />

      {currentScreen === "setup" && <SetupFlow onComplete={() => navigate("login")} onCancel={() => navigate("welcome")} />}

      {currentScreen === "welcome" && <WelcomeScreen onLogin={() => navigate("login")} onStartSetup={() => navigate("setup")} />}

      {currentScreen === "login" && <LoginScreen onSuccess={() => navigate("dashboard")} />}

      {currentScreen === "dashboard" && (
        userProfile === "adult" ? (
          <DashboardScreen
            onNavigate={navigate}
            onSelectAccount={(acc: string) => {
              setSelectedAccount(acc);
              navigate("transactions");
            }}
            onLeoClick={() => setIsChatOpen(true)}
          />
        ) : (
          <JuniorDashboardScreen
            onNavigate={navigate}
            onLeoClick={() => setIsChatOpen(true)}
          />
        )
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
        userProfile === "adult" ? (
          <InvestScreen
            onBack={() => navigate("dashboard")}
            onNavigate={navigate}
          />
        ) : (
          <JuniorInvestmentScreen
            onBack={() => navigate("dashboard")}
            onNavigate={navigate}
            onLeoClick={() => setIsChatOpen(true)}
          />
        )
      )}

      {currentScreen === "orders" && (
        <OrdersScreen onNavigate={navigate} />
      )}

      {currentScreen === "products" && (
        <ProductsScreen onNavigate={navigate} />
      )}

      {currentScreen === "learn" && (
        <JuniorQuizScreen
          onBack={() => navigate("dashboard")}
          onNavigate={navigate}
          onLeoClick={() => setIsChatOpen(true)}
        />
      )}

      {currentScreen === "statistics" && (
        <AdultStatisticsScreen
          onBack={() => navigate("dashboard")}
        />
      )}

      {currentScreen === "subscriptions" && (
        <AdultSubscriptionsScreen
          onBack={() => navigate("dashboard")}
        />
      )}

      {currentScreen === "service" && (
        <ServiceScreen
          onBack={() => navigate("dashboard")}
          onLogout={() => navigate("welcome")}
          onNavigate={navigate}
        />
      )}

      {currentScreen === "stock-detail" && (
        <StockDetailScreen
          symbol="ING"
          onBack={() => navigate("invest")}
          onLeoClick={() => setIsChatOpen(true)}
          isJunior={userProfile === "junior"}
        />
      )}

      {currentScreen === "leaderboard" && (
        <JuniorLeaderboardScreen
          onBack={() => navigate("dashboard")}
          onNavigate={navigate}
          onLeoClick={() => setIsChatOpen(true)}
        />
      )}

      {currentScreen === "savings" && (
        <JuniorSavingsScreen
          onBack={() => navigate("dashboard")}
          onNavigate={navigate}
          onLeoClick={() => setIsChatOpen(true)}
        />
      )}

      {/* Global Chat Overlay */}
      <LeoChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        onNavigate={handleAgentNavigate}
        onStartQuiz={handleStartQuiz}
        pendingWidgets={pendingWidgets}
      />
    </MobileLayout>
  );
}
