import { Watcher } from "../components/Watcher";

export class GamepadMapping {
  map: Watcher<GamepadMap>;
  constructor() {
    this.map = new Watcher<GamepadMap>(DefaultKeyboardMap);
  }

  setGamepadMapping(map: GamepadMap) {
    this.map.value = map;
  }

  addMappingListner(callback: (map: GamepadMap) => void) {
    this.map.addListener(callback);
  }

  getButtonBindings(button: ControllerButton): string[] {
    const buttonMatches = Object.keys(this.map.value.buttons).filter(
      (key) => this.map.value.buttons[key] === button
    );

    if (!this.map.value.axes.emulated) return buttonMatches;

    let virtualStickButtonMatches = Object.keys(
      this.map.value.axes.virtualButton
    ).filter((key) => this.map.value.buttons[key] === button);

    return [...buttonMatches, ...virtualStickButtonMatches];
  }

  getAnalogStickBindings(stick: ControllerStick): string[] {
    return (
      Object.keys(this.map).filter(
        (key) => this.map.value.axes.analog[key] === stick
      ) ?? ""
    );
  }
}

export const DefaultControllerMap: GamepadMap = {
  buttons: {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    UP: 12,
    DOWN: 13,
    RIGHT: 14,
    LEFT: 15,
    ZR: 5,
    ZL: 4,
    R: 7,
    L: 6,
    PLUS: 9,
    MINUS: 8,
    R_STICK: 11,
    L_STICK: 10,
    HOME: "N/A",
    CAPTURE: "N/A",
  },
  axes: {
    emulated: false,
    analog: {
      RIGHT_STICK_X: 2,
      RIGHT_STICK_Y: 3,
      LEFT_STICK_X: 0,
      LEFT_STICK_Y: 1,
    },
  },
};

export const DefaultKeyboardMap: GamepadMap = {
  buttons: {
    A: "p",
    B: "l",
    X: "o",
    Y: "k",
    UP: "W",
    DOWN: "S",
    RIGHT: "A",
    LEFT: "D",
    ZR: 5,
    ZL: 4,
    R: 7,
    L: 6,
    PLUS: "=",
    MINUS: "-",
    R_STICK: 11,
    L_STICK: 10,
    HOME: "End",
    CAPTURE: "Home",
  },
  axes: {
    emulated: true,
    virtualButton: {
      RIGHT_STICK_X_UP: "ArrowUp",
      RIGHT_STICK_X_DOWN: "ArrowDown",
      RIGHT_STICK_Y_LEFT: "ArrowLeft",
      RIGHT_STICK_Y_RIGHT: "ArrowRight",
      LEFT_STICK_X_UP: "a",
      LEFT_STICK_X_DOWN: "d",
      LEFT_STICK_Y_LEFT: "w",
      LEFT_STICK_Y_RIGHT: "s",
    },
  },
};
