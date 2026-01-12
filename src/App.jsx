import { useEffect, useState } from "react";
import api from "./api";
import { socket } from "./socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import "./Chat.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const currentUserId = user?.id;

  // Load messages once
  useEffect(() => {
    if (!user) return;

    api.get("/messages")
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [user]);

  // Socket listeners
  useEffect(() => {
    socket.on("messageCreated", msg => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("messageUpdated", updated => {
      setMessages(prev =>
        prev.map(m => (m.id === updated.id ? updated : m))
      );
    });

    socket.on("messageDeleted", ({ id }) => {
      setMessages(prev => prev.filter(m => m.id !== id));
    });

    return () => {
      socket.off("messageCreated");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
    };
  }, []);

  // API calls (state is updated by socket)
  const sendMessage = async text => {
    await api.post("/messages", { text });
  };

  const handleDelete = async id => {
    await api.delete(`/messages/${id}`);
  };

  const handleEdit = async (id, text) => {
    await api.put(`/messages/${id}`, { text });
  };

  if (!user) {
    return <h3>Please login</h3>;
  }

  return (
    <div className="chat-container">
      <h2 className="chat-title">Realtime Chat</h2>

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <MessageInput onSend={sendMessage} />
    </div>
  );
}

export default App;
