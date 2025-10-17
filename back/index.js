import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";

import { autoSubscribe } from "./api/chat.subscriber.js";


dotenv.config({ path: "./.env" });

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connecté`);

  socket.on("message", (msg) => {
    console.log(`(${socket.id}) ->`, msg);
    socket.emit("echo", `Echo: ${msg}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client ${socket.id} déconnecté: ${reason}`);
  });
});

app.post("/chat", (req, res) => {
  const payload = req.body || {};
  console.log("chat reçu:", payload);

  io.emit("message", payload);

  res.status(200).json({ ok: true });
});


app.get("/health", (_req, res) => res.json({ ok: true }));

server.listen(PORT, () => {
  console.log(`Client prêt sur http://localhost:${PORT}`);
  autoSubscribe({serviceUrl: process.env.SERVICE_URL, port: PORT, intervalMs: 15000});
});
