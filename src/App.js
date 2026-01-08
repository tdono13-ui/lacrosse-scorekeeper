import React, { useEffect, useState } from "react";
import YorkLogo from "./assets/york-dukes.png";

/* ================= CONFIG ================= */
const QUARTER_LENGTH = 12 * 60;

const defaultStats = (pos) =>
  pos === "Goalie"
    ? { shotsAgainst: 0, saves: 0, goalsAgainst: 0, clears: 0 }
    : { shots: 0, goals: 0, assists: 0, groundBalls: 0, turnovers: 0 };

export default function App() {
  const [tab, setTab] = useState("game");

  /* ROSTER */
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("Attack");
  const [team, setTeam] = useState("York");

  /* GAME */
  const [yorkScore, setYorkScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [period, setPeriod] = useState(1);
  const [clock, setClock] = useState(QUARTER_LENGTH);
  const [running, setRunning] = useState(false);

  /* ================= LOAD / SAVE ================= */
  useEffect(() => {
    const saved = localStorage.getItem("yorkLacrosseGame");
    if (saved) {
      const g = JSON.parse(saved);
      setPlayers(g.players || []);
      setYorkScore(g.yorkScore || 0);
      setOpponentScore(g.opponentScore || 0);
      setPeriod(g.period || 1);
      setClock(g.clock || QUARTER_LENGTH);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "yorkLacrosseGame",
      JSON.stringify({ players, yorkScore, opponentScore, period, clock })
    );
  }, [players, yorkScore, opponentScore, period, clock]);

  /* ================= CLOCK ================= */
  useEffect(() => {
    if (!running || clock <= 0) return;
    const t = setInterval(() => setClock((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [running, clock]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ================= ACTIONS ================= */
  const addPlayer = () => {
    if (!name && !number) return;
    setPlayers((p) => [
      ...p,
      {
        id: Date.now(),
        name,
        number,
        position,
        team,
        stats: defaultStats(position),
      },
    ]);
    setName("");
    setNumber("");
  };

  const changeStat = (id, stat, delta) => {
    const player = players.find((p) => p.id === id);
    if (!player) return;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stats: {
                ...p.stats,
                [stat]: Math.max(p.stats[stat] + delta, 0),
              },
            }
          : p
      )
    );

    if (stat === "goals") {
      player.team === "York"
        ? setYorkScore((s) => Math.max(s + delta, 0))
        : setOpponentScore((s) => Math.max(s + delta, 0));
    }

    if (stat === "goalsAgainst") {
      player.team === "York"
        ? setOpponentScore((s) => Math.max(s + delta, 0))
        : setYorkScore((s) => Math.max(s + delta, 0));
    }
  };

  const yorkPlayers = players.filter((p) => p.team === "York");
  const oppPlayers = players.filter((p) => p.team === "Opponent");

  /* ================= UI ================= */
  return (
    <div style={styles.app}>
      <header style={styles.header}>🥍 York Dukes Game Center</header>

      <div style={styles.content}>
      {tab === "game" && (
  <div style={styles.proScoreboard}>
    {/* YORK */}
    <div style={styles.teamPanel}>
      <img src={YorkLogo} alt="York Dukes" style={styles.proLogo} />
      <div style={styles.teamName}>YORK</div>
      <div style={styles.proScore}>{yorkScore}</div>
      <div style={styles.goalBtns}>
        <button onClick={() => setYorkScore((s) => s + 1)}>+</button>
        <button onClick={() => setYorkScore((s) => Math.max(s - 1, 0))}>−</button>
      </div>
    </div>

    {/* CENTER */}
    <div style={styles.centerPanel}>
      <div style={styles.period}>Q{period}</div>
      <div style={styles.proClock}>{formatTime(clock)}</div>
      <div style={styles.clockControls}>
        <button onClick={() => setRunning(!running)}>
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setPeriod(period < 4 ? period + 1 : 1);
            setClock(QUARTER_LENGTH);
            setRunning(false);
          }}
        >
          Next Q
        </button>
      </div>
    </div>

    {/* OPPONENT */}
    <div style={styles.teamPanel}>
      <div style={styles.teamName}>OPPONENT</div>
      <div style={styles.proScore}>{opponentScore}</div>
      <div style={styles.goalBtns}>
        <button onClick={() => setOpponentScore((s) => s + 1)}>+</button>
        <button onClick={() => setOpponentScore((s) => Math.max(s - 1, 0))}>−</button>
      </div>
    </div>
  </div>
)}


        {tab === "roster" && (
          <>
            <div style={styles.rosterForm}>
              <input
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="# (optional)"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
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
              <select value={team} onChange={(e) => setTeam(e.target.value)}>
                <option>York</option>
                <option>Opponent</option>
              </select>
              <button onClick={addPlayer}>Add Player</button>
            </div>

            <div style={styles.split}>
              <RosterColumn title="York" players={yorkPlayers} />
              <RosterColumn title="Opponent" players={oppPlayers} />
            </div>
          </>
        )}

{tab === "stats" && (
  <div style={styles.split}>
    {[yorkPlayers, oppPlayers].map((group, i) => (
      <div key={i}>
        {group.map((p) => (
          <div key={p.id} style={styles.card}>
            <strong>
              #{p.number} {p.name} — {p.position}
            </strong>

            {/* RUNNING STAT TOTALS */}
            <div style={styles.statTotals}>
              {Object.entries(p.stats).map(([stat, value]) => (
                <span key={stat}>
                  {stat}: <strong>{value}</strong>
                </span>
              ))}
            </div>

            {/* STAT CONTROLS */}
            <div style={styles.buttons}>
              {Object.keys(p.stats).map((s) => (
                <div key={s}>
                  <button onClick={() => changeStat(p.id, s, 1)}>
                    ➕ {s}
                  </button>
                  <button onClick={() => changeStat(p.id, s, -1)}>
                    ➖
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
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

const RosterColumn = ({ title, players }) => (
  <div>
    <h3>{title}</h3>
    {players.map((p) => (
      <div key={p.id} style={styles.card}>
        #{p.number} {p.name} — {p.position}
      </div>
    ))}
  </div>
);

/* ================= STYLES ================= */
const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0f2027,#203a43)",
    color: "#fff",
    fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: { textAlign: "center", padding: 14, fontWeight: 900 },
  content: { flex: 1, padding: 16 },
  scoreboard: {
    display: "flex",
    justifyContent: "space-between",
    background: "#102a33",
    padding: 20,
    borderRadius: 18,
  },
  teamBlock: { textAlign: "center" },
  centerBlock: { textAlign: "center" },
  score: { fontSize: "3rem", fontWeight: 900 },
  clock: { fontSize: "1.5rem", margin: 6 },
  goalBtns: { display: "flex", gap: 8, justifyContent: "center" },
  logo: { width: 80, marginBottom: 6 },
  rosterForm: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  split: { display: "flex", gap: 12 },
  card: { background: "#203a43", padding: 10, borderRadius: 12, marginBottom: 8 },
  buttons: { display: "flex", flexWrap: "wrap", gap: 6 },
  tabs: { display: "flex", justifyContent: "space-around", padding: 10 },
  statTotals: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    fontSize: "0.85rem",
    opacity: 0.9,
    marginTop: 6,
    marginBottom: 8,
  },
  proScoreboard: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr 1fr",
    alignItems: "center",
    background: "#0b1c24",
    padding: 20,
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  
  teamPanel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  
  centerPanel: {
    textAlign: "center",
    background: "#020b11",
    padding: 14,
    borderRadius: 14,
  },
  
  teamName: {
    fontSize: "0.85rem",
    letterSpacing: 2,
    opacity: 0.8,
    fontWeight: 700,
  },
  
  proScore: {
    fontSize: "3.8rem",
    fontWeight: 900,
    lineHeight: 1,
  },
  
  proClock: {
    fontSize: "2.4rem",
    fontWeight: 900,
    margin: "6px 0",
  },
  
  period: {
    fontSize: "0.9rem",
    opacity: 0.85,
  },
  
  clockControls: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  
  proLogo: {
    width: 70,
    marginBottom: 4,
  },
  
  
};
