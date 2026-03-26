import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// Initialize OpenAI client with server-side API key
// Note: VITE_ prefix is used because the key was originally for client-side
export const getOpenAIClient = () => {
  const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey });
};

// Define available functions for the AI agent
const AGENT_FUNCTIONS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "show_stock_widget",
      description: "Display a stock widget with current price and trading options. Use when user asks about a specific stock.",
      parameters: {
        type: "object",
        properties: {
          symbol: { type: "string", description: "Stock symbol (e.g., AAPL, ING, TSLA)" },
          analysis: { type: "string", description: "Brief analysis of the stock" }
        },
        required: ["symbol"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "show_transfer_widget",
      description: "Display a transfer/payment widget to SEND money to another person. Use when user says 'send', 'überweisen', 'transfer', 'pay someone', 'schick Geld', or mentions sending euros to a specific person (e.g. 'send 50 to Ben'). This is for OUTGOING payments to a recipient, NOT for analyzing spending.",
      parameters: {
        type: "object",
        properties: {
          recipient: { type: "string", description: "Name of the recipient" },
          amount: { type: "number", description: "Amount in EUR" },
          reference: { type: "string", description: "Payment reference/description" }
        },
        required: ["recipient", "amount"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "start_quiz",
      description: "Start an educational finance quiz. Use when user wants to learn or play a quiz.",
      parameters: {
        type: "object",
        properties: {
          topic: { type: "string", description: "Quiz topic (e.g., Aktien, ETFs, Steuern, Zinsen, Sparen)" },
          difficulty: { type: "string", enum: ["einfach", "mittel", "schwer"], description: "Difficulty level" },
          questions: { type: "number", description: "Number of questions (1-5)" }
        },
        required: ["topic"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "show_achievement",
      description: "Show an achievement/badge unlock animation. Use for celebrating milestones.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Achievement name" },
          xp: { type: "number", description: "XP points awarded" },
          description: { type: "string", description: "What the user did to earn it" }
        },
        required: ["name", "xp"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "show_savings_goal",
      description: "Display savings goal progress. Use when discussing savings or goals.",
      parameters: {
        type: "object",
        properties: {
          goalName: { type: "string", description: "Name of the savings goal" },
          targetAmount: { type: "number", description: "Target amount in EUR" },
          currentAmount: { type: "number", description: "Current saved amount in EUR" },
          weeksRemaining: { type: "number", description: "Estimated weeks to reach goal" }
        },
        required: ["goalName", "targetAmount", "currentAmount"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "show_spending_chart",
      description: "Display a spending ANALYSIS chart showing where money was spent by category. ONLY use when user explicitly asks to analyze their spending (e.g. 'Ausgabenanalyse', 'wo geht mein Geld hin', 'how did I spend'). Do NOT use for: sending money (use show_transfer_widget), buying/selling stocks (use show_stock_widget), or any other request.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "Spending category to highlight" },
          amount: { type: "number", description: "Amount spent" },
          percentChange: { type: "number", description: "Percent change from previous period" },
          breakdown: { 
            type: "array", 
            items: { 
              type: "object",
              properties: {
                name: { type: "string" },
                amount: { type: "number" }
              }
            },
            description: "Breakdown of spending" 
          }
        },
        required: ["category", "amount"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "navigate_to_screen",
      description: "Navigate to a specific screen in the app. Use when user wants to go somewhere.",
      parameters: {
        type: "object",
        properties: {
          screen: { 
            type: "string", 
            enum: ["dashboard", "invest", "transfer", "subscriptions", "statistics", "savings", "quiz", "profile", "settings"],
            description: "Screen to navigate to" 
          }
        },
        required: ["screen"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_portfolio_data",
      description: "Get the user's current portfolio and investment data. Use to answer questions about their investments.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_account_balance",
      description: "Get the user's current account balances. Use to answer questions about their money.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_recent_transactions",
      description: "Get the user's recent transactions. Use to analyze spending or find specific payments.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "Optional category filter" },
          limit: { type: "number", description: "Number of transactions to return" }
        },
        required: []
      }
    }
  }
];

// Mock user data for agent context
const USER_DATA = {
  profile: {
    name: "Max Mustermann",
    type: "adult", // or "junior"
    age: 35,
    riskProfile: "moderat",
    investmentHorizon: "5+ Jahre"
  },
  accounts: {
    girokonto: { balance: 2101.10, iban: "DE10 1234 5678 1234 5678 90" },
    extraKonto: { balance: 19240.48, iban: "DE12 5001 0517 1234 5678 66", interestRate: 1.5 },
    depot: { value: 12704.96, holdings: [
      { symbol: "AAPL", name: "Apple", shares: 15, value: 2677.50, change: 1.5 },
      { symbol: "MSFT", name: "Microsoft", shares: 10, value: 3789.00, change: 1.1 },
      { symbol: "ING", name: "ING Groep", shares: 200, value: 2490.00, change: 1.2 },
      { symbol: "VUSA", name: "Vanguard S&P 500", shares: 25, value: 3748.46, change: 0.8 }
    ]}
  },
  recentTransactions: [
    { date: "2024-01-15", description: "Gehalt", amount: 3500, category: "income" },
    { date: "2024-01-14", description: "REWE", amount: -67.43, category: "groceries" },
    { date: "2024-01-13", description: "Netflix", amount: -17.99, category: "subscriptions" },
    { date: "2024-01-12", description: "Vapiano", amount: -45.00, category: "restaurant" },
    { date: "2024-01-11", description: "Spotify", amount: -9.99, category: "subscriptions" },
    { date: "2024-01-10", description: "Amazon", amount: -89.99, category: "shopping" },
    { date: "2024-01-09", description: "Tankstelle", amount: -75.00, category: "transport" },
    { date: "2024-01-08", description: "Lieferando", amount: -32.50, category: "restaurant" }
  ],
  subscriptions: [
    { name: "Netflix Premium", amount: 17.99, lastUsed: "2024-01-10" },
    { name: "Netflix Standard", amount: 12.99, lastUsed: "2023-09-15" }, // duplicate! user forgot to cancel old plan
    { name: "Spotify", amount: 9.99, lastUsed: "2024-01-15" },
    { name: "Amazon Prime", amount: 8.99, lastUsed: "2024-01-12" }
  ],
  savingsGoals: [
    { name: "Urlaub Spanien", target: 2000, saved: 1240, deadline: "2024-06-01" },
    { name: "Notgroschen", target: 5000, saved: 3200, deadline: null }
  ],
  juniorData: {
    level: 5,
    xp: 1240,
    streak: 12,
    badges: ["spar-anfänger", "quiz-meister", "erste-aktie", "sparplan-held"],
    weeklyRank: 42,
    virtualBalance: 145.50
  }
};

// Function to execute agent tools
function executeAgentTool(toolName: string, args: any): any {
  switch (toolName) {
    case "get_portfolio_data": {
      const portfolioData = {
        totalValue: USER_DATA.accounts.depot.value,
        holdings: USER_DATA.accounts.depot.holdings,
        todayChange: "+€45.20 (+0.36%)",
        yearChange: "+€1,560 (+14.0%)"
      };
      // Return both the data for AI context AND an action to show the widget
      return { action: "get_portfolio_data", data: portfolioData, ...portfolioData };
    }
    
    case "get_account_balance":
      return {
        total: USER_DATA.accounts.girokonto.balance + USER_DATA.accounts.extraKonto.balance + USER_DATA.accounts.depot.value,
        girokonto: USER_DATA.accounts.girokonto.balance,
        extraKonto: USER_DATA.accounts.extraKonto.balance,
        depot: USER_DATA.accounts.depot.value
      };
    
    case "get_recent_transactions":
      let transactions = USER_DATA.recentTransactions;
      if (args.category) {
        transactions = transactions.filter(t => t.category === args.category);
      }
      if (args.limit) {
        transactions = transactions.slice(0, args.limit);
      }
      return { transactions };
    
    case "show_stock_widget":
      return { action: "show_stock_widget", data: args };

    case "show_transfer_widget":
      return { action: "show_transfer_widget", data: args };

    case "start_quiz":
      return { action: "start_quiz", data: args };

    case "show_achievement":
      return { action: "show_achievement", data: args };

    case "show_savings_goal":
      return { action: "show_savings_goal", data: args };

    case "show_spending_chart": {
      // Build spending breakdown from actual transaction data
      const categoryTotals: Record<string, number> = {};
      USER_DATA.recentTransactions
        .filter(t => t.amount < 0)
        .forEach(t => {
          const cat = t.category === "subscriptions" ? "Abos" :
                      t.category === "groceries" ? "Lebensmittel" :
                      t.category === "restaurant" ? "Restaurant" :
                      t.category === "shopping" ? "Shopping" :
                      t.category === "transport" ? "Transport" : "Sonstiges";
          categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
        });
      const breakdown = Object.entries(categoryTotals)
        .map(([name, amount]) => ({ name, amount: Math.round(amount * 100) / 100 }))
        .sort((a, b) => b.amount - a.amount);
      const totalSpent = breakdown.reduce((s, b) => s + b.amount, 0);
      return {
        action: "show_spending_chart",
        data: {
          category: "Ausgaben diesen Monat",
          amount: Math.round(totalSpent * 100) / 100,
          percentChange: 8,
          breakdown,
        },
      };
    }

    case "navigate_to_screen":
      // These return the widget data to be rendered on the client
      return { action: toolName, data: args };
    
    default:
      return { error: "Unknown tool" };
  }
}

// System prompt for Leo AI Agent
const LEO_SYSTEM_PROMPT = `
Du bist Leo, ein intelligenter, freundlicher und proaktiver Finanzassistent für ING Kunden.
Du bist ein vollwertiger AI-Agent mit Zugang zu den Finanzdaten des Nutzers und kannst Aktionen ausführen.

**Persönlichkeit:**
- Freundlich, empathisch und motivierend 🦁
- Verwende Emojis sparsam aber effektiv
- Erkläre komplexe Themen einfach und verständlich
- Sei proaktiv und biete hilfreiche Vorschläge an
- Antworte auf Deutsch, außer der Nutzer schreibt auf Englisch

**WICHTIG - TOOL-NUTZUNG:**
Du MUSST die verfügbaren Tools nutzen wenn sie zur Anfrage passen:

1. Wenn der Nutzer nach einer AKTIE fragt → IMMER show_stock_widget aufrufen
2. Wenn der Nutzer eine Aktie KAUFEN oder VERKAUFEN will ("sell my stock", "buy Apple", "Aktie verkaufen") → show_stock_widget aufrufen mit der Aktie. KEIN anderes Widget verwenden.
3. Wenn der Nutzer Geld SENDEN/ÜBERWEISEN will (z.B. "send 50 to Ben", "überweise an...", "schick Geld an...") → IMMER show_transfer_widget aufrufen, NIEMALS show_spending_chart
4. Wenn der Nutzer ein QUIZ will → IMMER start_quiz aufrufen
5. Wenn der Nutzer sein PORTFOLIO sehen will → get_portfolio_data aufrufen (das Widget wird automatisch angezeigt)
6. Wenn der Nutzer KONTOSTAND fragt → get_account_balance aufrufen
7. Wenn der Nutzer SPARZIELE besprechen will → show_savings_goal aufrufen
8. Wenn der Nutzer AUSGABEN analysieren will (z.B. "Ausgabenanalyse", "wo geht mein Geld hin", "how did I spend") → show_spending_chart aufrufen
9. Bei Ausgaben: show_spending_chart gibt dir die echten Zahlen — VERWENDE die Zahlen aus dem Tool-Ergebnis, erfinde KEINE eigenen

**WICHTIG — show_spending_chart NUR verwenden wenn der Nutzer explizit nach Ausgabenanalyse fragt. NIEMALS bei Überweisungen, Aktien-Kauf/Verkauf, oder anderen Anfragen.**

**Bekannte Abo-Probleme:**
- Der Nutzer hat ein DOPPELTES Netflix-Abo: Netflix Premium (€17,99) UND Netflix Standard (€12,99). Das Standard-Abo wurde seit September nicht genutzt. Das sind €155,88/Jahr verschwendet.
- Wenn nach Abos/Subscriptions gefragt wird: Erwähne IMMER das doppelte Netflix.

**Deine Agent-Fähigkeiten:**
- Du kannst auf Kontodaten, Portfolio und Transaktionen zugreifen
- Du kannst Widgets anzeigen (Aktien, Überweisungen, Charts, Sparziele)
- Du kannst Quizze starten und Achievements vergeben
- Du kannst durch die App navigieren
- Du kannst Ausgaben analysieren und Spartipps geben

**Wichtige Regeln:**
- Nutze IMMER die passenden Tools - verweise NICHT auf die App!
- Du HAST Zugriff auf alle Daten - behaupte NICHT, du hättest keinen Zugriff
- Bei Aktien-Fragen: Zeige IMMER das Widget mit dem Kurs
- Halte Antworten KURZ und prägnant (max 3-4 Sätze, NIEMALS mehr als 80 Wörter)
- Bei Portfolio-Fragen: Fasse die Performance in 2-3 Sätzen zusammen. KEIN langer Markdown. Das Widget zeigt die Details.
- Verwende KEINE Markdown-Überschriften (##) oder Code-Blöcke in normalen Antworten

**Aktueller Nutzer-Kontext:**
- Name: ${USER_DATA.profile.name}
- Typ: ${USER_DATA.profile.type}
- Girokonto: €${USER_DATA.accounts.girokonto.balance.toFixed(2)}
- Extra-Konto: €${USER_DATA.accounts.extraKonto.balance.toFixed(2)}
- Depot-Wert: €${USER_DATA.accounts.depot.value.toFixed(2)}
- Aktien im Depot: ${USER_DATA.accounts.depot.holdings.map(h => h.symbol).join(', ')}
- Aktive Abos: ${USER_DATA.subscriptions.length} (${USER_DATA.subscriptions.map(s => s.name).join(', ')})
`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // OpenAI Chat Completions endpoint - Full AI Agent with Function Calling
  app.post("/api/openai/chat", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("OpenAI API key not set in environment");
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const openai = getOpenAIClient();
      const { messages, systemContext, userType } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Build context-aware system prompt
      let fullSystemPrompt = LEO_SYSTEM_PROMPT;
      if (systemContext) {
        fullSystemPrompt += `\n\n**Zusätzlicher Kontext:**\n${systemContext}`;
      }
      if (userType === "junior") {
        fullSystemPrompt += `\n\n**WICHTIG: Dies ist ein Junior-Nutzer (Teenager). Erkläre alles sehr einfach und spielerisch!**`;
      }

      // Format messages for OpenAI
      const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: fullSystemPrompt },
        ...messages.map((m: any) => ({
          role: (m.sender === "leo" ? "assistant" : "user") as "assistant" | "user",
          content: m.text
        }))
      ];

      // First API call with function calling
      console.log("[Leo Agent] Calling OpenAI with", apiMessages.length, "messages and", AGENT_FUNCTIONS.length, "tools");
      
      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: apiMessages,
        tools: AGENT_FUNCTIONS,
        tool_choice: "auto",
        temperature: 0.7,
        max_completion_tokens: 800,
      });

      const responseMessage = completion.choices[0]?.message;
      console.log("[Leo Agent] Response received, tool_calls:", responseMessage?.tool_calls?.length || 0);
      
      // Check if there are function calls
      if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
        const toolResults: any[] = [];
        const widgetActions: any[] = [];

        // Execute each tool call
        for (const toolCall of responseMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          
          console.log(`[Agent] Executing tool: ${functionName}`, functionArgs);
          
          const result = executeAgentTool(functionName, functionArgs);
          
          // If it's a widget action, store it separately
          if (result.action) {
            widgetActions.push(result);
          }
          
          toolResults.push({
            tool_call_id: toolCall.id,
            role: "tool" as const,
            content: JSON.stringify(result)
          });
        }

        // Second API call with tool results
        const secondCompletion = await openai.chat.completions.create({
          model: "gpt-5.2",
          messages: [
            ...apiMessages,
            responseMessage,
            ...toolResults
          ],
          temperature: 0.7,
          max_completion_tokens: 500,
        });

        const finalResponse = secondCompletion.choices[0]?.message?.content || 
          "Ich habe die Informationen für dich zusammengestellt!";

        return res.json({ 
          response: finalResponse,
          widgets: widgetActions,
          usage: completion.usage
        });
      }

      // No function calls - just return the text response
      const responseText = responseMessage?.content || 
        "Entschuldigung, ich konnte keine Antwort generieren.";
      
      return res.json({ 
        response: responseText,
        widgets: [],
        usage: completion.usage
      });
    } catch (error) {
      console.error("OpenAI API error:", error);
      if (error instanceof OpenAI.APIError) {
        return res.status(error.status || 500).json({ 
          error: error.message,
          code: error.code
        });
      }
      return res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Agent Action Endpoint - Execute actions from AI
  app.post("/api/agent/action", async (req: Request, res: Response) => {
    try {
      const { action, data } = req.body;
      
      console.log(`[Agent Action] ${action}`, data);
      
      // Execute the action and return result
      const result = executeAgentTool(action, data);
      
      return res.json({ success: true, result });
    } catch (error) {
      console.error("Agent action error:", error);
      return res.status(500).json({ error: "Failed to execute action" });
    }
  });

  // Get User Context - Provides full context to the agent
  app.get("/api/agent/context", async (req: Request, res: Response) => {
    return res.json({
      profile: USER_DATA.profile,
      accounts: {
        total: USER_DATA.accounts.girokonto.balance + 
               USER_DATA.accounts.extraKonto.balance + 
               USER_DATA.accounts.depot.value,
        girokonto: USER_DATA.accounts.girokonto,
        extraKonto: USER_DATA.accounts.extraKonto,
        depot: USER_DATA.accounts.depot
      },
      recentTransactions: USER_DATA.recentTransactions.slice(0, 5),
      subscriptions: USER_DATA.subscriptions,
      savingsGoals: USER_DATA.savingsGoals,
      juniorData: USER_DATA.juniorData
    });
  });

  // Quiz Generation endpoint - generates quiz questions with AI
  app.post("/api/quiz/generate", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const openai = getOpenAIClient();
      const { topic, difficulty, count = 7, context } = req.body;

      const difficultyInstructions: Record<string, string> = {
        einfach: "Fragen sollten grundlegende Konzepte abfragen. Einfache Definitionen und Ja/Nein-Wissen.",
        mittel: "Fragen sollten Zusammenhänge erfordern. 'Was passiert wenn...', 'Welche Strategie ist besser wenn...'",
        schwer: "Fragen sollten kritisches Denken erfordern. Szenarien mit Berechnungen, Vergleiche zwischen Strategien, Fallstricke erkennen.",
      };

      const quizPrompt = `
Du bist ein Quiz-Master für ein Live-Kahoot-Spiel über Finanzen. Die Teilnehmer sind junge Erwachsene (16-29 Jahre).

Erstelle ${count} Multiple-Choice-Fragen zum Thema "${topic || 'Finanzen allgemein'}".
${context ? `Kontext: ${context}` : ''}

SCHWIERIGKEIT: ${difficulty || 'mittel'}
${difficultyInstructions[difficulty || 'mittel'] || difficultyInstructions.mittel}

WICHTIG — Qualitätsregeln:
1. PROGRESSIVE SCHWIERIGKEIT: Die ersten 2 Fragen einfacher, dann steigend
2. SZENARIO-BASIERT: Mindestens 3 Fragen mit konkreten Szenarien ("Lisa hat 500€ und möchte...")
3. PLAUSIBLE FALSCHANTWORTEN: Falsche Antworten müssen auf den ersten Blick richtig klingen
4. ABWECHSLUNG: Mix aus Definitionen, Szenarien, "Was stimmt NICHT?", Berechnungen
5. KEINE trivialen Fragen wie "Was ist Geld?" — jede Frage soll zum Nachdenken anregen
6. PRAXISBEZUG: Fragen zu echten Situationen die Jugendliche erleben (erster Job, Taschengeld investieren, Handyvertrag)

Antworte NUR mit einem JSON-Array:
[
  {
    "id": 1,
    "question": "Die Frage",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Kurze Erklärung (1-2 Sätze)"
  }
]

correctAnswer = Index (0-3) der richtigen Option.
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: quizPrompt },
          { role: "user", content: `Erstelle ${count} Quiz-Fragen zum Thema: ${topic || 'Finanzgrundlagen'}` }
        ],
        temperature: 0.8,
        max_completion_tokens: 3000,
      });

      const responseText = completion.choices[0]?.message?.content || "[]";
      
      // Parse the JSON response
      try {
        // Extract JSON from response (in case there's extra text)
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        return res.json({ questions });
      } catch (parseError) {
        console.error("Failed to parse quiz JSON:", parseError);
        return res.json({ questions: [], error: "Failed to parse quiz questions" });
      }
    } catch (error) {
      console.error("Quiz generation error:", error);
      return res.status(500).json({ error: "Failed to generate quiz" });
    }
  });

  // Image Generation endpoint for quiz images
  app.post("/api/image/generate", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const openai = getOpenAIClient();
      const { prompt, size = "256x256" } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: `Simple, clean illustration for a finance education app: ${prompt}. Style: minimalist, friendly, suitable for teenagers.`,
        n: 1,
        size: size as "256x256" | "512x512" | "1024x1024",
      });

      return res.json({ 
        imageUrl: response.data[0]?.url,
        revisedPrompt: response.data[0]?.revised_prompt
      });
    } catch (error) {
      console.error("Image generation error:", error);
      return res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Stock data endpoint (mock data for demo)
  app.get("/api/stocks/:symbol", async (req: Request, res: Response) => {
    const { symbol } = req.params;
    
    // Mock stock data
    const stockData: Record<string, any> = {
      AAPL: { name: "Apple Inc.", price: 178.50, change: 2.3, changePercent: 1.3 },
      GOOGL: { name: "Alphabet Inc.", price: 138.20, change: -1.5, changePercent: -1.1 },
      MSFT: { name: "Microsoft Corp.", price: 378.90, change: 4.2, changePercent: 1.1 },
      TSLA: { name: "Tesla Inc.", price: 245.60, change: -8.3, changePercent: -3.3 },
      ING: { name: "ING Groep N.V.", price: 12.45, change: 0.15, changePercent: 1.2 },
      AMZN: { name: "Amazon.com Inc.", price: 178.90, change: 3.2, changePercent: 1.8 },
      NFLX: { name: "Netflix Inc.", price: 485.20, change: -5.1, changePercent: -1.0 },
    };

    const stock = stockData[symbol.toUpperCase()];
    if (stock) {
      return res.json({ symbol: symbol.toUpperCase(), ...stock });
    }
    return res.status(404).json({ error: "Stock not found" });
  });

  // User profile endpoint (mock)
  app.get("/api/profile", async (req: Request, res: Response) => {
    return res.json({
      name: "Max Mustermann",
      type: "adult",
      balance: 21341.58,
      accounts: [
        { type: "girokonto", balance: 2101.10, iban: "DE10 1234 5678 1234 5678 90" },
        { type: "extra-konto", balance: 19240.48, iban: "DE12 5001 0517 1234 5678 66" }
      ],
      points: 1240,
      streak: 12
    });
  });

  return httpServer;
}
