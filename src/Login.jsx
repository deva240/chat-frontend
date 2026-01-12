import { useState } from "react";
import api from "./api";

function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      // ✅ THIS IS CRITICAL
      // res.data MUST contain { token, user }
      onLogin(res.data);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "40px" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <br /><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br /><br />
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <button onClick={onSwitch}>Create one</button>
      </p>
    </div>
  );
}

export default Login;
