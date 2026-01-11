import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import api from "./api";
import { socket } from "./socket";

function Chat({ currentUser }) {
  const [messages, setMessages] = useState([]);

  // Load messages once
  useEffect(() => {
    api.get("/messages").then((res) => {
      setMessages(res.data);
    });
  }, []);

  // 🔥 Socket real-time updates
  useEffect(() => {
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("edit_message", (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? msg : m))
      );
    });

    socket.on("delete_message", (id) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    });

    return () => {
      socket.off("new_message");
      socket.off("edit_message");
      socket.off("delete_message");
    };
  }, []);

  return (
    <div>
      <MessageList
        messages={messages}
        currentUserId={currentUser.id}
      />
      <MessageInput />
    </div>
  );
}

export default Chat;
