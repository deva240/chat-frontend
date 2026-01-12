import { useEffect, useState } from "react";
import api from "./api";
import socket from "./socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Chat({ currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get("/messages").then((res) => {
      setMessages(res.data);
    });

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
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

  const sendMessage = async (text) => {
    try {
      await api.post("/messages", { text });
      // socket will update UI
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const deleteMessage = async (id) => {
    await api.delete(`/messages/${id}`);
  };

  const editMessage = async (id, text) => {
    await api.put(`/messages/${id}`, { text });
  };

  return (
    <div>
      <MessageList
        messages={messages}
        currentUserId={currentUser.id}
        onDelete={deleteMessage}
        onEdit={editMessage}
      />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}

export default Chat;
