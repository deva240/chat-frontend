import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { socket } from "./socket";
import api from "./api";

function MessageList({ currentUserId, onDelete, onEdit }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // 1️⃣ Load messages once
  useEffect(() => {
    api
      .get("/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Load messages error:", err));
  }, []);

  // 2️⃣ Real-time socket listeners
  useEffect(() => {
    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("delete_message", (id) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    });

    socket.on("edit_message", (updated) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
    });

    return () => {
      socket.off("new_message");
      socket.off("delete_message");
      socket.off("edit_message");
    };
  }, []);

  // 3️⃣ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ padding: "10px", overflowY: "auto" }}>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          id={msg.id}
          text={msg.text}
          time={msg.time}
          user_id={msg.user_id}
          username={msg.username}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
