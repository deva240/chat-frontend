import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { socket } from "./socket";
import api from "./api";

function MessageList({ currentUserId, onDelete, onEdit }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // 1️⃣ Load existing messages from backend
  useEffect(() => {
    api
      .get("/messages")
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
      });
  }, []);

  // 2️⃣ Listen for real-time messages via Socket.IO
  useEffect(() => {
    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);
  useEffect(() => {
  socket.on("delete_message", (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  });

  socket.on("edit_message", (msg) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? msg : m))
    );
  });

  return () => {
    socket.off("delete_message");
    socket.off("edit_message");
  };
}, []);


  // 3️⃣ Auto-scroll when messages change
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
          time={msg.created_at}
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
