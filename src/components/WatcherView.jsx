import React, { useState, useEffect } from "react";
import { getActiveGame, submitVoteAndComment } from "../services/supabase";
import JitsiEmbed from "./JitsiEmbed";

export default function WatcherView() {
  const [activeGame, setActiveGame] = useState(null);
  const [joined, setJoined] = useState(false);
  const [vote, setVote] = useState("");
  const [playerNumber, setPlayerNumber] = useState(1);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Poll for active game
    const interval = setInterval(async () => {
      const game = await getActiveGame();
      setActiveGame(game);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeGame) return;
    await submitVoteAndComment({
      vote,
      player_number: playerNumber,
      comment,
      watcher_name: "Anonymous",
      room_name: activeGame.room_name
    });
    setVote("");
    setComment("");
  };

  return (
    <div>
      <h2>Watcher View</h2>
      {!activeGame ? (
        <button disabled>Waiting for God to start the game...</button>
      ) : !joined ? (
        <button onClick={() => setJoined(true)}>Join the Game</button>
      ) : (
        <div>
          <JitsiEmbed userType="watcher" roomName={activeGame.room_name} />
          <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <label>
              Vote:
              <select value={vote} onChange={e => setVote(e.target.value)} required>
                <option value="">Select</option>
                <option value="yes">Yes (Guilty)</option>
                <option value="no">No (Not Guilty)</option>
              </select>
            </label>
            <label>
              Player Number:
              <input
                type="number"
                min={1}
                max={12}
                value={playerNumber}
                onChange={e => setPlayerNumber(Number(e.target.value))}
                style={{ width: 40, marginLeft: 5 }}
              />
            </label>
            <label>
              Comment:
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={100}
                style={{ width: 200, marginLeft: 5 }}
              />
            </label>
            <button type="submit">Submit Vote</button>
          </form>
        </div>
      )}
    </div>
  );
}
