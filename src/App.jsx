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

  // 🔁 Restore login on refresh (REAL APP BEHAVIOR)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // ✅ Called after successful login
  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // 🚪 Logout (switch user like real apps)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowRegister(false);
  };

  // ⏳ Prevent flicker on reload
  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  // 🔐 Auth screens
  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitch={() => setShowRegister(true)}
      />
    );
  }

  // 💬 Chat screen
  return (
    <div className="app-container">
      <div className="app-header">
        <span>Realtime Chat</span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <Chat currentUser={user} />
    </div>
  );
}

export default App;
