import structuredClone from "@ungap/structured-clone";
import { Watcher } from "../utils/Watcher";

export class GamepadMapping {
  private _mapWatcher: Watcher<GamepadMap>;
  private _mapType: string;
  constructor(KeyMap: GamepadMap = DefaultKeyboardMap) {
    this._mapWatcher = new Watcher<GamepadMap>(KeyMap);
    this.setEmulateSticks = this.setEmulateSticks.bind(this);
    this._mapType = "";

    this._mapWatcher.addListener((newMap) => {
      localStorage.setItem(this._mapType + "_map", JSON.stringify(newMap));
    });
  }

  addMappingListner(callback: (map: GamepadMap) => void) {
    this._mapWatcher.addListener(callback);
  }

  getButtonBindings(button: ControllerButton): string[] {
    return Object.keys(this._mapWatcher.value.buttons).filter(
      (key) => this._mapWatcher.value.buttons[key] === button
    );
  }

  setButtonBinding(gamepadButton: string, newInput: ControllerButton) {
    if (gamepadButton in this._mapWatcher.value.buttons) {
      const clone = structuredClone(this._mapWatcher.value);
      clone.buttons[gamepadButton] = newInput;
      this._mapWatcher.value = clone;
    } else
      throw `The gamepad binding '${gamepadButton}' does not exist on the button mapping`;
  }

  setEmulateSticks(value: boolean) {
    let clone = structuredClone(this._mapWatcher.value);
    clone.emulateSticks = value;
    this._mapWatcher.value = clone;
  }

  getEmulatedStickBindings(
    button: ControllerButton
  ): EmulatedControllerStickBinding[] {
    const matches: EmulatedControllerStickBinding[] = [];
    Object.entries(this._mapWatcher.value.sticks).forEach(
      ([stick, { X, Y }]) => {
        if (X.POSITIVE === button)
          matches.push({ stick, axis: "X", direction: "POSITIVE" });
        if (X.NEGATIVE === button)
          matches.push({ stick, axis: "X", direction: "NEGATIVE" });
        if (Y.POSITIVE === button)
          matches.push({ stick, axis: "Y", direction: "POSITIVE" });
        if (Y.NEGATIVE === button)
          matches.push({ stick, axis: "Y", direction: "NEGATIVE" });
      }
    );
    return matches;
  }

  setEmulatedStickBindings(
    binding: EmulatedControllerStickBinding,
    newInput: ControllerButton
  ) {
    if (binding.stick in this._mapWatcher.value.sticks) {
      if (!this._mapWatcher.value.emulateSticks || !binding.direction) return;
      let clone = structuredClone(this._mapWatcher.value);
      clone.sticks[binding.stick][binding.axis][binding.direction] = newInput;
      this._mapWatcher.value = clone;
    } else throw `The stick '${binding.stick}' does not exist on the gamepad`;
  }

  getAnalogStickBindings(
    stickIndex: number,
    axisIndex: number
  ): AnalogControllerStickBinding[] {
    const matches: AnalogControllerStickBinding[] = [];
    Object.entries(this._mapWatcher.value.sticks).forEach(
      ([stick, { X, Y }]) => {
        if (X.AXIS_INDEX === axisIndex && X.STICK_INDEX === stickIndex)
          matches.push({ stick, axis: "X" });
        if (Y.AXIS_INDEX === axisIndex && Y.STICK_INDEX === stickIndex)
          matches.push({ stick, axis: "Y" });
      }
    );
    return matches;
  }

  setAnalogStickBindings(
    binding: AnalogControllerStickBinding,
    newInput: ControllerStick
  ) {
    if (binding.stick in this._mapWatcher.value.sticks) {
      if (this._mapWatcher.value.emulateSticks) return;
      let clone = structuredClone(this._mapWatcher.value);
      clone.sticks[binding.stick][binding.axis] = {
        AXIS_INDEX: newInput.axis,
        STICK_INDEX: newInput.stick,
      };
      this._mapWatcher.value = clone;
    } else throw `The stick '${binding.stick}' does not exist on the gamepad`;
  }

  getGamepadMapping() {
    return this._mapWatcher.value;
  }

  loadControllerMap() {
    this._mapType = "controller";
    const newMapJson = localStorage.getItem(this._mapType + "_map");
    this._mapWatcher.value = newMapJson
      ? (JSON.parse(newMapJson) as GamepadMap)
      : DefaultControllerMap;
  }

  loadKeyboardMap() {
    this._mapType = "keyboard";
    const newMapJson = localStorage.getItem(this._mapType + "_map");
    this._mapWatcher.value = newMapJson
      ? (JSON.parse(newMapJson) as GamepadMap)
      : DefaultKeyboardMap;
  }
}

export const DefaultControllerMap: GamepadMap = {
  emulateSticks: false,
  buttons: {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    UP: 12,
    DOWN: 13,
    LEFT: 14,
    RIGHT: 15,
    ZR: 5,
    ZL: 4,
    R: 7,
    L: 6,
    PLUS: 9,
    MINUS: 8,
    RIGHT_STICK: 11,
    LEFT_STICK: 10,
    HOME: "N/A",
    CAPTURE: "N/A",
  },
  sticks: {
    RIGHT_STICK: {
      X: { AXIS_INDEX: 0, STICK_INDEX: 1 },
      Y: { AXIS_INDEX: 1, STICK_INDEX: 1 },
    },
    LEFT_STICK: {
      X: { AXIS_INDEX: 0, STICK_INDEX: 0 },
      Y: { AXIS_INDEX: 1, STICK_INDEX: 0 },
    },
  },
};

export const DefaultKeyboardMap: GamepadMap = {
  emulateSticks: true,
  buttons: {
    A: "p",
    B: "l",
    X: "o",
    Y: "k",
    UP: "W",
    DOWN: "S",
    RIGHT: "D",
    LEFT: "A",
    ZR: "e",
    ZL: "q",
    R: "3",
    L: "1",
    PLUS: "=",
    MINUS: "-",
    RIGHT_STICK: "/",
    LEFT_STICK: "z",
    HOME: "End",
    CAPTURE: "Home",
  },
  sticks: {
    RIGHT_STICK: {
      X: {
        POSITIVE: "ArrowRight",
        NEGATIVE: "ArrowLeft",
      },
      Y: {
        POSITIVE: "ArrowDown",
        NEGATIVE: "ArrowUp",
      },
    },
    LEFT_STICK: {
      X: {
        POSITIVE: "d",
        NEGATIVE: "a",
      },
      Y: {
        NEGATIVE: "w",
        POSITIVE: "s",
      },
    },
  },
};

export function readableGamepadButton(button: GamepadMapButton) {
  switch (button) {
    case GamepadMapButton.CAPTURE:
      return "Capture";
    case GamepadMapButton.HOME:
      return "Home";
    case GamepadMapButton.LEFT:
      return "Left";
    case GamepadMapButton.RIGHT:
      return "Right";
    case GamepadMapButton.UP:
      return "Up";
    case GamepadMapButton.DOWN:
      return "Down";
    case GamepadMapButton.LEFT_STICK:
      return "Left Stick";
    case GamepadMapButton.RIGHT_STICK:
      return "Right Stick";
    case GamepadMapButton.PLUS:
      return "Plus";
    case GamepadMapButton.MINUS:
      return "Minus";
    default:
      return button;
  }
}

type ControllerButton = string | number;
type ControllerStick = { stick: number; axis: number };

type EmulatedControllerStickBinding = {
  stick: string;
  axis: "X" | "Y";
  direction: "POSITIVE" | "NEGATIVE";
};
type AnalogControllerStickBinding = {
  stick: string;
  axis: "X" | "Y";
};

type AnalogStickMapping = {
  STICK_INDEX: number;
  AXIS_INDEX: number;
  POSITIVE?: null;
  NEGATIVE?: null;
};

type EmulatedStickMapping = {
  STICK_INDEX?: null;
  AXIS_INDEX?: null;
  POSITIVE: ControllerButton;
  NEGATIVE: ControllerButton;
};

type ButtonMap = {
  [key: string]: ControllerButton;
  A: ControllerButton;
  B: ControllerButton;
  X: ControllerButton;
  Y: ControllerButton;
  UP: ControllerButton;
  DOWN: ControllerButton;
  RIGHT: ControllerButton;
  LEFT: ControllerButton;
  ZR: ControllerButton;
  ZL: ControllerButton;
  R: ControllerButton;
  L: ControllerButton;
  PLUS: ControllerButton;
  MINUS: ControllerButton;
  RIGHT_STICK: ControllerButton;
  LEFT_STICK: ControllerButton;
  HOME: ControllerButton;
  CAPTURE: ControllerButton;
};

export enum GamepadMapButton {
  A = "A",
  B = "B",
  X = "X",
  Y = "Y",
  UP = "UP",
  DOWN = "DOWN",
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  ZR = "ZR",
  ZL = "ZL",
  R = "R",
  L = "L",
  PLUS = "PLUS",
  MINUS = "MINUS",
  RIGHT_STICK = "RIGHT_STICK",
  LEFT_STICK = "LEFT_STICK",
  HOME = "HOME",
  CAPTURE = "CAPTURE",
}

export enum GamepadMapStick {
  RIGHT_STICK = "RIGHT_STICK",
  LEFT_STICK = "LEFT_STICK",
}

type GamepadMap =
  | {
      emulateSticks: true;
      buttons: ButtonMap;
      sticks: {
        //this is for adding support for more sticks if needed
        [key: string]: {
          X: EmulatedStickMapping;
          Y: EmulatedStickMapping;
        };
        RIGHT_STICK: {
          X: EmulatedStickMapping;
          Y: EmulatedStickMapping;
        };
        LEFT_STICK: {
          X: EmulatedStickMapping;
          Y: EmulatedStickMapping;
        };
      };
    }
  | {
      emulateSticks: false;
      buttons: ButtonMap;
      sticks: {
        [key: string]: {
          X: AnalogStickMapping;
          Y: AnalogStickMapping;
        };
        RIGHT_STICK: {
          X: AnalogStickMapping;
          Y: AnalogStickMapping;
        };
        LEFT_STICK: {
          X: AnalogStickMapping;
          Y: AnalogStickMapping;
        };
      };
    };
