import { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Chat from "./Chat";
import socket from "./socket";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // login | signup | chat
  const [loading, setLoading] = useState(true);

  /* ============================
     LOAD USER FROM LOCALSTORAGE
  ============================ */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) {
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(stored);

      if (!parsed?.token || !parsed?.id) {
        console.warn("Invalid user in localStorage, clearing...");
        localStorage.clear();
        setLoading(false);
        return;
      }

      setUser(parsed);
      setPage("chat");
    } catch (err) {
      console.error("Failed to parse user from storage", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  /* ============================
     SOCKET CONNECTION LIFECYCLE
  ============================ */
  useEffect(() => {
    if (!user) return;

    socket.auth = { token: user.token };
    socket.connect();

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("SOCKET DISCONNECTED");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [user]);

  /* ============================
     AUTH HANDLERS
  ============================ */
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setPage("chat");
  };

  const handleLogout = () => {
    localStorage.clear();
    socket.disconnect();
    setUser(null);
    setPage("login");
  };

  /* ============================
     PAGE SWITCHERS
  ============================ */
  const goToSignup = () => setPage("signup");
  const goToLogin = () => setPage("login");

  /* ============================
     RENDER
  ============================ */
  if (loading) {
    return (
      <div className="center-screen">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* HEADER */}
      <header className="app-header">
        <h2>Realtime Chat</h2>

        {user && (
          <div className="header-right">
            <span className="username">{user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="app-content">
        {page === "login" && (
          <Login
            onLogin={handleLogin}
            goToSignup={goToSignup}
          />
        )}

        {page === "signup" && (
          <Signup
            goToLogin={goToLogin}
          />
        )}

        {page === "chat" && user && (
          <Chat user={user} />
        )}
      </main>
    </div>
  );
}

export default App;
