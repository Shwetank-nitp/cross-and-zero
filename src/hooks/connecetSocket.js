import { toast } from "react-toastify";

export class AppEvents {
  constructor(socket, setIsConnected, setGame) {
    this.socket = socket;
    this.setIsConnected = setIsConnected;
    this.setGame = setGame;
  }

  // Method to handle the connect event
  connect() {
    this.socket.on("connect", () => {
      toast.success("Connected to server", {
        position: "top-center",
        autoClose: 3000,
      });
      this.setIsConnected(true);
    });
  }

  // Method to handle the disconnect event
  disConnect() {
    this.socket.on("disconnect", () => {
      toast.error("Disconnected from server", {
        position: "top-center",
        autoClose: 3000,
      });
      this.setIsConnected(false);
    });
  }

  // Method to handle waiting event
  waiting() {
    this.socket.on("waiting", () => {
      toast.info("Waiting for opponent", {
        position: "top-center",
        autoClose: 3000,
      });
    });
  }

  // Method to handle game started event
  gameStarted() {
    this.socket.on("GameStarted", (value) => {
      this.setGame(value);
      toast.success("Game started! Let's play!", {
        position: "top-center",
        autoClose: 3000,
      });
    });
  }

  // Method to handle quit event
  quit() {
    this.socket.on("quit", (message) => {
      this.setGame(null);
      toast.info(message, {
        position: "top-center",
        autoClose: 3000,
      });
    });
  }

  gameAborted() {
    this.socket.on("gameAborted", () => {
      this.setGame(null);
      toast.warn("Game Aborted!", {
        position: "top-center",
        autoClose: 3000,
      });
    });
  }

  addListners() {
    this.connect();
    this.disConnect();
    this.waiting();
    this.quit();
    this.gameAborted();
    this.gameStarted();
  }
}

export class PlayEvents {
  constructor(socket, setGameBoard, setOpen) {
    this.socket = socket;
    this.setGameBoard = setGameBoard;
    this.setOpen = setOpen;
  }

  // Method to handle Fair Play Error event
  fairPlayError() {
    this.socket.on("fairPlayError", (message) => {
      console.log("Fair Play Error", message);
      toast.warn(message, {
        position: "top-center",
        autoClose: 3000,
      });
    });
  }

  // Method to handle Winner event
  winner() {
    this.socket.on("winner", (message) => {
      console.log("You won!", message);
      this.setOpen({ is: true, status: "winner" });
      toast.success("Congratulations! You won!", {
        position: "top-center",
        autoClose: 3000,
      });
    });
  }

  // Method to handle Loser event
  loser() {
    this.socket.on("looser", (message) => {
      console.log("You lost", message);
      this.setOpen({ is: true, status: "loose" });
      toast.error("You lost! Better luck next time.", {
        position: "top-center",
        autoClose: 3000,
      });
    });
  }

  // Method to handle Get Board event
  getBoard() {
    this.socket.on("getBoard", (str) => {
      console.log("getBoard: ", str);
      this.setGameBoard(str);
    });
  }

  // Method to handle Draw Game event
  drawGame() {
    this.socket.on("draw", (message) => {
      console.log("Game Draw", message);
      this.setOpen({ is: true, status: "draw" });
      toast.info("Match draw! Better luck next time.", {
        position: "top-center",
        autoClose: 3000,
      });
    });
  }

  // Method to clean up event listeners
  removeListeners() {
    this.socket.off("fairPlayError");
    this.socket.off("winner");
    this.socket.off("looser");
    this.socket.off("getBoard");
    this.socket.off("draw");
  }

  // Register all event listeners
  registerListeners() {
    this.fairPlayError();
    this.winner();
    this.loser();
    this.getBoard();
    this.drawGame();
  }
}
