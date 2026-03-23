import { useState, useEffect, useCallback, useRef } from "react";

type MessageHandler = (msg: Record<string, unknown>) => void;

interface UseKahootSocketReturn {
  connected: boolean;
  send: (data: Record<string, unknown>) => void;
  onMessage: (handler: MessageHandler) => () => void;
  disconnect: () => void;
}

export function useKahootSocket(): UseKahootSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Set<MessageHandler>>(new Set());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/kahoot`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        for (const handler of Array.from(handlersRef.current)) {
          handler(msg);
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, []);

  const send = useCallback((data: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const onMessage = useCallback((handler: MessageHandler) => {
    handlersRef.current.add(handler);
    return () => { handlersRef.current.delete(handler); };
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  return { connected, send, onMessage, disconnect };
}
