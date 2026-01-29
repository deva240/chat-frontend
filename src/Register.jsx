import { useState } from "react";
import api from "./api";

export default function Register({ onLogin, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("All fields required");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        username,
        password,
      });

      // 🔑 SAME AS LOGIN
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <form onSubmit={submit} className="auth-box">
      <h2>Create account</h2>

      {error && <div className="error">{error}</div>}

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Create account</button>

      <p onClick={onSwitch}>Back to login</p>
    </form>
  );
}
