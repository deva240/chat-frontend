import { useEffect, useRef, useState } from "react";
import api from "./api";
import socket from "./socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Chat({ currentUser, onLogout }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Load messages + socket listeners
  useEffect(() => {
    api.get("/messages").then((res) => setMessages(res.data));

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

  // ✅ Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    await api.post("/messages", { text });
  };

  const editMessage = async (id, text) => {
    await api.put(`/messages/${id}`, { text });
  };

  const deleteMessage = async (id) => {
    await api.delete(`/messages/${id}`);
  };

  return (
    <div className="chat-wrapper">
      {/* ✅ HEADER ONLY HERE */}
      <div className="chat-header">
        <span>Realtime Chat</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="chat-container">
        <MessageList
          messages={messages}
          currentUsername={currentUser.username}
          onEdit={editMessage}
          onDelete={deleteMessage}
        />

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
  );
}

export default Chat;
