
const socket = io("https://chat-backend-2nh2.onrender.com", {
  transports: ["websocket"],
});

export default socket;
