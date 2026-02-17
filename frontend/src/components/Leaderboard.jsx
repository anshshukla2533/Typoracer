import { useState, useEffect } from "react";
import API from "../../services/api";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await API.get("/score");
      setScores(res.data);
    } catch (err) {
      console.error("Failed to fetch scores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>
        <button className="btn-icon" onClick={fetchScores} title="Refresh">
          🔄
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading scores...</div>
      ) : scores.length === 0 ? (
        <div className="empty-state">
          <p>No scores yet. Be the first to take the test!</p>
        </div>
      ) : (
        <div className="scores-list">
          {scores.map((score, i) => (
            <div key={i} className={`score-row ${i < 3 ? "top-three" : ""}`}>
              <span className="score-rank">{getMedal(i)}</span>
              <span className="score-user">{score.user}</span>
              <span className="score-wpm">{score.wpm} WPM</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
