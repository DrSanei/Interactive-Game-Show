import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import PlayerView from "./components/PlayerView";
import WatcherView from "./components/WatcherView";
import "./App.css";

// Beautiful HomePage with 3 big buttons
function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-root">
      <div className="home-title">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1516/1516831.png"
          alt="Game Logo"
          className="home-logo"
        />
        <h1>Baziche Platform</h1>
        <p className="home-sub">Interactive Live Game Shows</p>
      </div>
      <div className="home-buttons">
        <button className="home-btn home-btn-admin" onClick={() => navigate("/admin")}>
          🎲 Start a Game
        </button>
        <button className="home-btn home-btn-player" onClick={() => navigate("/player")}>
          👤 Join a Game
        </button>
        <button className="home-btn home-btn-watcher" onClick={() => navigate("/watcher")}>
          👁️ Watch the Game
        </button>
      </div>
      <footer className="home-footer">
        <span>© 2025 Baziche | Made with ❤️</span>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/player" element={<PlayerView />} />
        <Route path="/watcher" element={<WatcherView />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
export default App;
