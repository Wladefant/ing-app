
import { useState, useEffect, useCallback } from "react";
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
import lionIcon from "@/assets/lion-logo.png";

// Junior Screens
import { JuniorDashboardScreen } from "@/components/ing/screens/junior/dashboard";
import { JuniorInvestmentScreen } from "@/components/ing/screens/junior/invest";
import { JuniorQuizScreen } from "@/components/ing/screens/junior/quiz";
import { JuniorLeaderboardScreen } from "@/components/ing/screens/junior/leaderboard";
import { JuniorSavingsScreen } from "@/components/ing/screens/junior/savings";
import { KahootChallengeScreen } from "@/components/ing/screens/junior/kahoot-challenge";

// Adult Screens
import { AdultDashboardScreen } from "@/components/ing/screens/adult/dashboard";
import { AdultStatisticsScreen } from "@/components/ing/screens/adult/statistics";
import { AdultSubscriptionsScreen } from "@/components/ing/screens/adult/subscriptions";

// Profile Switcher & Birthday Transition
import { ProfileSwitcherBar } from "@/components/ing/profile-switcher";
import { BirthdayTransitionOverlay } from "@/components/ing/birthday-transition";

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
  | "savings"
  | "kahoot";

import { sendMessageToOpenAI, WidgetAction } from "@/lib/openai";

export function INGApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [selectedAccount, setSelectedAccount] = useState<string>("Girokonto");
  const [selectedStock, setSelectedStock] = useState<string>("ING");
  const [userProfile, setUserProfile] = useState<"adult" | "junior">("junior");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // New state for typing indicator
  const [activeScenarioContext, setActiveScenarioContext] = useState<string | undefined>(undefined); // New state for context
  const [pendingWidgets, setPendingWidgets] = useState<WidgetAction[]>([]); // Widgets from AI agent
  const [showBirthdayTransition, setShowBirthdayTransition] = useState(false);

  // Profile switch handler - triggers birthday animation when switching junior → adult
  const handleProfileSwitch = useCallback((newProfile: "junior" | "adult") => {
    if (newProfile === "adult" && userProfile === "junior") {
      // Trigger birthday transition animation
      setShowBirthdayTransition(true);
    } else {
      setUserProfile(newProfile);
      setCurrentScreen("dashboard");
    }
  }, [userProfile]);

  const handleBirthdayComplete = useCallback(() => {
    setShowBirthdayTransition(false);
    setUserProfile("adult");
    setCurrentScreen("dashboard");
  }, []);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "leo",
      text: "Hallo! Ich bin Leo, dein Finanzassistent. Wie kann ich dir helfen?",
      timestamp: Date.now(),
    },
    {
      id: "spending-coaching",
      sender: "leo",
      text: "💡 **Ausgaben-Coaching:** Ich habe deine letzten Transaktionen analysiert — du hast diese Woche 3x bei Lieferando bestellt (47,50€). Letzten Monat hast du 15% weniger für Shopping ausgegeben als den Monat davor — weiter so! Soll ich dir helfen, dein Budget zu optimieren?",
      timestamp: Date.now() + 1,
    },
    {
      id: "abo-watcher",
      sender: "leo",
      text: "🔔 **Abo-Wächter:** Dein Fitness Studio Abo (29,90€/Monat) wurde seit 3 Monaten nicht genutzt. Das sind 89,70€ verschwendet! Soll ich die Kündigung vorbereiten? Außerdem: Netflix hat eine Preiserhöhung auf 13,99€ angekündigt — ich behalte das im Auge.",
      timestamp: Date.now() + 2,
    }
  ]);
  const { toast } = useToast();

  // Open Leo with context and auto-send a message to trigger an AI response
  const openLeoWithAutoMessage = useCallback(async (context: string, autoMessage: string) => {
    setActiveScenarioContext(context);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: autoMessage,
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatOpen(true);
    setIsTyping(true);
    setPendingWidgets([]);

    const agentResponse = await sendMessageToOpenAI(
      [...chatMessages, userMsg],
      context,
      userProfile
    );

    setIsTyping(false);
    const response: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: "leo",
      text: agentResponse.response,
      timestamp: Date.now(),
    };

    if (agentResponse.widgets && agentResponse.widgets.length > 0) {
      const firstWidget = agentResponse.widgets[0];
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
      if (agentResponse.widgets.length > 1) {
        setPendingWidgets(agentResponse.widgets.slice(1));
      }
    }
    setChatMessages(prev => [...prev, response]);
  }, [chatMessages, userProfile]);

  const navigate = (screen: Screen) => {
    // When navigating to stock-detail, read the selected stock from localStorage
    if (screen === "stock-detail") {
      const stockFromStorage = localStorage.getItem("selectedStock");
      if (stockFromStorage) {
        setSelectedStock(stockFromStorage);
      }
    }
    setCurrentScreen(screen);
  };

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
              <img src={lionIcon} alt="Leo" className="w-5 h-5 object-contain" />
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
        onToggleProfile={(p) => handleProfileSwitch(p as "junior" | "adult")}
      />

      {currentScreen === "setup" && <SetupFlow onComplete={() => navigate("login")} onCancel={() => navigate("welcome")} />}

      {currentScreen === "welcome" && <WelcomeScreen onLogin={() => navigate("login")} onStartSetup={() => navigate("setup")} />}

      {currentScreen === "login" && <LoginScreen onSuccess={() => navigate("dashboard")} />}

      {currentScreen === "dashboard" && (
        userProfile === "adult" ? (
          <AdultDashboardScreen
            onNavigate={navigate}
            onSelectAccount={(acc: string) => {
              setSelectedAccount(acc);
              navigate("transactions");
            }}
            onLeoClick={() => {
              setActiveScenarioContext("Der Nutzer ist auf seinem Dashboard und möchte allgemeine Hilfe zu seinem Konto. Zeige proaktiv hilfreiche Informationen.");
              setIsChatOpen(true);
            }}
            onAskLeoAbout={(context: string) => {
              openLeoWithAutoMessage(context, "Analysiere meine Ausgaben detailliert und gib mir konkrete Spartipps.");
            }}
          />
        ) : (
          <JuniorDashboardScreen
            onNavigate={navigate}
            onLeoClick={() => {
              setActiveScenarioContext("Der Junior-Nutzer ist auf seinem Dashboard. Hilf ihm spielerisch mit seinen Finanzen, Sparzielen oder schlage ein Quiz vor.");
              setIsChatOpen(true);
            }}
          />
        )
      )}

      {currentScreen === "transactions" && (
        <TransactionDetailScreen
          accountType={selectedAccount}
          onBack={() => navigate("dashboard")}
          onLeoClick={() => setIsChatOpen(true)}
          onAskLeoAbout={(context: string) => {
            openLeoWithAutoMessage(context, "Erkläre mir diese Transaktion genauer.");
          }}
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
            onLeoClick={() => {
              setActiveScenarioContext("Der Nutzer ist auf der Investmentseite und schaut sich sein Portfolio an. Biete eine Portfolio-Analyse an, erkläre Aktien oder hilf bei Investmententscheidungen.");
              setIsChatOpen(true);
            }}
          />
        ) : (
          <JuniorInvestmentScreen
            onBack={() => navigate("dashboard")}
            onNavigate={navigate}
            onLeoClick={() => {
              setActiveScenarioContext("Der Junior-Nutzer ist auf der Investmentseite. Erkläre spielerisch Aktien, ETFs und Investieren für Anfänger.");
              setIsChatOpen(true);
            }}
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
          onLeoClick={() => {
            setActiveScenarioContext("Der Junior-Nutzer ist im Lernbereich und möchte sein Finanzwissen testen. Schlage passende Quizthemen vor oder erkläre Finanzkonzepte.");
            setIsChatOpen(true);
          }}
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
          onLeoClick={() => {
            setActiveScenarioContext("Der Nutzer ist im Abo-Manager und schaut sich seine Abonnements an. Hilf ihm beim Analysieren, Kündigen oder Optimieren seiner Abos. Aktive Abos: Netflix (17,99€), Spotify (9,99€), Fitness Studio (29,90€ - wird kaum genutzt!), Disney+ (8,99€), Xbox Game Pass (14,99€), Amazon Prime (8,99€).");
            setIsChatOpen(true);
          }}
          onAskLeoAbout={(context: string) => {
            openLeoWithAutoMessage(context, "Analysiere meine Abonnements und zeig mir wo ich sparen kann.");
          }}
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
          symbol={selectedStock}
          onBack={() => navigate("invest")}
          onLeoClick={() => {
            setActiveScenarioContext(`Der Nutzer schaut sich die Aktie ${selectedStock} an. Gib eine detaillierte Analyse dieser Aktie, erkläre Kennzahlen und gib eine Einschätzung.`);
            setIsChatOpen(true);
          }}
          isJunior={userProfile === "junior"}
        />
      )}

      {currentScreen === "leaderboard" && (
        <JuniorLeaderboardScreen
          onBack={() => navigate("dashboard")}
          onNavigate={navigate}
          onLeoClick={() => {
            setActiveScenarioContext("Der Junior-Nutzer ist auf der Bestenliste. Motiviere ihn, mehr Quizze zu spielen und XP zu sammeln.");
            setIsChatOpen(true);
          }}
        />
      )}

      {currentScreen === "savings" && (
        <JuniorSavingsScreen
          onBack={() => navigate("dashboard")}
          onNavigate={navigate}
          onLeoClick={() => {
            setActiveScenarioContext("Der Junior-Nutzer ist bei seinen Sparzielen. Hilf ihm beim Erstellen neuer Sparziele, gib Spartipps und motiviere ihn beim Sparen.");
            setIsChatOpen(true);
          }}
        />
      )}

      {currentScreen === "kahoot" && (
        <KahootChallengeScreen
          onBack={() => navigate("dashboard")}
          onNavigate={navigate}
          onLeoClick={() => {
            setActiveScenarioContext("Der Junior-Nutzer ist bei der Quiz Challenge. Erkläre Quizthemen, gib Lerntipps oder schlage neue Themen vor.");
            setIsChatOpen(true);
          }}
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

      {/* Profile Switcher Bar */}
      {currentScreen !== "welcome" && currentScreen !== "login" && currentScreen !== "setup" && (
        <ProfileSwitcherBar
          currentProfile={userProfile}
          onSwitch={handleProfileSwitch}
        />
      )}

      {/* Birthday Transition Overlay */}
      <BirthdayTransitionOverlay
        isActive={showBirthdayTransition}
        onComplete={handleBirthdayComplete}
      />
    </MobileLayout>
  );
}
