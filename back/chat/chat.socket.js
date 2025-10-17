import { Server } from "socket.io";

export class ChatSocket {
  static INSTANCE = new ChatSocket();
  static OUT = "message";
  static IN = "message";
  static CORS = { origin: "*" };

  io;

  setup(httpServer) {
    this.io = new Server(httpServer, { cors: ChatSocket.CORS });
    this.io.on("connection", (socket) => this.onConnected(socket));
  }

  send(message) {
    console.log(">>> broadcast:", message);
    this.io.emit(ChatSocket.OUT, message);
  }

  onConnected(socket) {
    console.log(`Client ${socket.id} connecté`);
    socket.on(ChatSocket.IN, (message) => this.onMessage(socket, message));
    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} déconnecté: ${reason}`);
    });
  }

  onMessage(socket, message) {
    console.log(`(${socket.id}) Message reçu :`, message);
    socket.emit("echo", `Echo: ${message}`);
  }
}
