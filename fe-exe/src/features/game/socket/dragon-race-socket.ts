import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/lib/api-client";
import { getAccessToken } from "@/features/auth/lib/auth-session";

export function createDragonRaceSocket(): Socket {
  return io(API_BASE_URL, {
    auth: {
      token: getAccessToken(),
    },
    transports: ["websocket"],
  });
}
