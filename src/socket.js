import { io } from "socket.io-client";

const socket = io("https://chat-backend-2nh2.onrender.com");

export default socket;
