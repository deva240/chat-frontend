import { useEffect, useState } from "react";
import api from "./api";
import socket from "./socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Chat({ currentUser }) {
  const [messages, setMessages] = useState([]);

  // Load existing messages
  useEffect(() => {
    api
      .get("/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Load messages failed", err));
  }, []);

  // Realtime listeners
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

  // Send message (DO NOT manually add to state)
const sendMessage = async (text) => {
  try {
    const res = await api.post("/messages", { text });

    // ✅ IMMEDIATELY add message to UI
    setMessages((prev) => [...prev, res.data]);
  } catch (err) {
    console.error("Send message failed:", err);
  }
};


  // These will work once backend routes are added
  const editMessage = async (id, text) => {
    await api.put(`/messages/${id}`, { text });
  };

  const deleteMessage = async (id) => {
    await api.delete(`/messages/${id}`);
  };

  return (
    <>
      <MessageList
        messages={messages}
        currentUsername={currentUser.username}
        onEdit={editMessage}
        onDelete={deleteMessage}
      />
      <MessageInput onSend={sendMessage} />
    </>
  );
}

export default Chat;
