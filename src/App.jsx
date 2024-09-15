import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cross from "./assets/2.svg";
import zero from "./assets/1.svg";
import { stateContext, useStateContext } from "./hooks/state-provider";
import { AppEvents, PlayEvents } from "./hooks/connecetSocket";

function Start() {
  const { socket, setState, isConnected } = useStateContext();
  const handleFlow = () => {
    socket.emit("startNewGame");
    setState(1);
  };
  return (
    <div className="container">
      <h3>Welcome to game! Click Start to play</h3>
      <button disabled={!isConnected} onClick={handleFlow}>
        Start Game
      </button>
    </div>
  );
}

function Play() {
  const [gameBoard, setGameBoard] = useState("* * */* * */* * *");
  const { socket, setGame, game, setState } = useStateContext();
  const [open, setOpen] = useState({ is: false, status: "none" });

  useEffect(() => {
    const events = new PlayEvents(socket, setGameBoard, setOpen);
    events.registerListeners();
    return () => {
      events.removeListeners();
    };
  }, []);

  function handleClick(e) {
    socket.emit("makeMove", e.target.name);
  }

  function handleFlow() {
    setGame(null);
    setState(0);
  }

  function handleQuit() {
    socket.emit("quit");
    setGame(null);
    setState(0);
  }

  return (
    <div className="container relative">
      {open.is && (
        <div className="pop-up">
          <p>
            {open.status === "winner"
              ? "You have won, Click 'Home' to Go to home page"
              : open.status === "looser"
              ? "Ooops, You lost, may be better Luck next time, Click Home to try again"
              : "ohh, you made a draw, try again"}
          </p>
          <button onClick={handleFlow}>Home</button>
        </div>
      )}
      <div className="player-info">
        <div>
          <span>Your Id: </span>
          <span>{game?.playerId}</span>
        </div>
        <span>{`you : ${game?.your_mark}`}</span>
      </div>
      <div className="play-grid-box">
        {gameBoard.split("/").map((str, row) => {
          return str.split(" ").map((val, col) => (
            <button
              key={`${row + " " + col}`}
              onClick={handleClick}
              className="grid-item"
              name={`${row + " " + col}`}
            >
              {val === "*" ? (
                ""
              ) : (
                <img src={val === "x" ? cross : zero} alt={val}></img>
              )}
            </button>
          ));
        })}
      </div>
      <div className="player-info">
        <div>
          <span>Opponent Id: </span>
          <span>{game?.opponent}</span>
        </div>
        <span>{`opponent : ${game?.opp_mark}`}</span>
      </div>
      <button onClick={handleQuit}>Quit</button>
    </div>
  );
}

function Waiting() {
  const { game, setState } = useStateContext();
  useEffect(() => {
    if (game) {
      setState(2);
    }
  }, [game]);
  return <h1>Loading...</h1>;
}

function GameFlow() {
  const { state } = useStateContext();
  switch (state) {
    case 0:
      return <Start />;
    case 1:
      return <Waiting />;
    case 2:
      return <Play />;
    default: {
      console.warn("error - default");
      return <Start />;
    }
  }
}

function App() {
  const [state, setState] = useState(0);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [game, setGame] = useState(null);

  useEffect(() => {
    const skt = io(import.meta.env.VITE_HOST);
    setSocket(skt);

    const events = new AppEvents(skt, setIsConnected, setGame);

    //AppEvents
    events.addListners();

    return () => {
      if (skt) skt.disconnect();
      setIsConnected(false);
    };
  }, []);

  return (
    <>
      <stateContext.Provider
        value={{ setState, state, socket, game, setGame, isConnected }}
      >
        <GameFlow />
        <ToastContainer />
      </stateContext.Provider>
    </>
  );
}

export default App;
