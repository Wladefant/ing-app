import { ChatMessage } from "./demo-scenarios";

// Widget action types that the AI agent can trigger
export interface WidgetAction {
    action: string;
    data: any;
}

export interface AgentResponse {
    response: string;
    widgets: WidgetAction[];
}

export async function sendMessageToOpenAI(
    messages: ChatMessage[],
    systemContext?: string,
    userType?: "adult" | "junior"
): Promise<AgentResponse> {
    try {
        const response = await fetch("/api/openai/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages,
                systemContext,
                userType
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            response: data.response,
            widgets: data.widgets || []
        };

    } catch (error) {
        console.error("Failed to send message to OpenAI:", error);
        return {
            response: "Ich habe gerade Verbindungsprobleme. Bitte versuche es gleich nochmal! 🦁",
            widgets: []
        };
    }
}

// Get user context for the AI agent
export async function getAgentContext(): Promise<any> {
    try {
        const response = await fetch("/api/agent/context");
        if (!response.ok) throw new Error("Failed to fetch context");
        return await response.json();
    } catch (error) {
        console.error("Failed to get agent context:", error);
        return null;
    }
}

// Execute an agent action
export async function executeAgentAction(action: string, data: any): Promise<any> {
    try {
        const response = await fetch("/api/agent/action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, data })
        });
        if (!response.ok) throw new Error("Failed to execute action");
        return await response.json();
    } catch (error) {
        console.error("Failed to execute agent action:", error);
        return null;
    }
}

// Quiz Generation API
export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    imagePrompt?: string | null;
    imageUrl?: string;
}

export async function generateQuizQuestions(
    topic: string,
    difficulty: "einfach" | "mittel" | "schwer" = "mittel",
    count: number = 3,
    context?: string
): Promise<QuizQuestion[]> {
    try {
        const response = await fetch("/api/quiz/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                topic,
                difficulty,
                count,
                context
            })
        });

        if (!response.ok) {
            throw new Error("Failed to generate quiz");
        }

        const data = await response.json();
        return data.questions || [];
    } catch (error) {
        console.error("Quiz generation failed:", error);
        return [];
    }
}

// Image Generation API
export async function generateImage(prompt: string): Promise<string | null> {
    try {
        const response = await fetch("/api/image/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, size: "256x256" })
        });

        if (!response.ok) {
            throw new Error("Failed to generate image");
        }

        const data = await response.json();
        return data.imageUrl || null;
    } catch (error) {
        console.error("Image generation failed:", error);
        return null;
    }
}
