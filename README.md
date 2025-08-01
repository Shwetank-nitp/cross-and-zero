# 🎮 Realtime Tic-Tac-Toe – A Multiplayer Game Experience with React + Socket.io

## 📌 Introduction

This React project aims to create a **real-time multiplayer game** with an **interactive UI**, offering a lightweight and engaging entry point into the world of **live communication platforms**. The goal is to provide a clean, responsive interface that demonstrates how seamless real-time interaction can enhance even the simplest of games—like classic Tic-Tac-Toe.

---

## 📖 Project Description

This project is built using:

- **React** – Component-driven UI development with modern hooks.
- **React Router DOM** – For dynamic navigation between game states and routes.
- **Socket.io Client** – For real-time communication between players.
- **Custom CSS** – A clean and minimal interface handcrafted to prioritize **usability and clarity**.

🛠️ The project is divided into **two repositories**:

1. **Frontend (this repo)** – Manages the user interface and state transitions using React.
2. **Backend** – Handles real-time socket connections and move validation using **Node.js + Socket.io**.

👉 [🔗 Backend Repository](https://github.com/Shwetank-nitp/backend-game-x0)

---

## 🧠 How It Works

### 🎮 Game State Flow

The frontend operates on a simple state-driven mechanism:

- **State 1**: Initial state — player is not in a game.
- **State 2**: The player has joined a room and is matched with another player.

Once both players are matched, the game begins.

### 🗺️ Game Representation

The game board is internally represented as a single string: `***/***/***`

- `*` indicates an **empty** cell.
- `/` is a **row separator**.
- Cells are updated with either `X` or `O` based on the player's assigned marker.

### 🔄 Real-Time Move Logic

- A player's move updates the local board and is **sent to the backend**.
- The backend **validates** the move (e.g., correct turn, unoccupied cell).
- Once validated, the move is **broadcasted** to the opponent.
- The frontend listens for updates via **Socket.io events** to reflect the new board state in real time.
---

## 🚀 What I Learned

This project was a hands-on journey into building **real-time systems** with:

- 📡 **Socket.io Client** – Learning how to establish and manage real-time connections in React.
- 🔁 **Event-driven architecture** – Handling server-emitted events and syncing multiple clients.
- ⚛️ **React Hooks & State** – Managing clean and maintainable state logic across components.
- 🎮 **Game Design Basics** – Understanding UX patterns for turn-based multiplayer games.

Working on this game helped me **bridge the gap between frontend and real-time backend systems**, while keeping the **focus on user experience and interactivity**.

---

## 👋 Final Thoughts

This project is a demonstration of how **React can be extended beyond static interfaces**, offering dynamic and interactive experiences. By combining **state management** with **real-time communication**, even classic games can feel fresh and modern.
