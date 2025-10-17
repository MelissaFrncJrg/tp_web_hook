import { ChatSocket } from "../chat/chat.socket.js";

export class ChatController {
  static async post(req, res) {
    const payload = req.body ?? {};
    console.log("Webhook /chat reçu:", payload);

    ChatSocket.INSTANCE.send(payload);

    res.status(200).json({ ok: true });
  }
}
