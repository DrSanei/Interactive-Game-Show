import React, { useState } from "react";
import JitsiEmbed from "./JitsiEmbed";
import "./PlayerView.css";

const Icons = {
  micOn: "🎤", micOff: "🔇",
  camOn: "📷", camOff: "🚫",
  user: "🧑",
  live: "🔴",
  control: "🕹️",
  mafia: "🕵️",
};

const roleEmoji = {
  Mafia: "🕵️‍♂️", Citizen: "🧑‍🌾", Detective: "🔍", Doctor: "🩺", Custom: "🎲"
};

export default function PlayerView() {
  const [tab, setTab] = useState("control");
  const [joined, setJoined] = useState(false);
  const [inputRoom, setInputRoom] = useState("");
  const [showBack, setShowBack] = useState(false);
  const [cardViewed, setCardViewed] = useState(false);

  // Room from link or demo
  const [roomName] = useState(window.location.search.split("room=")[1] || "demo-room");
  // Simulate authenticated player info
  const [player, setPlayer] = useState({
    name: "Ali",
    role: "Citizen",
    mic: true,
    cam: true,
  });
  const [gameStarted] = useState(true); // Assume started if joined

  // Demo players for voting
  const [players] = useState([
    { name: "Ali", role: "Citizen" },
    { name: "Sara", role: "Mafia" },
    { name: "Ladan", role: "Detective" },
  ]);

  // Voting data
  const [votingResults] = useState([
    { player: "Ali", suspicion: "Gray", comment: "Somewhat suspicious." },
    { player: "Sara", suspicion: "Dark", comment: "Majority think Sara is mafia." },
    { player: "Ladan", suspicion: "White", comment: "Seems innocent." },
  ]);

  // LLM summary
  const [llmSummary] = useState([
    { id: 1, summary: "Majority think Sara is mafia.", created_at: "2025-07-27 22:09" },
    { id: 2, summary: "Ali received some suspicion.", created_at: "2025-07-27 22:02" }
  ]);

  // Mic/Cam controls
  const toggleMic = () => setPlayer(p => ({ ...p, mic: !p.mic }));
  const toggleCam = () => setPlayer(p => ({ ...p, cam: !p.cam }));

  // Suspicion color
  function getSuspicionColor(level) {
    if (level === "White") return "#cfe1ff";
    if (level === "Gray") return "#ffbf47";
    if (level === "Dark") return "#ff8282";
    return "#eee";
  }

  return (
    <div className="dash-root">
      {/* LIVE TAB */}
      <div className={`dash-tab-panel${tab === "live" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.live}</span> Live Call</h2>
        {gameStarted && roomName ? (
          <div className="video-embed">
            <JitsiEmbed
              userType="player"
              roomName={roomName}
              startWithAudioMuted={!player.mic}
              startWithVideoMuted={!player.cam}
            />
            <div className="self-controls">
              <button
                className={`icon-btn${player.mic ? " on" : " off"}`}
                onClick={toggleMic}
                title={player.mic ? "Mute Mic" : "Unmute Mic"}
              >
                {player.mic ? Icons.micOn : Icons.micOff}
              </button>
              <button
                className={`icon-btn${player.cam ? " on" : " off"}`}
                onClick={toggleCam}
                title={player.cam ? "Turn Off Camera" : "Turn On Camera"}
              >
                {player.cam ? Icons.camOn : Icons.camOff}
              </button>
            </div>
          </div>
        ) : (
          <div className="not-started">Waiting for host to start the game...</div>
        )}
      </div>

      {/* CONTROL TAB */}
      <div className={`dash-tab-panel${tab === "control" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.control}</span> Game Room</h2>
        <div className="game-info">
          <div>Room: <b>{roomName}</b></div>
          <div>Player: <b>{player.name}</b></div>
        </div>

        {/* JOIN ROOM BOX */}
        {!joined && (
          <form
            className="join-room-form"
            onSubmit={e => {
              e.preventDefault();
              setJoined(true);
            }}
          >
            <label>
              Paste Room Link:&nbsp;
              <input
                className="join-room-input"
                type="text"
                value={inputRoom}
                onChange={e => setInputRoom(e.target.value)}
                placeholder="Paste invite link here..."
              />
            </label>
            <button className="join-room-btn" type="submit">GO</button>
          </form>
        )}

        {/* FLIP CARD */}
        {joined && !cardViewed && (
          <div className="flip-card-wrapper">
            <div className={`flip-card${showBack ? " flipped" : ""}`} onClick={() => setShowBack(!showBack)}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <span role="img" aria-label="card" style={{ fontSize: "2.5em" }}>🃏</span>
                  <div>Click to reveal your Role!</div>
                </div>
                <div className="flip-card-back">
                  <span style={{ fontSize: "2em" }}>{roleEmoji[player.role] || "🎲"}</span>
                  <div className="role-reveal">{player.role}</div>
                  <div style={{ fontSize: "0.95em", color: "#8ac1ff99", marginTop: 7 }}>Click to hide</div>
                </div>
              </div>
            </div>
            {!showBack ? null : (
              <button className="see-role-btn" onClick={() => setCardViewed(true)}>
                ✅ I saw my role
              </button>
            )}
          </div>
        )}

        {/* After card viewed: show button to join meeting */}
        {joined && cardViewed && (
          <div className="after-card">
            <div className="role-info-msg">
              You are ready! When the host starts the game, you can join the meeting.
            </div>
            <button
              className="main-btn go-live-btn"
              onClick={() => setTab("live")}
            >
              Go to Live
            </button>
          </div>
        )}
      </div>

      {/* VIEWERS TAB -- now "mafia13" */}
      <div className={`dash-tab-panel${tab === "mafia13" ? " tab-active" : ""}`}>
        <h2 className="dash-title"><span className="tab-ic">{Icons.mafia}</span> mafia13</h2>
        {/* Voting Table */}
        <div className="players-table-container" style={{ marginTop: 14 }}>
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
              {votingResults.length === 0 ? (
                <tr>
                  <td colSpan={3}><em>No voting data yet</em></td>
                </tr>
              ) : (
                votingResults.map((v, i) => (
                  <tr key={i}>
                    <td>{v.player}</td>
                    <td style={{
                      color: getSuspicionColor(v.suspicion),
                      fontWeight: 600
                    }}>{v.suspicion}</td>
                    <td>{v.comment}</td>
                  </tr>
                ))
              )}
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
