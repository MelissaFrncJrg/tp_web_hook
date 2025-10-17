import { io, Socket } from "socket.io-client";

export type SocketHandlers = {
  onConnect?: (id: string) => void;
  onDisconnect?: (reason: string) => void;
  onError?: (err: Error) => void;
  onMessage?: (payload: unknown) => void;
  onEcho?: (payload: unknown) => void;
};

export class SocketService {
  private socket: Socket | null = null;

  connect(handlers: SocketHandlers = {}) {
    const BACK_URL = import.meta.env.VITE_BACK_URL;

    console.log("BACK_URL =", BACK_URL);

    if (!BACK_URL) {
      handlers.onError?.(new Error("VITE_BACK_URL manquante"));
      return;
    }

    this.socket = io(BACK_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      const id = this.socket?.id;
      if (id) handlers.onConnect?.(id);
    });
    this.socket.on("disconnect", (reason) => handlers.onDisconnect?.(reason));
    this.socket.on("connect_error", (err) => handlers.onError?.(err));

    this.socket.on("message", (payload) => handlers.onMessage?.(payload));
    this.socket.on("echo", (payload) => handlers.onEcho?.(payload));
  }
}
