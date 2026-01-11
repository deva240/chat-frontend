import { useState, useEffect } from "react";
import api from "./api";
import Chat from "./Chat";
import useTheme from "./useTheme";
import { socket } from "./socket";
import Login from "./Login";
import Signup from "./Signup";

// -------------------------
// Decode JWT
// -------------------------
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
 

  const { dark, toggleDark } = useTheme();

  // -------------------------
  // AUTO LOGIN ON REFRESH
  // -------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (decoded?.id && decoded?.username) {
      setUser({ id: decoded.id, username: decoded.username });
    }
  }, []);

  // -------------------------
  // LOAD MESSAGES AFTER LOGIN
  // -------------------------
  useEffect(() => {
    if (!user) return;

    api.get("/messages")
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [user]);

  // -------------------------
  // SOCKET REAL-TIME HANDLING
  // -------------------------
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket.id);
    });

    socket.on("messageCreated", msg => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("messageUpdated", updatedMsg => {
      setMessages(prev =>
        prev.map(m => (m.id === updatedMsg.id ? updatedMsg : m))
      );
    });

    socket.on("messageDeleted", ({ id }) => {
      setMessages(prev => prev.filter(m => m.id !== id));
    });

    return () => {
      socket.off("connect");
      socket.off("messageCreated");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
    };
  }, []);

  // -------------------------
  // AUTH VIEWS
  // -------------------------
  if (!user) {
    return showSignup ? (
      <Signup onSignup={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={setUser}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  // -------------------------
  // MESSAGE ACTIONS
  // -------------------------
  async function addMessage(text) {
    if (!text.trim()) return;
    await api.post("/messages", { text });
  }

  async function handleEdit(id, newText) {
    if (!newText.trim()) return;
    await api.put(`/messages/${id}`, { text: newText });
  }

  async function handleDelete(id) {
    await api.delete(`/messages/${id}`);
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div
      style={{
        width: "400px",
        margin: "30px auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: dark ? "#1e1e1e" : "white",
        color: dark ? "white" : "black"
      }}
    >
      <h2 style={{ textAlign: "center" }}>Chat App</h2>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setUser(null);
        }}
      >
        Logout
      </button>

      <button onClick={toggleDark}>
        {dark ? "Light Mode" : "Dark Mode"}
      </button>

      {/* ✅ CORRECT PROPS */}
      <Chat
        messages={messages}
        onSend={addMessage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUser={user}
      />
    </div>
  );
}

export default App;
