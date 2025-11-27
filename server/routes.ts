import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // OpenAI proxy endpoint to avoid CORS issues
  app.post("/api/openai/chat/completions", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      
      if (!apiKey) {
        return res.status(401).json({ error: "Missing API key" });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.json(data);
    } catch (error) {
      console.error("OpenAI proxy error:", error);
      return res.status(500).json({ error: "Failed to proxy request to OpenAI" });
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
