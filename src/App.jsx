import { useEffect, useState } from "react";
import api from "./api";
import { socket } from "./socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import Login from "./Login";
import Signup from "./Signup";
import "./Chat.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [showSignup, setShowSignup] = useState(false);

  const currentUserId = user?.id;

  // Load messages once logged in
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

  const sendMessage = async text => {
    await api.post("/messages", { text });
  };

  const handleDelete = async id => {
    await api.delete(`/messages/${id}`);
  };

  const handleEdit = async (id, text) => {
    await api.put(`/messages/${id}`, { text });
  };

  // 🔑 LOGIN / SIGNUP HANDLING
  if (!user) {
    return showSignup ? (
      <Signup
        onSignup={(data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }}
        onSwitch={() => setShowSignup(false)}
      />
    ) : (
      <Login
        onLogin={(data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }}
        onSwitch={() => setShowSignup(true)}
      />
    );
  }

  // 💬 CHAT UI
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
