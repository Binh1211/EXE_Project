import { createServer } from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { registerGameRoomSocket } from "./socket/game-room.socket.js";

async function bootstrap() {
  await connectDatabase();
  const app = createApp();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  registerGameRoomSocket(io);

  httpServer.listen(env.port, () => {
    console.log(`API running at http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
