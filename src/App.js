import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import PlayerView from "./components/PlayerView";
import WatcherView from "./components/WatcherView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/player" element={<PlayerView />} />
        <Route path="/watcher" element={<WatcherView />} />
        <Route path="/" element={<h1>Baziche Platform</h1>} />
      </Routes>
    </Router>
  );
}
export default App;
