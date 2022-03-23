import { io, Socket } from "socket.io-client";

export abstract class GamepadConnector {
  constructor() {}
  abstract buttonChangeListener(button: string, value: boolean): void;
  abstract stickChangeListener(
    stick: string,
    changedAxes: { axis: "X" | "Y"; value: number }[]
  ): void;
  abstract connect(
    ip: string,
    onConnect: () => void,
    onDisconnect: () => void
  ): void;
  abstract disconnect(): void;
}

export class PythonSwitchController extends GamepadConnector {
  protected _currentUrl: string;
  _socket: Socket;

  constructor(initalURL = "") {
    super();
    this._socket = io(initalURL);
    this._currentUrl = initalURL;
    this.buttonChangeListener = this.buttonChangeListener.bind(this);
    this.stickChangeListener = this.stickChangeListener.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  connect(ip: string, onConnect: () => void, onDisconnect: () => void) {
    let parsedIP =
      "http://" + ip.replace("http://", "").replace("https://", "");
    this._socket = io(parsedIP, { transports: ["websocket", "polling"] });

    this._socket.on("connect", onConnect);
    this._socket.on("disconnect", onDisconnect);
    //this._socket.onAny((ev, data) => console.log(ev + " | " + data));
  }

  private sendCommand(command: string) {
    if (this._socket) {
      this._socket.emit("p", command);
    }
  }

  disconnect() {
    this._socket.disconnect();
  }

  buttonChangeListener(button: string, value: boolean): void {
    this.sendCommand(
      `${PythonSocketRosetta.buttons[button]} ${value ? "d" : "u"}`
    );
  }

  stickChangeListener(
    stick: string,
    changedAxes: { axis: "X" | "Y"; value: number }[]
  ): void {
    const commands = changedAxes.map(
      (change) =>
        `${PythonSocketRosetta.sticks[stick][change.axis]} ${change.value}`
    );

    this.sendCommand(commands.join("&"));
  }
}

type TranslationRosetta = {
  buttons: {
    [key: string]: string;
  };
  sticks: {
    [key: string]: {
      [key: string]: string;
      X: string;
      Y: string;
    };
  };
};

const PythonSocketRosetta: TranslationRosetta = {
  buttons: {
    A: "a",
    B: "b",
    X: "x",
    Y: "y",
    UP: "up",
    DOWN: "down",
    RIGHT: "right",
    LEFT: "left",
    ZR: "zr",
    ZL: "zl",
    R: "r",
    L: "l",
    PLUS: "plus",
    MINUS: "minus",
    RIGHT_STICK: "r_stick",
    LEFT_STICK: "l_stick",
    HOME: "home",
    CAPTURE: "capture",
  },
  sticks: {
    RIGHT_STICK: {
      X: "s r h",
      Y: "s r v",
    },
    LEFT_STICK: {
      X: "s l h",
      Y: "s l v",
    },
  },
};
