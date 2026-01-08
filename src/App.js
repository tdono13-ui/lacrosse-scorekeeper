import React, { useState } from "react";

export default function App() {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("Attack");

  const addPlayer = () => {
    if (!name) return;
    setPlayers([
      ...players,
      {
        name,
        position,
        goals: 0,
        assists: 0,
        shots: 0,
        groundballs: 0,
        turnovers: 0
      }
    ]);
    setName("");
  };

  const updateStat = (index, stat) => {
    const copy = [...players];
    copy[index][stat]++;
    setPlayers(copy);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>🥍 Lacrosse Scorekeeper</header>

      <section style={styles.scoreboard}>
        <div style={styles.teamBox}>
          <h2>Home</h2>
          <div style={styles.score}>{homeScore}</div>
          <button style={styles.button} onClick={() => setHomeScore(homeScore + 1)}>+</button>
        </div>
        <div style={styles.teamBox}>
          <h2>Away</h2>
          <div style={styles.score}>{awayScore}</div>
          <button style={styles.button} onClick={() => setAwayScore(awayScore + 1)}>+</button>
        </div>
      </section>

      <section style={styles.card}>
        <h3>Add Player</h3>
        <input
          style={styles.input}
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select style={styles.input} value={position} onChange={(e) => setPosition(e.target.value)}>
          <option>Attack</option>
          <option>Midfield</option>
          <option>Defense</option>
          <option>Goalie</option>
        </select>
        <button style={styles.primaryButton} onClick={addPlayer}>Add Player</button>
      </section>

      <section style={styles.players}>
        {players.map((p, i) => (
          <div key={i} style={styles.playerCard}>
            <h4>
              {p.name}
              <span style={styles.badge}>{p.position}</span>
            </h4>
            <div style={styles.statsGrid}>
              {Object.keys(p)
                .filter(k => !["name", "position"].includes(k))
                .map(stat => (
                  <button
                    key={stat}
                    style={styles.statButton}
                    onClick={() => updateStat(i, stat)}
                  >
                    {stat}: {p[stat]}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "system-ui, sans-serif",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#e5e7eb",
    paddingBottom: 40
  },
  header: {
    fontSize: 24,
    fontWeight: 700,
    padding: 16,
    textAlign: "center",
    background: "linear-gradient(90deg,#2563eb,#22d3ee)"
  },
  scoreboard: {
    display: "flex",
    justifyContent: "space-around",
    margin: "20px 0"
  },
  teamBox: {
    background: "#020617",
    padding: 16,
    borderRadius: 16,
    width: "40%",
    textAlign: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,.3)"
  },
  score: {
    fontSize: 48,
    margin: "10px 0"
  },
  button: {
    background: "#22c55e",
    border: "none",
    borderRadius: 999,
    fontSize: 24,
    width: 48,
    height: 48,
    color: "#022c22"
  },
  card: {
    background: "#020617",
    margin: 16,
    padding: 16,
    borderRadius: 16
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    border: "none"
  },
  primaryButton: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    border: "none",
    borderRadius: 12,
    color: "white",
    fontSize: 16
  },
  players: {
    padding: 16
  },
  playerCard: {
    background: "#020617",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12
  },
  badge: {
    background: "#1e293b",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
    marginLeft: 8
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
    marginTop: 10
  },
  statButton: {
    background: "#1e293b",
    border: "none",
    borderRadius: 12,
    padding: 8,
    color: "#e5e7eb"
  }
};
