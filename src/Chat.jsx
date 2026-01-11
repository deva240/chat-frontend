import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import api from "./api";
import { socket } from "./socket";

function Chat({ currentUser, onSend, onEdit, onDelete }) {
  const [messages, setMessages] = useState([]);

  // Load messages once
  useEffect(() => {
    api.get("/messages").then((res) => {
      setMessages(res.data);
    });
  }, []);

  // 🔥 SOCKET EVENTS (MATCH BACKEND EXACTLY)
  useEffect(() => {
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("edit_message", (updated) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>

      <MessageInput onSend={onSend} />
    </div>
  );
}

export default Chat;
