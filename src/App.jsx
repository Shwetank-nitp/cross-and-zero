import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cross from "./assets/2.svg";
import zero from "./assets/1.svg";

const stateContext = createContext();

function useStateContext() {
  return useContext(stateContext);
}

function Start() {
  const { socket, setState, isConnected } = useStateContext();
  const handleFlow = () => {
    socket.emit("startNewGame");
    setState(1);
  };
  console.log(isConnected);
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
  const [open, setOpen] = useState({ is: false, winner: false });

  useEffect(() => {
    // Fair Play Error
    const handleFairPlayError = (message) => {
      console.log("Fair Play Error", message);
      toast.warn(message, {
        position: "top-center",
        autoClose: 3000,
      });
    };

    // Winner
    const handleWinner = (message) => {
      console.log("You won!", message);
      setOpen({ is: true, winner: true });
      toast.success("Congratulations! You won!", {
        position: "top-center",
        autoClose: 3000,
      });
    };

    // Loser
    const handleLoser = (message) => {
      console.log("You lost", message);
      setOpen({ is: true, winner: false });
      toast.error("You lost! Better luck next time.", {
        position: "top-center",
        autoClose: 3000,
      });
    };

    // Get board
    const handleGetBoard = (str) => {
      console.log("getBoard: ", str);
      setGameBoard(str);
    };

    //Draw Game
    const handleDrawGame = (message) => {
      console.log("Game Draw", message);
      setOpen({ is: true, winner: false });
      toast.info("Match draw! Better luck next time.", {
        position: "top-center",
        autoClose: 3000,
      });
    };

    // Register event listeners
    socket.on("fairPlayError", handleFairPlayError);
    socket.on("winner", handleWinner);
    socket.on("looser", handleLoser);
    socket.on("getBoard", handleGetBoard);
    socket.on("draw", handleDrawGame);

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off("fairPlayError", handleFairPlayError);
      socket.off("winner", handleWinner);
      socket.off("looser", handleLoser);
      socket.off("getBoard", handleGetBoard);
      socket.off("draw", handleDrawGame);
    };
  }, []);

  function handleClick(e) {
    console.log("make move :", e.target.name);
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
            {open.winner
              ? "You have won, Click 'Home' to Go to home page"
              : "Ooops, You lost, may be better Luck next time, Click Home to try again"}
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
    console.log(import.meta.env.VITE_HOST);
    setSocket(skt);

    skt.on("connect", () => {
      toast.success("Connected to server", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsConnected(true);
    });

    skt.on("disconnect", () => {
      toast.error("Disconnected from server", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsConnected(false);
    });

    skt.on("waiting", (value) => {
      toast.info("Waiting for opponent", {
        position: "top-center",
        autoClose: 3000,
      });
    });

    skt.on("GameStarted", (value) => {
      setGame(value);
      toast.success("Game started! Let's play!", {
        position: "top-center",
        autoClose: 3000,
      });
    });

    skt.on("error", (error) => {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
    });

    skt.on("quit", (message) => {
      setGame(null);
      toast.info(message, {
        position: "top-center",
        autoClose: 3000,
      });
    });

    skt.on("gameAborted", () => {
      setGame(null);
      toast.warn("Game Aborted!", {
        position: "top-center",
        autoClose: 3000,
      });
    });

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
