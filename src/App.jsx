import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Chat from "./Chat";
import "./styles.css";
import "./App.css";
import "./Login.css";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session on refresh (SAFE)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      // corrupted storage → clean it
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Called after successful login OR register
  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowRegister(false);
  };

  // ⏳ Prevent flicker
  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  // 🔐 Auth screens
  if (!user) {
    return showRegister ? (
      <Register onLogin={handleLogin} onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={handleLogin} onSwitch={() => setShowRegister(true)} />
    );
  }

  // 💬 Chat screen
  return (
    <div className="app-container">
      

      <Chat currentUser={user} />
    </div>
  );
}

export default App;
