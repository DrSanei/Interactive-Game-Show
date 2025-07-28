import React, { useState } from "react";
import JitsiEmbed from "./JitsiEmbed";
import "./WatcherView.css";

const Icons = {
  micOn: "🎤", micOff: "🔇",
  camOn: "📷", camOff: "🚫",
  live: "🔴",
  control: "🕹️",
  mafia: "🕵️",
  up: "👍", down: "👎",
  send: "📨",
};

const demoPlayers = [
  { name: "Ali" }, { name: "Sara" }, { name: "Ladan" }
];

const suspicionOptions = [
  { value: "White", label: "White" },
  { value: "Gray", label: "Gray" },
  { value: "Dark", label: "Dark" },
];

function getSuspicionColor(level) {
  if (level === "White") return "#cfe1ff";
  if (level === "Gray") return "#ffbf47";
  if (level === "Dark") return "#ff8282";
  return "#eee";
}

export default function WatcherView() {
  // Tab management
  const [tab, setTab] = useState("control");
  // Join game button logic
  const [activeGame, setActiveGame] = useState(true); // simulate true for UI
  const [joined, setJoined] = useState(false);

  // Live controls
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  // Mafia13 voting logic
  const [question] = useState("Who do you think is Mafia?");
  const [vote, setVote] = useState(""); // thumbs up/down
  const [comment, setComment] = useState("");
  const [perPlayerSuspicion, setPerPlayerSuspicion] = useState(
    demoPlayers.reduce((obj, p) => ({ ...obj, [p.name]: "White" }), {})
  );
  const [playerComments, setPlayerComments] = useState(
    demoPlayers.reduce((obj, p) => ({ ...obj, [p.name]: "" }), {})
  );

  // LLM summary mock
  const [llmSummary] = useState([
    { id: 1, summary: "Majority think Sara is mafia.", created_at: "2025-07-27 22:09" },
    { id: 2, summary: "Ali received some suspicion.", created_at: "2025-07-27 22:02" }
  ]);

  // Handlers
  const handleJoin = () => setJoined(true);

  const handleVote = v => setVote(v);

  // Per-player suspicion vote
  const handleSuspicion = (name, val) => setPerPlayerSuspicion(s => ({ ...s, [name]: val }));
  const handlePlayerComment = (name, val) => setPlayerComments(c => ({ ...c, [name]: val }));

  const submitPlayerComment = name => {
    alert(`Sent comment for ${name}: ${playerComments[name]}`);
    setPlayerComments(c => ({ ...c, [name]: "" }));
  };

  // Main question thumbs up/down
  const sendMainComment = () => {
    alert(`Voted ${vote === "up" ? "👍" : "👎"} on "${question}"\nComment: ${comment}`);
    setComment("");
  };

  return (
    <div className="dash-root">
      {/* LIVE TAB */}
      <div className={`dash-tab-panel${tab === "live" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.live}</span> Live Call</h2>
        {joined && activeGame ? (
          <div className="video-embed">
            <JitsiEmbed
              userType="watcher"
              roomName="demo-room"
              startWithAudioMuted={!mic}
              startWithVideoMuted={!cam}
            />
            <div className="self-controls">
              <button className={`icon-btn${mic ? " on" : " off"}`}
                onClick={() => setMic(m => !m)}
                title={mic ? "Mute Mic" : "Unmute Mic"}
              >
                {mic ? Icons.micOn : Icons.micOff}
              </button>
              <button className={`icon-btn${cam ? " on" : " off"}`}
                onClick={() => setCam(c => !c)}
                title={cam ? "Turn Off Camera" : "Turn On Camera"}
              >
                {cam ? Icons.camOn : Icons.camOff}
              </button>
            </div>
          </div>
        ) : (
          <div className="not-started">Please join the game to access live view.</div>
        )}
      </div>

      {/* CONTROL TAB */}
      <div className={`dash-tab-panel${tab === "control" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.control}</span> Game Control</h2>
        <div className="game-info">
          <div>Role: <b>Watcher</b></div>
        </div>
        {!joined ? (
          <button
            className={`main-btn go-live-btn${!activeGame ? " disabled" : ""}`}
            disabled={!activeGame}
            style={{ margin: "35px 0 0 0" }}
            onClick={() => {
              if (!activeGame) return alert("No game has yet started by God.");
              handleJoin();
              setTab("live");
            }}
          >
            Join the Game
          </button>
        ) : (
          <div className="after-card">
            <div className="role-info-msg">
              You joined as a watcher. Go to <b>mafia13</b> tab to participate in voting!
            </div>
            <button
              className="main-btn go-live-btn"
              onClick={() => setTab("mafia13")}
            >
              Go to mafia13
            </button>
          </div>
        )}
      </div>

      {/* MAFIA13 TAB */}
      <div className={`dash-tab-panel${tab === "mafia13" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.mafia}</span> mafia13</h2>
        {/* Main Question + thumbs voting */}
        <div className="players-table-container" style={{ marginTop: 6, marginBottom: 18 }}>
          <div className="table-title">Admin's Question</div>
          <div className="vote-question-block">
            <div className="question-text">{question}</div>
            <div className="thumbs-row">
              <button
                className={`icon-btn thumb-btn${vote === "up" ? " selected" : ""}`}
                onClick={() => handleVote("up")}
              >{Icons.up}</button>
              <button
                className={`icon-btn thumb-btn${vote === "down" ? " selected" : ""}`}
                onClick={() => handleVote("down")}
              >{Icons.down}</button>
              <input
                className="vote-comment"
                placeholder="Add comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={80}
                style={{ marginLeft: 8 }}
              />
              <button className="small-btn" style={{ marginLeft: 6 }} onClick={sendMainComment}>{Icons.send} Send</button>
            </div>
          </div>
        </div>
        {/* Voting Table */}
        <div className="players-table-container">
          <div className="table-title">Watcher Voting Table</div>
          <table className="players-table">
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Suspicion</th>
                <th>Overall Comment</th>
              </tr>
            </thead>
            <tbody>
              {demoPlayers.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>
                    <div className="suspicion-btn-group">
                      {suspicionOptions.map(opt => (
                        <button
                          key={opt.value}
                          className={`small-btn suspicion-btn${perPlayerSuspicion[p.name] === opt.value ? " selected" : ""}`}
                          style={{
                            background: perPlayerSuspicion[p.name] === opt.value ? getSuspicionColor(opt.value) : "#23284b",
                            color: perPlayerSuspicion[p.name] === opt.value ? "#222" : "#b8bdf7"
                          }}
                          onClick={() => handleSuspicion(p.name, opt.value)}
                        >{opt.label}</button>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span>
                        {perPlayerSuspicion[p.name] === "White" && "Seems Innocent"}
                        {perPlayerSuspicion[p.name] === "Gray" && "Somewhat Suspicious"}
                        {perPlayerSuspicion[p.name] === "Dark" && "Likely Mafia"}
                      </span>
                      <input
                        className="vote-comment"
                        value={playerComments[p.name]}
                        onChange={e => handlePlayerComment(p.name, e.target.value)}
                        maxLength={40}
                        placeholder="Add comment"
                        style={{ width: 80, fontSize: ".95em" }}
                      />
                      <button className="small-btn" style={{ padding: "3px 9px" }}
                        onClick={() => submitPlayerComment(p.name)}>
                        {Icons.send}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* LLM Summary */}
        <div className="players-table-container" style={{ marginTop: 18 }}>
          <div className="table-title">LLM (AI) Summary</div>
          <table className="players-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {llmSummary.length === 0 ? (
                <tr><td colSpan={2}><em>No LLM summary yet</em></td></tr>
              ) : (
                llmSummary.map((l, i) => (
                  <tr key={l.id || i}>
                    <td style={{ fontSize: ".93em", color: "#b3b5c8" }}>{l.created_at}</td>
                    <td>{l.summary}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Navbar */}
      <nav className="dash-navbar">
        <button className={`nav-icon-btn${tab === "live" ? " selected" : ""}`}
          onClick={() => setTab("live")}>
          <span className="navbar-icon">🎥</span>
          <div className="nav-label">Live</div>
        </button>
        <button className={`nav-icon-btn nav-main-btn${tab === "control" ? " selected" : ""}`}
          onClick={() => setTab("control")}>
          <span className="navbar-icon main-icon">🕹️</span>
          <div className="nav-label">Control</div>
        </button>
        <button className={`nav-icon-btn${tab === "mafia13" ? " selected" : ""}`}
          onClick={() => setTab("mafia13")}>
          <span className="navbar-icon">🕵️</span>
          <div className="nav-label">mafia13</div>
        </button>
      </nav>
    </div>
  );
}
