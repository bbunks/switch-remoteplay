import structuredClone from "@ungap/structured-clone";
import { Watcher } from "../utils/Watcher";

function normalize(x: number, y: number): { X: number; Y: number } {
  const distance = Math.sqrt(x * x + y * y);
  if (distance <= 1) return { X: x, Y: y };
  return { X: x / distance, Y: y / distance };
}

function limit(number: number): number {
  return Math.max(Math.min(number, 1), -1);
}

function round(number: number): number {
  return Math.round(number * 100) / 100;
}
export class GamepadState extends Watcher<GamepadStateMap> {
  private _stickChangeListeners: ((
    stick: string,
    changedAxes: { axis: "X" | "Y"; value: number }[]
  ) => void)[];

  private _buttonChangeListeners: ((button: string, value: boolean) => void)[];

  constructor() {
    super(INITAL_GAMEPAD_STATE);
    this._stickChangeListeners = [];
    this._buttonChangeListeners = [];
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

      //run change listeners
      this._buttonChangeListeners.forEach(async (fn) => {
        try {
          fn(button, value);
        } catch (err) {
          console.error(err);
        }
      });

      //run update listeners
      this.callbackFunctions.forEach(async (fn) => {
        try {
          fn(this.InternalValue);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  //Limits total distance to 1 away from center
  setStickState(stick: string, value: { X: number; Y: number }) {
    if (stick in this.InternalValue.sticks) {
      this.InternalValue.sticks[stick] = normalize(value.X, value.Y);

      //run change listeners
      this._stickChangeListeners.forEach(async (fn) => {
        try {
          await fn(stick, [
            { axis: "X", value: round(this.InternalValue.sticks[stick].X) },
            { axis: "Y", value: round(this.InternalValue.sticks[stick].Y) },
          ]);
        } catch (err) {
          console.error(err);
        }
      });

      //run update listeners
      this.callbackFunctions.forEach(async (fn) => {
        try {
          fn(this.InternalValue);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  //limits the stick set to 1. This makes distances greater than 1 possible.
  setAxisState(stick: string, axis: "X" | "Y", value: number) {
    if (stick in this.InternalValue.sticks) {
      const newValue = round(Math.max(Math.min(value, 1), -1));
      this.InternalValue.sticks[stick][axis] = newValue;

      //run change listeners
      this._stickChangeListeners.forEach(async (fn) => {
        try {
          await fn(stick, [{ axis, value: newValue }]);
        } catch (err) {
          console.error(err);
        }
      });

      //run update listeners
      this.callbackFunctions.forEach(async (fn) => {
        try {
          await fn(this.InternalValue);
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
  addButtonChangeListener(handler: (button: string, value: boolean) => void) {
    console.log("Adding a new button listener");
    this._buttonChangeListeners.push(handler);
  }

  removeButtonChangeListener(
    handler: (button: string, value: boolean) => void
  ) {
    this._buttonChangeListeners = this._buttonChangeListeners.filter(
      (ele) => ele !== handler
    );
  }

  addStickChangeListener(
    handler: (
      stick: string,
      changedAxes: { axis: "X" | "Y"; value: number }[]
    ) => void
  ) {
    this._stickChangeListeners.push(handler);
  }

  removeStickChangeListener(
    handler: (
      stick: string,
      changedAxes: { axis: "X" | "Y"; value: number }[]
    ) => void
  ) {
    this._stickChangeListeners = this._stickChangeListeners.filter(
      (ele) => ele !== handler
    );
  }
}

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
    RIGHT_STICK: false,
    LEFT_STICK: false,
    HOME: false,
    CAPTURE: false,
  },
  sticks: {
    RIGHT_STICK: { X: 0, Y: 0 },
    LEFT_STICK: { X: 0, Y: 0 },
  },
};
