import { ReactNode } from "react";

export type DemoScenarioId =
  | "rent_alert"
  | "spending_insight"
  | "doc_scan"
  | "stock_inquiry"
  | "subscription_check"
  | "junior_salary"
  | "quiz_trigger"
  | "savings_goal"
  | "investment_advice"
  | "tax_explanation"
  | "portfolio_analysis"
  | "bill_negotiation"
  | "proactive_tip"
  | "market_news"
  | "budget_alert"
  | "achievement_unlock"
  | "junior_quiz_stocks"
  | "junior_quiz_taxes"
  | "junior_first_trade"
  | "smart_transfer"
  | "investment_walkthrough"
  | "savings_challenge";

export interface ChatMessage {
  id: string;
  sender: "user" | "leo";
  text: string;
  widget?: ReactNode;
  widgetType?: "stock" | "chart" | "transfer" | "quiz" | "achievement" | "savings_goal" | "spending_chart";
  widgetData?: any;
  timestamp: number;
}

export interface DemoScenario {
  id: DemoScenarioId;
  name: string;
  description: string;
  category: "adult" | "junior" | "both";
  initialMessages: ChatMessage[];
  notification?: {
    title: string;
    message: string;
    actionLabel: string;
  };
  systemContext?: string;
}

export const DEMO_SCENARIOS: Record<DemoScenarioId, DemoScenario> = {
  rent_alert: {
    id: "rent_alert",
    name: "🏠 Rent Alert",
    description: "Smart alert for monthly rent payment",
    category: "adult",
    initialMessages: [
      {
        id: "msg_rent_1",
        sender: "leo",
        text: "Hallo! Es ist der Erste des Monats. Deine Miete von 800€ an 'Vermieter GmbH' ist fällig. Soll ich die Überweisung für dich vorbereiten? 🏠",
        timestamp: Date.now(),
        widgetType: "transfer",
        widgetData: { recipient: "Vermieter GmbH", amount: 800, reference: "Miete Dezember" }
      }
    ],
    notification: {
      title: "Miete fällig",
      message: "800€ an Vermieter GmbH senden?",
      actionLabel: "Jetzt senden",
    },
    systemContext: "The user has a recurring rent payment of 800 EUR to 'Vermieter GmbH'. You just reminded them. If they say yes, confirm the transaction is scheduled. If they say no, ask if they want to snooze it. Be friendly and helpful. Use occasional emojis."
  },

  spending_insight: {
    id: "spending_insight",
    name: "📊 Spending Insight",
    description: "AI analysis of spending patterns",
    category: "adult",
    initialMessages: [
      {
        id: "msg_spend_1",
        sender: "leo",
        text: "Mir ist etwas aufgefallen! 📊 Deine Ausgaben für Restaurants sind diese Woche um 23% gestiegen (€150 vs. €122 letzte Woche). Hauptverursacher: Vapiano (€45), Lieferando (€52), und Starbucks (€28). Möchtest du eine detaillierte Aufschlüsselung sehen?",
        timestamp: Date.now(),
        widgetType: "chart"
      }
    ],
    systemContext: "You detected a 23% increase in restaurant spending. Details: Vapiano €45, Lieferando €52, Starbucks €28, and several smaller purchases. If the user wants details, show the breakdown and offer budgeting tips. Be supportive, not judgmental."
  },

  doc_scan: {
    id: "doc_scan",
    name: "📄 Document Scan",
    description: "AI document analysis feature",
    category: "adult",
    initialMessages: [
      {
        id: "msg_scan_1",
        sender: "user",
        text: "Kannst du mir diese Rechnung erklären?",
        timestamp: Date.now() - 1000,
      },
      {
        id: "msg_scan_2",
        sender: "leo",
        text: "Das ist deine Stromrechnung von Vattenfall! 📄✨\n\n💰 **Betrag:** 45,20€\n📅 **Fällig am:** 15. Dezember\n⚡ **Verbrauch:** 180 kWh\n\n🎉 Gute Nachricht: Du hast 12% weniger verbraucht als letzten Monat! Das spart dir ca. €6 pro Monat. Weiter so!",
        timestamp: Date.now(),
      }
    ],
    systemContext: "The user just scanned a Vattenfall electricity bill for 45.20 EUR, 180 kWh usage. You analyzed it and found a 12% consumption decrease compared to last month. Offer to answer any questions about the bill or give electricity saving tips."
  },

  stock_inquiry: {
    id: "stock_inquiry",
    name: "📈 Stock Inquiry",
    description: "Ask about any stock",
    category: "both",
    initialMessages: [
      {
        id: "msg_stock_1",
        sender: "user",
        text: "Was hältst du von der ING Aktie?",
        timestamp: Date.now() - 1000,
      },
      {
        id: "msg_stock_2",
        sender: "leo",
        text: "Die ING Groep N.V. Aktie steht aktuell bei **€12,45** (↑1,2% heute)! 📈\n\n**Kurze Analyse:**\n• 52-Wochen-Hoch: €15,80\n• 52-Wochen-Tief: €9,20\n• Dividendenrendite: 6,2%\n• KGV: 7,8\n\n🦁 **Meine Einschätzung:** ING ist eine solide Dividendenaktie mit guter Bewertung. Für langfristige Anleger interessant!\n\nSoll ich dir mehr über Bankaktien erklären?",
        timestamp: Date.now(),
        widgetType: "stock",
        widgetData: { symbol: "ING", price: 12.45, change: 1.2 }
      }
    ],
    systemContext: "The user asked about ING stock. Current price is 12.45 EUR, up 1.2% today. Provide analysis and be helpful. If it's a Junior user, explain concepts simply. If asked about buying, explain risks and diversification."
  },

  subscription_check: {
    id: "subscription_check",
    name: "📱 Subscription Check",
    description: "Detect unused subscriptions",
    category: "adult",
    initialMessages: [
      {
        id: "msg_sub_1",
        sender: "leo",
        text: "Hey! Ich habe deine Abos analysiert und etwas gefunden: 🔍\n\n⚠️ **Netflix Premium** - Du hast seit 45 Tagen nichts geschaut, aber zahlst €17,99/Monat.\n\nDas sind **€215,88 pro Jahr** für einen ungenutzten Service! 😮\n\nMöchtest du:\n• Das Abo pausieren?\n• Zum günstigeren Plan wechseln (€12,99)?\n• Kündigen und €17,99/Monat sparen?",
        timestamp: Date.now(),
      }
    ],
    notification: {
      title: "Ungenutztes Abo gefunden",
      message: "Netflix seit 45 Tagen ungenutzt - 17,99€/Monat sparen?",
      actionLabel: "Details ansehen",
    },
    systemContext: "You detected that the user hasn't used Netflix in 45 days but pays €17.99/month. Help them decide whether to cancel, pause, or downgrade. Be helpful and informative about their options."
  },

  junior_salary: {
    id: "junior_salary",
    name: "💰 Weekly Salary",
    description: "Virtual salary with tax education",
    category: "junior",
    initialMessages: [
      {
        id: "msg_salary_1",
        sender: "leo",
        text: "🎉 **Dein wöchentliches Gehalt ist da!**\n\nBrutto: **€200,00**\n\n📝 **Abzüge:**\n• Einkommensteuer: -€30,00 (15%)\n• Sozialversicherung: -€20,00 (10%)\n• Krankenversicherung: -€10,00 (5%)\n\n💵 **Netto: €140,00**\n\nDas ist der Betrag, der in deiner Tasche landet! Möchtest du verstehen, wohin die Abzüge gehen? 🤔",
        timestamp: Date.now(),
      }
    ],
    notification: {
      title: "💰 Gehalt eingegangen!",
      message: "+€140,00 verfügbar (Netto)",
      actionLabel: "Details ansehen",
    },
    systemContext: "The user (teenager) just received their weekly virtual salary. Gross: €200, deductions: income tax €30, social security €20, health insurance €10, net: €140. Explain taxes simply if asked. Make learning fun!"
  },

  quiz_trigger: {
    id: "quiz_trigger",
    name: "🧠 Quiz Challenge",
    description: "Start a financial quiz",
    category: "junior",
    initialMessages: [
      {
        id: "msg_quiz_1",
        sender: "leo",
        text: "Zeit für eine Challenge! 🧠💪\n\n**Thema: ETFs verstehen**\n⏱️ 3 Fragen\n🏆 +75 XP zu gewinnen\n🔥 Streak-Bonus: 2x Punkte!\n\nBist du bereit?",
        timestamp: Date.now(),
        widgetType: "quiz",
        widgetData: { topic: "ETFs", questions: 3, xp: 75 }
      }
    ],
    systemContext: "You are starting a quiz about ETFs. Ask 3 questions one by one. After each answer, explain if correct or wrong, then move to the next question. Award 75 XP total (25 per correct answer). Make it fun and educational!"
  },

  savings_goal: {
    id: "savings_goal",
    name: "🎯 Savings Goal",
    description: "Track and motivate savings",
    category: "both",
    initialMessages: [
      {
        id: "msg_savings_1",
        sender: "leo",
        text: "Update zu deinem Sparziel! 🎯\n\n**Ziel:** Urlaub in Spanien\n**Gespart:** €1.240 von €2.000\n**Fortschritt:** 62% ████████░░░\n\n📅 Bei deiner aktuellen Sparrate erreichst du das Ziel in **6 Wochen**!\n\n💡 **Tipp:** Wenn du €50 mehr pro Woche sparst, schaffst du es in nur 4 Wochen!",
        timestamp: Date.now(),
      }
    ],
    systemContext: "The user has a savings goal for a Spain vacation. Target: €2000, saved: €1240 (62%). Current rate will reach goal in 6 weeks. Offer motivation and tips to save faster."
  },

  investment_advice: {
    id: "investment_advice",
    name: "💼 Investment Advice",
    description: "Personalized investment suggestions",
    category: "adult",
    initialMessages: [
      {
        id: "msg_invest_1",
        sender: "leo",
        text: "Basierend auf deinem Profil habe ich einige Ideen für dich! 💼\n\n**Dein Risikoprofil:** Moderat\n**Anlagehorizont:** 5+ Jahre\n\n🌱 **Mein Vorschlag:**\n1. **MSCI World ETF** (50%) - Globale Diversifikation\n2. **Euro-Staatsanleihen** (30%) - Stabilität\n3. **Nachhaltigkeits-ETF** (20%) - Grüne Investments\n\nSoll ich mehr zu einem dieser Optionen erklären?",
        timestamp: Date.now(),
      }
    ],
    systemContext: "The user has a moderate risk profile and 5+ year investment horizon. You're suggesting a balanced portfolio. Explain any investment type if asked. Always mention that you're not giving professional financial advice."
  },

  tax_explanation: {
    id: "tax_explanation",
    name: "🧾 Tax Help",
    description: "Explain tax concepts simply",
    category: "both",
    initialMessages: [
      {
        id: "msg_tax_1",
        sender: "user",
        text: "Was ist Kapitalertragssteuer?",
        timestamp: Date.now() - 1000,
      },
      {
        id: "msg_tax_2",
        sender: "leo",
        text: "Gute Frage! 🧾\n\n**Kapitalertragssteuer** ist die Steuer auf Gewinne aus Geldanlagen.\n\n📊 **Beispiel:**\nDu kaufst eine Aktie für €100 und verkaufst sie für €150.\nGewinn: €50\nSteuer (ca. 25%): €12,50\nDein Netto-Gewinn: €37,50\n\n💡 **Gut zu wissen:**\n• Freibetrag: €1.000/Jahr (Singles)\n• Die Bank führt die Steuer automatisch ab\n• Verluste können verrechnet werden!\n\nWillst du mehr über Steuern bei Investments erfahren?",
        timestamp: Date.now(),
      }
    ],
    systemContext: "The user asked about capital gains tax. Explain it simply with examples. If Junior user, use even simpler language. Offer to explain related concepts like Freibetrag (tax allowance)."
  },

  portfolio_analysis: {
    id: "portfolio_analysis",
    name: "📉 Portfolio Check",
    description: "Analyze portfolio performance",
    category: "adult",
    initialMessages: [
      {
        id: "msg_portfolio_1",
        sender: "leo",
        text: "Hier ist deine Portfolio-Analyse! 📊\n\n**Gesamtwert:** €12.704,96\n**Heute:** +€45,20 (+0,36%)\n**Diese Woche:** +€234,10 (+1,88%)\n**Dieses Jahr:** +€1.560 (+14,0%)\n\n⚠️ **Aufgefallen:**\nTech-Aktien machen 65% deines Portfolios aus. Das ist ziemlich konzentriert!\n\n💡 **Vorschlag:** Mehr Diversifikation durch einen Anleihen-ETF könnte das Risiko senken.\n\nSoll ich Optionen zeigen?",
        timestamp: Date.now(),
        widgetType: "chart"
      }
    ],
    systemContext: "User has a portfolio worth €12,704.96 with 65% in tech stocks. This is quite concentrated. Suggest diversification. Explain risks without being alarmist."
  },

  bill_negotiation: {
    id: "bill_negotiation",
    name: "📞 Bill Negotiation",
    description: "Help negotiate better rates",
    category: "adult",
    initialMessages: [
      {
        id: "msg_bill_1",
        sender: "leo",
        text: "Ich habe deine Rechnungen analysiert! 📞\n\n🔍 **Sparpotenzial gefunden:**\n\n1. **Internet (Vodafone):** €45/Monat\n   → Marktpreis für gleiche Leistung: €30/Monat\n   💰 Ersparnis möglich: €180/Jahr\n\n2. **Handyvertrag (O2):** €35/Monat\n   → Günstigere Alternative: €20/Monat\n   💰 Ersparnis möglich: €180/Jahr\n\nSoll ich dir ein Kündigungsschreiben vorbereiten oder Verhandlungstipps geben?",
        timestamp: Date.now(),
      }
    ],
    systemContext: "You found that the user pays too much for internet (€45 vs market €30) and mobile (€35 vs €20). Help them negotiate or switch providers. Offer to draft cancellation letters or negotiation scripts."
  },

  proactive_tip: {
    id: "proactive_tip",
    name: "💡 Proactive Tip",
    description: "AI-initiated helpful suggestion",
    category: "both",
    initialMessages: [
      {
        id: "msg_tip_1",
        sender: "leo",
        text: "Guten Morgen! ☀️ Ich habe einen Tipp für dich:\n\n💡 Du hast **€3.240** auf deinem Girokonto, das keine Zinsen bringt.\n\nWenn du €2.000 davon auf dein Extra-Konto (1,5% Zinsen) überträgst, verdienst du **€30 extra** pro Jahr - ohne Risiko!\n\nSoll ich die Überweisung vorbereiten?",
        timestamp: Date.now(),
        widgetType: "transfer",
        widgetData: { recipient: "Extra-Konto", amount: 2000, reference: "Mehr Zinsen!" }
      }
    ],
    notification: {
      title: "💡 Leo hat einen Tipp",
      message: "€30 mehr Zinsen pro Jahr möglich!",
      actionLabel: "Mehr erfahren",
    },
    systemContext: "You noticed the user has €3,240 in their checking account with no interest. Suggest moving €2,000 to savings account with 1.5% interest to earn €30/year extra. Be helpful, not pushy."
  },

  market_news: {
    id: "market_news",
    name: "📰 Market News",
    description: "Personalized market updates",
    category: "adult",
    initialMessages: [
      {
        id: "msg_news_1",
        sender: "leo",
        text: "📰 **Markt-Update für dein Portfolio:**\n\n🔴 **Tesla (-3,2%)** - Negative Produktionszahlen aus China\n→ Betrifft 10% deines Portfolios\n\n🟢 **Apple (+1,5%)** - Starke iPhone-Verkäufe erwartet\n→ Betrifft 15% deines Portfolios\n\n⚪ **ING (+0,5%)** - EZB-Zinsentscheidung im Fokus\n\nMöchtest du mehr Details zu einer dieser Nachrichten?",
        timestamp: Date.now(),
      }
    ],
    systemContext: "You're giving the user personalized market news based on their portfolio holdings. Tesla is down 3.2% (bad news from China), Apple up 1.5% (iPhone sales), ING stable. Explain implications if asked."
  },

  budget_alert: {
    id: "budget_alert",
    name: "⚠️ Budget Alert",
    description: "Warn about budget limits",
    category: "both",
    initialMessages: [
      {
        id: "msg_budget_1",
        sender: "leo",
        text: "⚠️ **Budget-Warnung!**\n\nDu hast diesen Monat bereits **85%** deines Shopping-Budgets ausgegeben, und wir haben noch 10 Tage!\n\n📊 **Shopping-Budget:** €200\n💸 **Ausgegeben:** €170\n💵 **Übrig:** €30\n\nSoll ich dir helfen, die Ausgaben zu tracken? Oder das Budget für nächsten Monat anpassen?",
        timestamp: Date.now(),
      }
    ],
    notification: {
      title: "⚠️ Budget-Warnung",
      message: "Shopping: 85% verbraucht, 10 Tage übrig",
      actionLabel: "Details",
    },
    systemContext: "User has spent 85% of their €200 shopping budget with 10 days left in the month. Help them track spending or adjust budgets. Be supportive, not judgemental."
  },

  achievement_unlock: {
    id: "achievement_unlock",
    name: "🏆 Achievement",
    description: "Celebrate milestones",
    category: "junior",
    initialMessages: [
      {
        id: "msg_achieve_1",
        sender: "leo",
        text: "🎉 **ACHIEVEMENT UNLOCKED!** 🎉\n\n🏆 **\"Spar-Champion\"**\n\nDu hast 4 Wochen in Folge gespart! Das ist echte Disziplin! 💪\n\n**Belohnung:**\n• +100 XP\n• Neues Badge für dein Profil\n• Freischaltung: Fortgeschrittene Investment-Kurse\n\nWeiter so! Du bist auf dem besten Weg zum Finanz-Profi! 🦁",
        timestamp: Date.now(),
        widgetType: "achievement",
        widgetData: { name: "Spar-Champion", xp: 100 }
      }
    ],
    notification: {
      title: "🏆 Achievement!",
      message: "\"Spar-Champion\" freigeschaltet! +100 XP",
      actionLabel: "Ansehen",
    },
    systemContext: "The user just unlocked the 'Spar-Champion' achievement for saving 4 weeks in a row. Celebrate with them! +100 XP. Make it feel rewarding and motivating."
  },

  junior_quiz_stocks: {
    id: "junior_quiz_stocks",
    name: "🎮 Quiz: Aktien",
    description: "Stock basics quiz for juniors",
    category: "junior",
    initialMessages: [
      {
        id: "msg_qstock_1",
        sender: "leo",
        text: "🎮 **Quiz-Zeit: Aktien-Grundlagen!**\n\n**Frage 1/3:**\nWas passiert, wenn du eine Aktie kaufst?\n\nA) Du leihst der Firma Geld\nB) Du besitzt einen kleinen Teil der Firma\nC) Du wirst Angestellter der Firma\nD) Die Firma muss dir Geld zahlen\n\nWähle A, B, C oder D!",
        timestamp: Date.now(),
        widgetType: "quiz"
      }
    ],
    systemContext: "You're hosting a 3-question quiz about stocks for teenagers. Q1: What happens when you buy a stock? Correct: B (you own part of the company). After answer, explain and move to Q2 about dividends, then Q3 about risk. Award XP at end."
  },

  junior_quiz_taxes: {
    id: "junior_quiz_taxes",
    name: "🎮 Quiz: Steuern",
    description: "Tax basics quiz for juniors",
    category: "junior",
    initialMessages: [
      {
        id: "msg_qtax_1",
        sender: "leo",
        text: "🎮 **Quiz-Zeit: Steuern verstehen!**\n\n**Frage 1/3:**\nWas ist der Unterschied zwischen Brutto und Netto?\n\nA) Brutto ist das, was du bekommst, Netto ist vorher\nB) Es gibt keinen Unterschied\nC) Brutto ist vorher, Netto ist was du bekommst nach Abzügen\nD) Beides ist das gleiche\n\nWähle A, B, C oder D!",
        timestamp: Date.now(),
        widgetType: "quiz"
      }
    ],
    systemContext: "You're hosting a 3-question tax quiz for teenagers. Q1: Brutto vs Netto difference? Correct: C. Q2: What are taxes used for? Q3: Who pays taxes? Keep it simple and educational. Award XP."
  },

  junior_first_trade: {
    id: "junior_first_trade",
    name: "🎯 First Trade",
    description: "Guide through first virtual trade",
    category: "junior",
    initialMessages: [
      {
        id: "msg_trade_1",
        sender: "leo",
        text: "🎯 **Bereit für deinen ersten Trade?**\n\nIch helfe dir Schritt für Schritt! Keine Sorge, das ist nur Spielgeld. 🎮\n\n**Dein virtuelles Budget:** €500\n\n📈 **Beliebte Aktien bei Anfängern:**\n• Apple (AAPL) - €178 - Tech-Riese\n• Nike (NKE) - €98 - Sportmarke\n• Disney (DIS) - €95 - Entertainment\n\nWelche interessiert dich? Oder hast du eine andere Idee?",
        timestamp: Date.now(),
      }
    ],
    systemContext: "You're guiding a teenager through their first virtual stock trade. Budget: €500 play money. Popular picks: Apple €178, Nike €98, Disney €95. Explain what they're doing at each step. Make it educational and fun!"
  },

  smart_transfer: {
    id: "smart_transfer",
    name: "💸 Smart Transfer",
    description: "Multi-step transfer with AI assistance",
    category: "adult",
    initialMessages: [
      {
        id: "msg_smarttransfer_1",
        sender: "user",
        text: "Ich möchte 150€ an Max schicken",
        timestamp: Date.now() - 1000,
      },
      {
        id: "msg_smarttransfer_2",
        sender: "leo",
        text: "Klar, ich helfe dir dabei! 💸\n\n**Ich habe Max in deinen Kontakten gefunden:**\n• Max Müller (DE34 1234 5678 1234 5678 01)\n• Max Schmidt (DE45 9876 5432 1234 5678 02)\n\nWelchen Max meinst du?",
        timestamp: Date.now(),
      }
    ],
    systemContext: "The user wants to send €150 to 'Max'. You found two Max contacts. After they choose, confirm the transfer details and ask for a reference/reason. Then confirm and process. This is a multi-step conversational transfer flow."
  },

  investment_walkthrough: {
    id: "investment_walkthrough",
    name: "📚 Investment Guide",
    description: "Step-by-step investment tutorial",
    category: "both",
    initialMessages: [
      {
        id: "msg_investguide_1",
        sender: "user",
        text: "Ich möchte anfangen zu investieren, aber ich weiß nicht wie",
        timestamp: Date.now() - 1000,
      },
      {
        id: "msg_investguide_2",
        sender: "leo",
        text: "Super, dass du anfangen möchtest! 🌱 Ich führe dich Schritt für Schritt:\n\n**Schritt 1 von 4: Dein Risikoprofil**\n\nStell dir vor, du investierst €1.000 und nach einem Monat ist es nur noch €800 wert. Wie reagierst du?\n\nA) 😰 Sofort verkaufen - das ist mir zu riskant\nB) 😐 Abwarten und beobachten\nC) 😎 Nachkaufen - günstige Gelegenheit!\n\nWas passt zu dir?",
        timestamp: Date.now(),
      }
    ],
    systemContext: "You're guiding a beginner through their first investment journey in 4 steps: 1) Risk profile (A=conservative, B=moderate, C=aggressive), 2) Investment amount, 3) Investment type recommendation, 4) How to set up a savings plan. Be patient and educational."
  },

  savings_challenge: {
    id: "savings_challenge",
    name: "🏆 Savings Challenge",
    description: "Fun savings competition with rewards",
    category: "junior",
    initialMessages: [
      {
        id: "msg_challenge_1",
        sender: "leo",
        text: "🏆 **Neue Challenge verfügbar!**\n\n**\"7-Tage Spar-Sprint\"**\n\n💪 **Ziel:** 7 Tage lang jeden Tag mindestens €5 sparen\n\n🎁 **Belohnungen:**\n• Tag 3: +50 XP\n• Tag 5: Exklusives Badge \"Spar-Sprinter\"\n• Tag 7: +200 XP + Bonusverzinsung 0.5%\n\n👥 **12 andere Jugendliche** machen schon mit!\n\nBist du dabei? 🔥",
        timestamp: Date.now(),
      }
    ],
    notification: {
      title: "🏆 Neue Challenge!",
      message: "7-Tage Spar-Sprint startet - bist du dabei?",
      actionLabel: "Mitmachen",
    },
    systemContext: "You're offering a 7-day savings challenge. If they join, track their daily progress. Day 3: +50 XP, Day 5: badge, Day 7: +200 XP + bonus interest. Make it gamified and motivating!"
  }
};
