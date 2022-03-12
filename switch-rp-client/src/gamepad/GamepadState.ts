import { Watcher } from "../components/Watcher";

export class GamepadState {
  private _state: Watcher<GamepadStateMap>;

  constructor() {
    this._state = new Watcher(INITAL_GAMEPAD_STATE);
  }

  setButtonState(button: string, value: boolean) {
    if (button in this._state.value) {
      this._state.value.buttons[button] = value;
    }
  }

  setAxisState(axis: string, value: number) {
    if (axis in this._state.value) {
      this._state.value.axes[axis] = value;
    }
  }

  getState(): GamepadStateMap {
    return this._state.value;
  }

  addListner(callback: (state: GamepadStateMap) => void) {
    this._state.addListener(callback);
  }

  removeListner(callback: (state: GamepadStateMap) => void) {
    this._state.removeListener(callback);
  }
}

export const GAMEPAD_INPUT = {
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
  R_STICK: "r_stick",
  L_STICK: "l_stick",
  HOME: "home",
  CAPTURE: "capture",
  RIGHT_STICK_X: "right-stick-x",
  RIGHT_STICK_Y: "right-stick-y",
  LEFT_STICK_X: "left-stick-x",
  LEFT_STICK_Y: "left-stick-y",
};

const INITAL_GAMEPAD_STATE: GamepadStateMap = {
  buttons: {
    A: false,
    B: false,
    X: false,
    Y: false,
    UP: false,
    DOWN: false,
    RIGHT: false,
    LEFT: false,
    ZR: false,
    ZL: false,
    R: false,
    L: false,
    PLUS: false,
    MINUS: false,
    R_STICK: false,
    L_STICK: false,
    HOME: false,
    CAPTURE: false,
  },
  axes: {
    RIGHT_STICK_X: 0,
    RIGHT_STICK_Y: 0,
    LEFT_STICK_X: 0,
    LEFT_STICK_Y: 0,
  },
};
