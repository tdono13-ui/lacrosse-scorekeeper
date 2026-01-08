import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("game");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [period, setPeriod] = useState(1);

  return (
    <div style={styles.app}>
      <header style={styles.header}>🥍 Pro Lacrosse Game Center</header>

      {/* MAIN CONTENT */}
      <div style={styles.content}>
        {activeTab === "game" && (
          <div style={styles.scoreboard}>
            <div style={styles.teamBox}>
              <span style={styles.teamName}>HOME</span>
              <span style={styles.score}>{homeScore}</span>
              <button style={styles.scoreBtn} onClick={() => setHomeScore(homeScore + 1)}>
                + Goal
              </button>
            </div>

            <div style={styles.centerBox}>
              <span style={styles.period}>Q{period}</span>
              <button
                style={styles.smallBtn}
                onClick={() => setPeriod(period < 4 ? period + 1 : 1)}
              >
                Next Q
              </button>
            </div>

            <div style={styles.teamBox}>
              <span style={styles.teamName}>AWAY</span>
              <span style={styles.score}>{awayScore}</span>
              <button style={styles.scoreBtn} onClick={() => setAwayScore(awayScore + 1)}>
                + Goal
              </button>
            </div>
          </div>
        )}

        {activeTab === "roster" && (
          <div style={styles.placeholder}>
            <h2>Roster</h2>
            <p>Add players, positions, and manage lineup.</p>
          </div>
        )}

        {activeTab === "stats" && (
          <div style={styles.placeholder}>
            <h2>Stats</h2>
            <p>Live player and team statistics.</p>
          </div>
        )}
      </div>

      {/* BOTTOM TABS */}
      <nav style={styles.tabs}>
        <button
          style={activeTab === "game" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("game")}
        >
          🟢 Game
        </button>
        <button
          style={activeTab === "roster" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("roster")}
        >
          👥 Roster
        </button>
        <button
          style={activeTab === "stats" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("stats")}
        >
          📊 Stats
        </button>
      </nav>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "14px",
    fontSize: "1.3rem",
    fontWeight: 700,
    textAlign: "center",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreboard: {
    display: "flex",
    gap: "30px",
    background: "rgba(0,0,0,0.35)",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  teamBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  teamName: { fontSize: "0.85rem", opacity: 0.8 },
  score: { fontSize: "3rem", fontWeight: 800 },
  scoreBtn: {
    background: "#00d4ff",
    border: "none",
    borderRadius: "14px",
    padding: "8px 14px",
    fontWeight: 600,
  },
  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
  },
  period: { fontSize: "1.1rem", fontWeight: 600 },
  smallBtn: {
    background: "#ffffff22",
    color: "#fff",
    border: "1px solid #ffffff44",
    borderRadius: "10px",
    padding: "6px 10px",
  },
  placeholder: {
    textAlign: "center",
    opacity: 0.9,
  },
  tabs: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    borderTop: "1px solid #ffffff22",
    background: "#0f2027",
  },
  tab: {
    background: "transparent",
    border: "none",
    color: "#aaa",
    fontSize: "0.9rem",
  },
  tabActive: {
    background: "transparent",
    border: "none",
    color: "#00d4ff",
    fontSize: "0.9rem",
    fontWeight: 700,
  },
};
