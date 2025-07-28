import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pwxqjgvtavmmzuxhaqqy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3eHFqZ3Z0YXZtbXp1eGhhcXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NTQ0MzEsImV4cCI6MjA2OTEzMDQzMX0.Ytw4mYABIOc1jJnl8JxzW8mbA7d2HJJ6uz-slMaLWUo' ;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin creates a new game
export async function createGame(roomName) {
  const { data, error } = await supabase.from('games').insert([{ room_name: roomName, status: 'started' }]);
  if (error) {
    console.error("CREATE GAME ERROR:", error);
    alert("Error creating game: " + (error.message || error));
  } else {
    console.log("Game created:", data);
  }
}

// Checks if any game is started (returns latest started game or null)
export async function getActiveGame() {
  let { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'started')
    .order('started_at', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return data;
}


// For players: check if game with this roomName is started
export async function isGameStarted(roomName) {
  let { data, error } = await supabase
    .from('games')
    .select('status')
    .eq('room_name', roomName)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return false;
  return data.status === "started";
}


// Player joins game (tracked in DB, optional for MVP)
export async function playerJoin(roomName, playerId) {
  // You may want a players table or just update a list in games table
  // For MVP, we'll use a simple upsert (not production safe but fine for demo)
  await supabase.from('player_joins').upsert([{ room_name: roomName, player_id: playerId, joined_at: new Date() }], { onConflict: ['room_name', 'player_id'] });
}

// List joined players for a game
export async function fetchPlayers(roomName) {
  let { data, error } = await supabase
    .from('player_joins')
    .select('player_id,joined_at')
    .eq('room_name', roomName)
    .order('joined_at', { ascending: true });
  if (error) return [];
  return data;
}

// Admin can end/stop game (status to 'ended')
export async function stopGame(roomName) {
  await supabase.from('games').update({ status: 'ended' }).eq('room_name', roomName);
}

// For watcher votes/comments (same as before)
export async function fetchVotes(roomName) {
  let { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('room_name', roomName)
    .order('inserted_at', { ascending: false });
  if (error) return [];
  return data;
}
export async function submitVoteAndComment({ vote, player_number, comment, watcher_name, room_name }) {
  await supabase.from('votes').insert([{ vote, player_number, comment, watcher_name, room_name }]);
}
export async function fetchLLMSummary(roomName) {
  let { data, error, status } = await supabase
    .from('llm_summary')
    .select('summary')
    .eq('room_name', roomName)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Accept no data or 406 (no match) as "no summary yet"
  if (error && status !== 406) {
    console.error(error);
    return "";
  }
  return data?.summary || "";
}
