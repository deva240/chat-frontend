import { useEffect, useState } from "react";
import api from "./api";
import { socket } from "./socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import Login from "./Login";
import Signup from "./Signup";
import "./Chat.css";

function App() {
  // 🔒 SAFE localStorage read (prevents JSON crash)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Invalid user in localStorage, clearing...");
      localStorage.removeItem("user");
      return null;
    }
  });

  const [messages, setMessages] = useState([]);
  const [showSignup, setShowSignup] = useState(false);

  const currentUserId = user?.id;

  /* =========================
     LOAD MESSAGES AFTER LOGIN
  ========================= */
  useEffect(() => {
    if (!user) return;

    api
      .get("/messages")
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
      });
  }, [user]);

  /* =========================
     SOCKET.IO REALTIME EVENTS
  ========================= */
  useEffect(() => {
    socket.on("messageCreated", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("messageUpdated", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    });

    socket.on("messageDeleted", ({ id }) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    });

    return () => {
      socket.off("messageCreated");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
    };
  }, []);

  /* =========================
     MESSAGE ACTIONS
  ========================= */
  const sendMessage = async (text) => {
    try {
      await api.post("/messages", { text });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = async (id, newText) => {
    try {
      await api.put(`/messages/${id}`, { text: newText });
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  /* =========================
     LOGIN / SIGNUP FLOW
  ========================= */
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

  /* =========================
     CHAT UI
  ========================= */
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
