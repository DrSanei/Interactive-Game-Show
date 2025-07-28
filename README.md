# Interactive Live Show MVP

An open-source MVP for an **Interactive Live Show Platform** where audiences don’t just watch — they play a real role in the game.

## Overview

**Interactive Live Show** is a modern web platform that enables audiences to actively participate in live shows, such as Mafia, trivia, or talent contests. Unlike traditional streaming, viewers can influence outcomes in real time through voting, chat, and interactive controls, making each session a truly communal experience.

This MVP demonstrates the core platform logic and user experience for a Mafia-style game show with three roles:

- **God (Admin):** Starts and controls the game, invites players, manages the room, and can view/watch real-time votes and AI-generated audience summaries.
- **Players:** Join the live video game as contestants, with camera/mic enabled, and play their roles as assigned by the admin.
- **Watchers (Audience):** Join as spectators, watch/listen live, and contribute by voting, leaving comments, and interacting as a “collective 13th player.”

## Features

- 🔴 **Live Video Grid:** Players join via webcam, displayed in a grid; Watchers can spectate all at once.
- 🧑‍⚖️ **Admin Panel:** God/Admin starts/ends games, manages players, roles, and audience controls.
- 🗳️ **Real-Time Voting:** Audience votes on each round, with results instantly reflected and visualized.
- 🤖 **LLM Summaries:** Audience comments are summarized and analyzed (AI-integration-ready).
- 📩 **Instant Invite Links:** Players join with a single click — no registration needed for MVP.
- 🎛️ **Modern UI:** Clean, dark-themed dashboard, responsive for desktop and mobile.

## Tech Stack

- **Frontend:** React.js (SPA), modular components
- **Backend/Database:** Supabase (Postgres + REST API + Realtime)
- **Video:** Jitsi (open-source live video)
- **AI/LLM:** (Pluggable API integration, e.g., Grok, DeepSeek)
- **Deployment:** Any platform supporting Node.js and React (Vercel, Netlify, etc.)

## How It Works

1. **Admin (“God”)** starts a new game session and shares the invite link with Players.
2. **Players** join the video call and play their roles (e.g., Mafia, Citizen).
3. **Watchers** wait for the show to start, then join to spectate and vote, answer questions, or comment.
4. **Admin** monitors votes, assigns roles, controls all players’ cams/mics, and receives audience analysis.

## Quick Start

1. Clone the repo:  
   `git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`
2. Install dependencies:  
   `npm install`
3. Configure environment variables (Supabase/Jitsi).
4. Start development server:  
   `npm start`

## Customization

- **Add new show/game types** by extending the component structure.
- **Plug in any LLM/AI backend** for more advanced audience analysis.
- **Easily swap video providers** (Jitsi, Zoom SDK, etc.) if needed.

## License

MIT — use, modify, and share freely.

## Contributors

- [Your Name] (Lead)
- [OpenAI GPT-4o, assist)

---

**Contact:**  
Have ideas, want to collaborate, or need support? Open an [issue](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/issues) or contact [YourEmail@example.com].

---
