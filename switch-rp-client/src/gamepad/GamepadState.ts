import structuredClone from "@ungap/structured-clone";
import { Watcher } from "../components/Watcher";

function normalize(x: number, y: number): { X: number; Y: number } {
  const distance = Math.sqrt(x * x + y * y);
  if (distance <= 1) return { X: x, Y: y };
  return { X: x / distance, Y: y / distance };
}
export class GamepadState extends Watcher<GamepadStateMap> {
  private _changeListeners: ((
    button: string,
    value: boolean | number
  ) => void)[];

  constructor() {
    super(INITAL_GAMEPAD_STATE);
    this._changeListeners = [];
  }

  set value(value: GamepadStateMap) {
    console.error(
      "You are not able to directly set the state value, please use setButtonState or setAxisState",
      value
    );
  }

  get value() {
    return this.InternalValue;
  }

  setButtonState(button: string, value: boolean) {
    if (button in this.InternalValue.buttons) {
      const clone = structuredClone(this.InternalValue);
      clone.buttons[button] = value;
      this.InternalValue = clone;
      this._changeListeners.forEach(async (fn) => {
        try {
          fn(button, value);
        } catch (err) {
          console.error(err);
        }
      });
      this.callbackFunctions.forEach(async (fn) => {
        try {
          fn(this.InternalValue);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  setStickState(stick: string, value: { X: number; Y: number }) {
    if (stick in this.InternalValue.sticks) {
      this.InternalValue.sticks[stick] = normalize(value.X, value.Y);
      this._changeListeners.forEach(async (fn) => {
        try {
          fn("X", this.InternalValue.sticks[stick].X);
          fn("Y", this.InternalValue.sticks[stick].Y);
        } catch (err) {
          console.error(err);
        }
      });
      this.callbackFunctions.forEach(async (fn) => {
        try {
          fn(this.InternalValue);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  setAxisState(stick: string, axis: "X" | "Y", value: number) {
    if (stick in this.InternalValue.sticks) {
      this.InternalValue.sticks[stick][axis] = Math.max(Math.min(value, 1), -1);
      this._changeListeners.forEach(async (fn) => {
        try {
          fn(axis, value);
        } catch (err) {
          console.error(err);
        }
      });
      this.callbackFunctions.forEach(async (fn) => {
        try {
          fn(this.InternalValue);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  moveAxisState(stick: string, axis: "X" | "Y", value: number) {
    if (stick in this.InternalValue.sticks) {
      this.setAxisState(
        stick,
        axis,
        this.InternalValue.sticks[stick][axis] + value
      );
    }
  }

  // this returns the change itself. this will be used to sed key strokes and button presses
  addChangeListener(
    handler: (button: string, value: boolean | number) => void
  ) {
    this._changeListeners.push(handler);
  }

  removeChangeListener(
    handler: (button: string, value: boolean | number) => void
  ) {
    this._changeListeners = this._changeListeners.filter(
      (ele) => ele !== handler
    );
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
  sticks: {
    RIGHT_STICK: { X: 0, Y: 0 },
    LEFT_STICK: { X: 0, Y: 0 },
  },
};
