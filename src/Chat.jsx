import { useEffect, useState } from "react";
import api from "./api";
import socket from "./socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Chat({ currentUser }) {
  const [messages, setMessages] = useState([]);

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

  const sendMessage = async (text) => {
    await api.post("/messages", {
      text,
      userId: currentUser.id,
    });
  };

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
        currentUserId={currentUser.id}
        onEdit={editMessage}
        onDelete={deleteMessage}
      />
      <MessageInput onSend={sendMessage} />
    </>
  );
}

export default Chat;
