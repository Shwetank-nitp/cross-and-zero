import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cross from "./assets/2.svg";
import zero from "./assets/1.svg";
import { stateContext, useStateContext } from "./hooks/state-provider";
import { AppEvents, PlayEvents } from "./hooks/connecetSocket";
import { Loading } from "./components/ui/loading";
import {
  AnimatedButton,
  DangerButton,
  PrimaryButton,
} from "./components/ui/button";
import { ContainerGlass } from "./components/ui/container";
import waiting from "./assets/waiting.gif";

function Start() {
  const { socket, setState, isConnected } = useStateContext();
  const handleFlow = () => {
    socket.emit("startNewGame");
    setState(1);
  };
  return (
    <ContainerGlass>
      {isConnected ? (
        <>
          <h3 className="text-2xl">Welcome to game! Click Start to play</h3>
          <AnimatedButton onClick={handleFlow}>Start Game</AnimatedButton>
        </>
      ) : (
        <Loading />
      )}
    </ContainerGlass>
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
    console.log("makeMOde", e.target.name);
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
    <div className="relative flex flex-col place-items-center w-full gap-2">
      {open.is && (
        <ContainerGlass className={"absolute top-[38%] z-10 opacity-100"}>
          <div>
            {open.status === "winner" ? (
              <p className="text-blue-900">
                {"You have won, Click 'Home' to Go to home page"}
              </p>
            ) : open.status === "looser" ? (
              <p className="text-red-900">
                {
                  "Ooops, You lost, may be better Luck next time, Click Home to try again"
                }
              </p>
            ) : (
              <p className="text-yellow-900">
                {"ohh, you made a draw, try again"}
              </p>
            )}
          </div>
          <PrimaryButton className={"text-white"} onClick={handleFlow}>
            Home
          </PrimaryButton>
        </ContainerGlass>
      )}
      <div className="player-info">
        <div>
          <span>Your Id: </span>
          <span>{game?.playerId}</span>
        </div>
        <span>{`you : ${game?.your_mark}`}</span>
      </div>
      <ContainerGlass>
        <div className="grid grid-cols-3 grid-rows-3 w-full h-[95vw] sm:h-[420px]">
          {gameBoard.split("/").map((str, row) => {
            return str.split(" ").map((val, col) => (
              <button
                className={`w-full h-full p-1 ${
                  (row * 3 + col) % 2 === 0 ? "bg-purple-700" : "bg-slate-300"
                }`}
                key={`${row + " " + col}`}
                onClick={handleClick}
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
      </ContainerGlass>
      <div className="player-info">
        <div>
          <span>Opponent Id: </span>
          <span>{game?.opponent}</span>
        </div>
        <span>{`opponent : ${game?.opp_mark}`}</span>
      </div>
      <DangerButton onClick={handleQuit}>Quit</DangerButton>
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
  return (
    <ContainerGlass>
      <div>
        <img src={waiting} alt="waiting" />
        <p className="my-3 text-xl">Waiting for Someone to play with you</p>
      </div>
    </ContainerGlass>
  );
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
