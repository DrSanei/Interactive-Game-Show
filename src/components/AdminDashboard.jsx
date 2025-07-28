import React, { useState } from "react";
import JitsiEmbed from "./JitsiEmbed";
import "./DashboardDark.css";

const Icons = {
  micOn: "🎤", micOff: "🔇",
  camOn: "📷", camOff: "🚫",
  user: "🧑",
  live: "🔴",
  control: "🕹️",
  viewers: "👥",
  copy: "📋",
  share: "📤"
};

const ROLES = ["Mafia", "Citizen", "Detective", "Doctor", "Custom"];
function randomizeRoles(playerCount) {
  let arr = new Array(playerCount).fill("Citizen");
  if (playerCount > 1) arr[0] = "Mafia";
  if (playerCount > 2) arr[1] = "Detective";
  if (playerCount > 3) arr[2] = "Doctor";
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("control");
  const [gameStarted, setGameStarted] = useState(false);
  const [roomName, setRoomName] = useState("");
  // Simulated demo players
  const [players, setPlayers] = useState([
    { player_id: "1", name: "Ali", mic: true, cam: true, role: "Citizen" },
    { player_id: "2", name: "Sara", mic: false, cam: true, role: "Mafia" },
    { player_id: "3", name: "Ladan", mic: true, cam: false, role: "Detective" }
  ]);

  // Viewers tab demo data
  const [votingQuestion, setVotingQuestion] = useState("Who do you think is Mafia?");
  const [votes, setVotes] = useState([
    { watcher: "Anon1", vote: "Yes", onPlayer: "Sara", comment: "Seems suspicious" },
    { watcher: "Reza", vote: "No", onPlayer: "Ali", comment: "" },
    { watcher: "Guest12", vote: "Yes", onPlayer: "Ladan", comment: "Weird answers" }
  ]);
  const [viewersCount] = useState(24);
  const [likesCount] = useState(8);
  const [llmSummary, setLlmSummary] = useState([
    { id: 1, summary: "Majority think Sara is mafia.", created_at: "2025-07-27 22:09" },
    { id: 2, summary: "Ali received some suspicion.", created_at: "2025-07-27 22:02" }
  ]);
  const [llmInput, setLlmInput] = useState("");

  // --- Player Controls ---
  const toggleMic = id => setPlayers(players => players.map(p =>
    p.player_id === id ? { ...p, mic: !p.mic } : p
  ));
  const toggleCam = id => setPlayers(players => players.map(p =>
    p.player_id === id ? { ...p, cam: !p.cam } : p
  ));

  const assignRandomRoles = () => {
    const randomRoles = randomizeRoles(players.length);
    setPlayers(players => players.map((p, i) => ({
      ...p, role: randomRoles[i] || "Citizen"
    })));
  };
  const setRole = (id, role) =>
    setPlayers(players => players.map(p =>
      p.player_id === id ? { ...p, role } : p
    ));
  const toggleAll = (what, on) =>
    setPlayers(players => players.map(p => ({ ...p, [what]: on })));

  // --- Game Start/Stop ---
  const startGame = () => {
    setRoomName("mafia13-" + Date.now());
    setPlayers(players => players.map(p => ({ ...p, mic: true, cam: true })));
    setGameStarted(true);
  };
  const stopGame = () => {
    setGameStarted(false);
    setRoomName("");
  };

  // --- Invite Link ---
  const playerLink = roomName
    ? `${window.location.origin}/player?room=${roomName}` : "";
  const handleCopy = () => {
    if (playerLink) navigator.clipboard.writeText(playerLink);
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Join the game", url: playerLink });
    } else {
      handleCopy();
      alert("Link copied. Use your messenger app to share.");
    }
  };

  // --- LLM Table Demo (simulate AI) ---
  const handleAddLlm = () => {
    if (llmInput.length > 0) {
      setLlmSummary(s => [
        { id: s.length + 1, summary: llmInput, created_at: new Date().toLocaleString() },
        ...s
      ]);
      setLlmInput("");
    }
  };

  // --- Voting Question Post Handler ---
  const handlePostQuestion = () => {
    if (votingQuestion.trim()) {
      alert("Question posted: " + votingQuestion);
      // Post to backend or update state as needed
    }
  };

  return (
    <div className="dash-root">
      {/* LIVE TAB */}
      <div className={`dash-tab-panel${tab === "live" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.live}</span> Live Call</h2>
        {gameStarted && roomName ? (
          <div className="video-embed">
            <JitsiEmbed
              userType="admin"
              roomName={roomName}
              startWithAudioMuted={true}
              startWithVideoMuted={true}
            />
          </div>
        ) : (
          <div className="not-started">Start the game to open the live video call.</div>
        )}
      </div>

      {/* CONTROL TAB */}
      <div className={`dash-tab-panel${tab === "control" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.control}</span> Game Control</h2>
        <div className="game-info">
          {gameStarted ? (
            <>
              <div>
                <b>Player Link: </b>
                <span className="invite-link">{playerLink}</span>
                <button className="icon-btn icon-link" onClick={handleCopy} title="Copy">
                  {Icons.copy}
                </button>
                <button className="icon-btn icon-link" onClick={handleShare} title="Share">
                  {Icons.share}
                </button>
              </div>
            </>
          ) : (
            <span className="not-started">Players can join after the game starts.</span>
          )}
        </div>
        <div className="center-area">
          {!gameStarted ? (
            <button className="main-btn start-btn center-btn" onClick={startGame}>▶ Start Game</button>
          ) : (
            <button className="main-btn stop-btn center-btn" onClick={stopGame}>■ Stop Game</button>
          )}
        </div>
        {/* Player Table */}
        <div className="players-table-container">
          <table className="players-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>
                  <button className="table-header-btn icon-btn" onClick={assignRandomRoles} title="Assign Random Roles">
                    🧩
                  </button>
                </th>
                <th>
                  <button className="table-header-btn icon-btn" onClick={() => toggleAll("mic", players.some(p => p.mic) ? false : true)} title="Mute/Unmute All">
                    🎤
                  </button>
                </th>
                <th>
                  <button className="table-header-btn icon-btn" onClick={() => toggleAll("cam", players.some(p => p.cam) ? false : true)} title="Enable/Disable All Cameras">
                    📷
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.player_id}>
                  <td>
                    <span className="tab-ic">{Icons.user}</span> {p.name}
                  </td>
                  <td>
                    <button
                      className="icon-btn role-btn"
                      onClick={() => setRole(p.player_id,
                        ROLES[(ROLES.indexOf(p.role) + 1) % ROLES.length]
                      )}
                      title="Change Role"
                    >
                      {p.role}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`icon-btn ${p.mic ? "on" : "off"}`}
                      onClick={() => toggleMic(p.player_id)}
                      title={p.mic ? "Mute" : "Unmute"}
                    >
                      {p.mic ? Icons.micOn : Icons.micOff}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`icon-btn ${p.cam ? "on" : "off"}`}
                      onClick={() => toggleCam(p.player_id)}
                      title={p.cam ? "Turn Off Camera" : "Turn On Camera"}
                    >
                      {p.cam ? Icons.camOn : Icons.camOff}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEWERS TAB */}
      <div className={`dash-tab-panel${tab === "viewers" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.viewers}</span> Viewers</h2>
        <div className="game-info">
          <div style={{ display: "flex", gap: "30px", alignItems: "center", flexWrap: "wrap" }}>
            <span>Viewers: <b>{viewersCount}</b></span>
            <span>Likes: <b>{likesCount}</b></span>
            <button className="small-btn" onClick={() => setVotes([])}>Clear Votes</button>
          </div>
        </div>
        <div className="question-row">
          <label>Voting Question: </label>
          <input
            className="question-input"
            value={votingQuestion}
            maxLength={100}
            onChange={e => setVotingQuestion(e.target.value)}
            style={{ width: "58%" }}
          />
          <button className="post-btn" onClick={handlePostQuestion}>Post</button>
        </div>
        <div className="players-table-container" style={{ marginTop: 22 }}>
          <div className="table-title">Live Voting Table</div>
          <table className="players-table">
            <thead>
              <tr>
                <th>Watcher</th>
                <th>Vote</th>
                <th>On Player</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {votes.length === 0 ? (
                <tr>
                  <td colSpan={4}><em>No votes yet</em></td>
                </tr>
              ) : (
                votes.map((v, i) => (
                  <tr key={i}>
                    <td>{v.watcher}</td>
                    <td style={{ color: v.vote === "Yes" ? "#ff8c8c" : "#66fa85" }}>{v.vote}</td>
                    <td>{v.onPlayer}</td>
                    <td>{v.comment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* LLM Table */}
        <div className="players-table-container" style={{ marginTop: 18 }}>
          <div className="table-title">AI Summary</div>
          <form
            style={{ margin: "8px 0", display: "flex", gap: "6px", alignItems: "center" }}
            onSubmit={e => { e.preventDefault(); handleAddLlm(); }}
          >
            <input
              className="question-input"
              value={llmInput}
              maxLength={200}
              onChange={e => setLlmInput(e.target.value)}
              placeholder="Request AI Comments on a player ..."
            />
            <button className="small-btn" type="submit">Add</button>
          </form>
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
        <button className={`nav-icon-btn${tab === "viewers" ? " selected" : ""}`}
          onClick={() => setTab("viewers")}>
          <span className="navbar-icon">👥</span>
          <div className="nav-label">Viewers</div>
        </button>
      </nav>
    </div>
  );
}
