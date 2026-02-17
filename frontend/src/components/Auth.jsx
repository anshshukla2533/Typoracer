import { useState } from "react";
import API from "../../services/api";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          onLogin(email);
        } else {
          setError(res.data || "Login failed");
        }
      } else {
        const res = await API.post("/auth/register", { email, password });
        if (res.data === "Registered") {
         
          const loginRes = await API.post("/auth/login", { email, password });
          if (loginRes.data.token) {
            localStorage.setItem("token", loginRes.data.token);
            onLogin(email);
          }
        } else {
          setError(res.data || "Registration failed");
        }
      }
    } catch (err) {
      setError("Something went wrong. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">⌨️ TypeRacer</h1>
        <p className="auth-subtitle">Test your typing speed</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
