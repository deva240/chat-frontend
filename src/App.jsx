import { useState } from "react";
import Chat from "./Chat";
import Login from "./Login";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <div className="app-header">Realtime Chat</div>
      <Chat currentUser={user} />
    </div>
  );
}

export default App;
