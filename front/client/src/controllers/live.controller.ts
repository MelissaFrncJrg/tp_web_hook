import { SocketService } from "../services/socket.service";
import { log } from "../ui/dom";

export class LiveController {
  private socket = new SocketService();

  init() {
    this.socket.connect({
      onConnect: (id) => log(`Connecté au serveur (${id})`),
      onDisconnect: (reason) => log(`Déconnecté (${reason})`),
      onError: (err) => log(`Erreur WS: ${err.message}`),
      onMessage: (payload) => log(payload),
      onEcho: (payload) => log(`Echo: ${payload}`),
    });
  }
}