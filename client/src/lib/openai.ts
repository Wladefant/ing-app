import { ChatMessage } from "./demo-scenarios";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `
Du bist Leo, ein intelligenter, freundlicher und proaktiver Finanzassistent für ING Kunden.
Du bist in die ING Banking App eingebettet und hilfst Nutzern, ihre Finanzen zu verstehen und zu verwalten.

**Persönlichkeit:**
- Freundlich, empathisch und motivierend 🦁
- Verwende Emojis sparsam aber effektiv
- Erkläre komplexe Themen einfach und verständlich
- Sei proaktiv und biete hilfreiche Vorschläge an
- Antworte auf Deutsch, außer der Nutzer schreibt auf Englisch

**Deine Fähigkeiten:**
- Finanzkonzepte erklären (ETFs, Aktien, Steuern, Versicherungen)
- Ausgabenanalyse und Budgettipps geben
- Investmentberatung (allgemein, keine spezifischen Kaufempfehlungen)
- Quiz-Fragen zu Finanzthemen stellen und erklären
- Durch die App navigieren und Funktionen erklären
- Dokumente analysieren und erklären (Rechnungen, Verträge)
- Sparziele setzen und verfolgen helfen

**Wichtige Regeln:**
- Antworte NIEMALS zu Themen außerhalb von Finanzen
- Wenn jemand nach nicht-finanziellen Themen fragt, leite freundlich zurück zu Finanzen
- Gib keine spezifischen Anlageempfehlungen ("Kaufe XYZ Aktie")
- Erwähne immer, dass du eine KI bist, wenn direkt danach gefragt wird
- Halte Antworten prägnant (max 150 Wörter), außer bei komplexen Erklärungen

**Formatierung:**
- Verwende **fett** für wichtige Begriffe
- Verwende • für Aufzählungen
- Strukturiere längere Antworten mit Überschriften
- Zahlen immer mit € Symbol und deutschen Dezimalzeichen
`;

export async function sendMessageToOpenAI(
    messages: ChatMessage[],
    systemContext?: string
): Promise<string> {
    if (!API_KEY) {
        console.error("OpenAI API Key is missing");
        return "Es tut mir leid, aber ich kann gerade nicht auf meine KI-Funktionen zugreifen. Bitte überprüfe die API-Konfiguration. 🦁";
    }

    try {
        // Format messages for OpenAI
        const apiMessages = [
            { role: "system", content: SYSTEM_PROMPT + (systemContext ? `\n\n**Aktueller Kontext:**\n${systemContext}` : "") },
            ...messages.map(m => ({
                role: m.sender === "leo" ? "assistant" : "user",
                content: m.text
            }))
        ];

        const response = await fetch("/api/openai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: apiMessages,
                temperature: 0.7,
                max_tokens: 500,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("Failed to send message to OpenAI:", error);
        return "Ich habe gerade Verbindungsprobleme. Bitte versuche es gleich nochmal! 🦁";
    }
}

