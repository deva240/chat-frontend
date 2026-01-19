import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Chat from "./Chat";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={setUser} onSwitch={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="app-container">
      <div className="app-header">
        Chat App
        <button onClick={logout}>Logout</button>
      </div>
      <Chat currentUser={user} />
    </div>
  );
}

export default App;
