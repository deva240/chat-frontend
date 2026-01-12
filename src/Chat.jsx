import { useEffect, useState } from "react";
import socket from "./socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import api from "./api";

function Chat({ user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();

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
      socket.disconnect();
    };
  }, []);

  const sendMessage = async (text) => {
    await api.post("/messages", { text });
  };

  const deleteMessage = async (id) => {
    await api.delete(`/messages/${id}`);
  };

  const editMessage = async (id, text) => {
    await api.put(`/messages/${id}`, { text });
  };

  return (
    <>
      <MessageList
        messages={messages}
        currentUserId={user.id}
        onDelete={deleteMessage}
        onEdit={editMessage}
      />
      <MessageInput onSend={sendMessage} />
    </>
  );
}

export default Chat;
