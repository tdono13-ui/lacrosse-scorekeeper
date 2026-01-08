import React, { useState } from "react";

const defaultPlayerStats = (position) =>
  position === "Goalie"
    ? { saves: 0, shotsAgainst: 0, goalsAgainst: 0, clears: 0 }
    : { goals: 0, assists: 0, shots: 0, groundBalls: 0, turnovers: 0 };

export default function App() {
  const [tab, setTab] = useState("game");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [period, setPeriod] = useState(1);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("Attack");

  const addPlayer = () => {
    if (!name) return;
    setPlayers([
      ...players,
      {
        id: Date.now(),
        name,
        position,
        stats: defaultPlayerStats(position),
      },
    ]);
    setName("");
  };

  const updateStat = (id, stat) => {
    setPlayers(
      players.map((p) =>
        p.id === id
          ? {
              ...p,
              stats: {
                ...p.stats,
                [stat]: p.stats[stat] + 1,
              },
            }
          : p
      )
    );

    if (stat === "goals") setHomeScore(homeScore + 1);
    if (stat === "goalsAgainst") setAwayScore(awayScore + 1);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>🥍 Pro Lacrosse Game Center</header>

      <div style={styles.content}>
        {tab === "game" && (
          <div style={styles.scoreboard}>
            <div>
              <h3>HOME</h3>
              <div style={styles.score}>{homeScore}</div>
            </div>
            <div>
              <div>Q{period}</div>
              <button onClick={() => setPeriod(period < 4 ? period + 1 : 1)}>
                Next Q
              </button>
            </div>
            <div>
              <h3>AWAY</h3>
              <div style={styles.score}>{awayScore}</div>
            </div>
          </div>
        )}

        {tab === "roster" && (
          <div style={styles.roster}>
            <h2>Add Player</h2>
            <input
              placeholder="Player name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option>Attack</option>
              <option>Midfield</option>
              <option>Defense</option>
              <option>Goalie</option>
            </select>
            <button onClick={addPlayer}>Add</button>

            <h3>Roster</h3>
            {players.map((p) => (
              <div key={p.id}>
                {p.name} — {p.position}
              </div>
            ))}
          </div>
        )}

        {tab === "stats" && (
          <div style={styles.stats}>
            {players.map((p) => (
              <div key={p.id} style={styles.playerCard}>
                <strong>{p.name}</strong> ({p.position})
                <div style={styles.statButtons}>
                  {Object.keys(p.stats).map((stat) => (
                    <button key={stat} onClick={() => updateStat(p.id, stat)}>
                      + {stat}
                    </button>
                  ))}
                </div>
                <div style={styles.statLine}>
                  {Object.entries(p.stats).map(([k, v]) => (
                    <span key={k}>
                      {k}: {v}{" "}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav style={styles.tabs}>
        <button onClick={() => setTab("game")}>Game</button>
        <button onClick={() => setTab("roster")}>Roster</button>
        <button onClick={() => setTab("stats")}>Stats</button>
      </nav>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0f2027",
    color: "#fff",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: { textAlign: "center", padding: 14, fontWeight: 700 },
  content: { flex: 1, padding: 16 },
  scoreboard: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "#203a43",
    padding: 20,
    borderRadius: 16,
  },
  score: { fontSize: "3rem", fontWeight: 800 },
  roster: { display: "flex", flexDirection: "column", gap: 8 },
  stats: { display: "flex", flexDirection: "column", gap: 12 },
  playerCard: {
    background: "#203a43",
    padding: 12,
    borderRadius: 14,
  },
  statButtons: { display: "flex", flexWrap: "wrap", gap: 6 },
  statLine: { fontSize: "0.8rem", opacity: 0.8 },
  tabs: {
    display: "flex",
    justifyContent: "space-around",
    borderTop: "1px solid #ffffff22",
    padding: 10,
  },
};
