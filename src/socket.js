import { io } from "socket.io-client";

export const socket = io(
  "https://chat-backend-2nh2.onrender.com",
  {
    transports: ["websocket"],
  }
);
