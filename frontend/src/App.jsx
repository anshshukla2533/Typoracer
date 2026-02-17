import { useState } from "react";
import Auth from "./components/Auth";
import TypingTest from "./components/TypingTest";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [tab, setTab] = useState("test");

  const handleLogin = (email) => {
    localStorage.setItem("user", email);
    setUser(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">⌨️ TypeRacer</div>
        <div className="nav-links">
          <button
            className={`nav-link ${tab === "test" ? "active" : ""}`}
            onClick={() => setTab("test")}
          >
            Typing Test
          </button>
          <button
            className={`nav-link ${tab === "leaderboard" ? "active" : ""}`}
            onClick={() => setTab("leaderboard")}
          >
            Leaderboard
          </button>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="main-content">
        {tab === "test" ? <TypingTest user={user} /> : <Leaderboard />}
      </main>
    </div>
  );
}

export default App;
