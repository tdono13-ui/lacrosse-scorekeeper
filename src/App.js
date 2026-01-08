import React, { useState, useEffect } from "react";

const LEVELS = { Youth: 10, Middle: 12, High: 12 };

const EMPTY_STATS = {
  goals:0, assists:0, shots:0, groundballs:0, turnovers:0,
  shotsAgainst:0, saves:0, goalsAgainst:0, clears:0,
  faceoffWins:0, faceoffLosses:0,
  shotLeft:0, shotRight:0, shotHigh:0, shotLow:0
};

export default function LacrosseScorekeeper() {
  const [level, setLevel] = useState("High");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [period, setPeriod] = useState(1);
  const [clockRunning, setClockRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(LEVELS[level] * 60);

  const [players, setPlayers] = useState(() => JSON.parse(localStorage.getItem("players")||"[]"));
  const [games, setGames] = useState(() => JSON.parse(localStorage.getItem("games")||"[]"));
  const [readOnly, setReadOnly] = useState(() => localStorage.getItem("readonly") === "true");
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");

  const [name, setName] = useState("");
  const [position, setPosition] = useState("Attack");

  useEffect(()=>setSecondsLeft(LEVELS[level]*60),[level]);

  useEffect(()=>{
    if(!clockRunning) return;
    const i=setInterval(()=>setSecondsLeft(s=>s>0?s-1:0),1000);
    return()=>clearInterval(i);
  },[clockRunning]);

  useEffect(()=>localStorage.setItem("players",JSON.stringify(players)),[players]);
  useEffect(()=>localStorage.setItem("games",JSON.stringify(games)),[games]);
  useEffect(()=>localStorage.setItem("readonly",readOnly),[readOnly]);
  useEffect(()=>localStorage.setItem("loggedIn",loggedIn),[loggedIn]);

  const formatTime=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  const addPlayer=()=>{
    if(!name||readOnly) return;
    setPlayers([...players,{ name, position, ...EMPTY_STATS }]);
    setName("");
  };

  const updateStat=(i,stat)=>{
    if(readOnly) return;
    const p=[...players]; p[i][stat]++;
    if(stat==="goals") setHomeScore(s=>s+1);
    if(stat==="goalsAgainst") setAwayScore(s=>s+1);
    setPlayers(p);
  };

  const endGame=()=>{
    setGames([...games,{ date:new Date().toLocaleDateString(), homeScore, awayScore, players }]);
    resetGame();
  };

  const resetGame=()=>{
    setHomeScore(0); setAwayScore(0); setPeriod(1);
    setClockRunning(false); setSecondsLeft(LEVELS[level]*60);
    setPlayers(players.map(p=>({ ...p, ...EMPTY_STATS })));
  };

  const gamesPlayed = games.length || 1;

  const rankedPlayers = [...players].sort((a,b)=>b.goals-a.goals);

  const exportMaxPrepsCSV = () => {
    const headers = ["Name","Goals","Assists","Shots","GB","TO","Saves","GA","SA","Clears"];
    const rows = players.map(p=>[
      p.name,p.goals,p.assists,p.shots,p.groundballs,p.turnovers,p.saves,p.goalsAgainst,p.shotsAgainst,p.clears
    ]);
    const csv=[headers,...rows].map(r=>r.join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="maxpreps-stats.csv"; a.click();
  };

  if(!loggedIn){
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Lacrosse Scorekeeper</h1>
        <button className="btn" onClick={()=>setLoggedIn(true)}>Login (Coach / Manager)</button>
        <p className="mt-4 text-sm">Parents can use read-only mode</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Lacrosse Scorekeeper</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <select value={level} onChange={e=>setLevel(e.target.value)}>
          <option>Youth</option><option>Middle</option><option>High</option>
        </select>
        <button className="btn" onClick={()=>setReadOnly(!readOnly)}>{readOnly?"Disable":"Enable"} Read‑Only</button>
        <button className="btn" onClick={endGame}>End & Save Game</button>
        <button className="btn" onClick={exportMaxPrepsCSV}>Export MaxPreps CSV</button>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-4 gap-4 text-center bg-white shadow rounded-2xl p-4">
        <div><div className="text-5xl">{homeScore}</div><div>Home</div></div>
        <div><div className="text-5xl">{period}</div><button className="btn" onClick={()=>setPeriod(p=>p+1)}>Next</button></div>
        <div><div className="text-4xl">{formatTime(secondsLeft)}</div><button className="btn" onClick={()=>setClockRunning(!clockRunning)}>{clockRunning?"Pause":"Start"}</button></div>
        <div><div className="text-5xl">{awayScore}</div><div>Away</div></div>
      </div>

      {/* Roster */}
      <div className="flex gap-2">
        <input placeholder="Player" value={name} onChange={e=>setName(e.target.value)} />
        <select value={position} onChange={e=>setPosition(e.target.value)}>
          <option>Attack</option><option>Midfield</option><option>Defense</option><option>Goalie</option>
        </select>
        <button className="btn" onClick={addPlayer}>Add</button>
      </div>

      {/* Stats */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th>Name</th><th>Pos</th><th>G</th><th>A</th><th>S</th><th>GB</th><th>TO</th><th>FO%</th><th>Save%</th><th>Shot Chart</th></tr></thead>
          <tbody>
            {players.map((p,i)=>{
              const foPct = p.faceoffWins+p.faceoffLosses>0 ? ((p.faceoffWins/(p.faceoffWins+p.faceoffLosses))*100).toFixed(0)+"%" : "";
              const savePct = p.shotsAgainst>0 ? ((p.saves/p.shotsAgainst)*100).toFixed(0)+"%" : "";
              return (
                <tr key={i}>
                  <td>{p.name}</td><td>{p.position}</td>
                  <td>{p.goals}<button onClick={()=>updateStat(i,"goals")}>+</button></td>
                  <td>{p.assists}<button onClick={()=>updateStat(i,"assists")}>+</button></td>
                  <td>{p.shots}<button onClick={()=>updateStat(i,"shots")}>+</button></td>
                  <td>{p.groundballs}<button onClick={()=>updateStat(i,"groundballs")}>+</button></td>
                  <td>{p.turnovers}<button onClick={()=>updateStat(i,"turnovers")}>+</button></td>
                  <td>{foPct}</td>
                  <td>{savePct}</td>
                  <td>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>L:{p.shotLeft}</div><div>R:{p.shotRight}</div>
                      <div>H:{p.shotHigh}</div><div>Lo:{p.shotLow}</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rankings */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold">Scoring Leaders</h2>
        {rankedPlayers.map((p,i)=>(<div key={i}>{i+1}. {p.name} – {p.goals} G ({(p.goals/gamesPlayed).toFixed(1)}/game)</div>))}
      </div>

      {/* Game History */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold">Game History</h2>
        {games.map((g,i)=>(<div key={i}>{g.date}: {g.homeScore}-{g.awayScore}</div>))}
      </div>

      <style>{`
        .btn{background:#2563eb;color:white;padding:0.4rem 0.7rem;border-radius:0.5rem;margin-left:0.25rem}
        table td,table th{border-bottom:1px solid #ddd;padding:0.25rem}
      `}</style>
    </div>
  );
}
