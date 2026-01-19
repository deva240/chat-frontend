import { useState } from "react";
import api from "./api";

export default function Register({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", { username, password });
    onSwitch();
  };

  return (
    <form onSubmit={submit} className="auth-box">
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button>Register</button>
      <p onClick={onSwitch}>Back to login</p>
    </form>
  );
}
