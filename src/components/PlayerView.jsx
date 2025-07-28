import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { isGameStarted, playerJoin } from "../services/supabase";
import JitsiEmbed from "./JitsiEmbed";

export default function PlayerView() {
  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("room");
  const [gameStarted, setGameStarted] = useState(false);
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    setPlayerId("player-" + Math.floor(Math.random() * 100000));
  }, []);

  useEffect(() => {
    if (roomName && playerId) {
      const interval = setInterval(async () => {
        const started = await isGameStarted(roomName);
        setGameStarted(started);
        if (started) {
          await playerJoin(roomName, playerId);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [roomName, playerId]);

  if (!roomName) return <div>No room provided.</div>;
  if (!gameStarted) return <div>Waiting for God to start the game...</div>;
  return (
    <div>
      <h2>Player View</h2>
      <JitsiEmbed userType={playerId} roomName={roomName} />
      <button onClick={() => alert("Mute mic!")}>Mute/Unmute Mic</button>
    </div>
  );
}
