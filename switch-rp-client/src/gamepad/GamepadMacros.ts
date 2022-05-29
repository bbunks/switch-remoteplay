import { uuidv4 } from "../utils/uuid";
import { Watcher } from "../utils/Watcher";
import { GamepadState } from "./GamepadState";

const DEFAULT_OPTIONS: Options = {
  sensitivity: 0.05,
};

export enum ActionTypes {
  BUTTON_ACTION = "buttonAction",
  STICK_ACTION = "stickAction",
}

export const DefaultActionStates: { [key: string]: CommandType } = {
  [ActionTypes.BUTTON_ACTION]: {
    type: ActionTypes.BUTTON_ACTION,
    delay: 0,
    button: "A",
    pressed: false,
  },
  [ActionTypes.STICK_ACTION]: {
    type: ActionTypes.STICK_ACTION,
    delay: 0,
    stick: "LEFT_STICK",
    changedAxes: { X: null, Y: null },
  },
};

export function makeActionTypeReadable(type: ActionTypes): string {
  switch (type) {
    case ActionTypes.STICK_ACTION:
      return "Stick";
    case ActionTypes.BUTTON_ACTION:
      return "Button";
    default:
      return type;
  }
}

export type Macro = {
  id: string;
  name: string;
  currentlyPlaying: boolean;
  commands: CommandType[];
  completionPercent: 0;
};

export class GamepadMacroManager {
  macroListWatcher: Watcher<Macro[]>;
  private _options: Options;
  private macroListeners: {
    id: string;
    stickListener: (
      stick: string,
      changedAxes: {
        axis: "X" | "Y";
        value: number;
      }[]
    ) => void;
    buttonListener: (button: string, value: boolean) => void;
  }[];

  constructor(options: Partial<Options> = {}) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
    const savedMacros = localStorage.getItem("macros");
    this.macroListWatcher = new Watcher(
      savedMacros ? JSON.parse(savedMacros) : []
    );
    this.macroListWatcher.addListener((value) => {
      console.log("Writing to Storage");
      localStorage.setItem(
        "macros",
        JSON.stringify(
          value.map((ele) => ({
            id: ele.id,
            name: ele.name,
            commands: ele.commands,
          }))
        )
      );
    });
    this.macroListeners = [];

    this.StartMacroRecord = this.StartMacroRecord.bind(this);
    this.StopMacroRecord = this.StopMacroRecord.bind(this);
    this.getMacro = this.getMacro.bind(this);
    this.StopMacro = this.StopMacro.bind(this);
    this.StartMacro = this.StartMacro.bind(this);
    this.createNewMacro = this.createNewMacro.bind(this);
  }

  getMacro(id: string) {
    return this.macroListWatcher.value.find((ele) => ele.id === id);
  }

  StartMacroRecord(id: string, gamepadState: GamepadState) {
    console.log("Recording Started", gamepadState);
    let _timeOfLastInput: number | null = null;
    const macro = this.getMacro(id);
    const triggerListeners = this.macroListWatcher.triggerListeners;

    function buttonListener(button: string, value: boolean) {
      console.log("Button Clicked");
      const delay = _timeOfLastInput ? Date.now() - _timeOfLastInput : 0;
      const newAction: CommandType = {
        type: ActionTypes.BUTTON_ACTION,
        delay,
        button,
        pressed: value,
      };
      macro?.commands.push(newAction);
      triggerListeners();
      _timeOfLastInput = Date.now();
    }

    function stickListener(
      stick: string,
      changedAxes: {
        axis: "X" | "Y";
        value: number;
      }[]
    ) {
      console.log("Stick Moved");
      const delay = _timeOfLastInput ? Date.now() - _timeOfLastInput : 0;
      const newAction: CommandType = {
        type: ActionTypes.STICK_ACTION,
        delay,
        stick,
        changedAxes: {
          X: changedAxes.find((change) => change.axis === "X")?.value ?? null,
          Y: changedAxes.find((change) => change.axis === "Y")?.value ?? null,
        },
      };
      macro?.commands.push(newAction);
      triggerListeners();
      _timeOfLastInput = Date.now();
    }
    gamepadState.addButtonChangeListener(buttonListener);
    gamepadState.addStickChangeListener(stickListener);
    this.macroListeners.push({ id, buttonListener, stickListener });
  }

  StopMacroRecord(id: string, gamepadState: GamepadState) {
    const listeners = this.macroListeners.find((ele) => (ele.id = id));
    if (!listeners) return;
    gamepadState.removeButtonChangeListener(listeners.buttonListener);
    gamepadState.removeStickChangeListener(listeners.stickListener);
  }

  StartMacro(id: string) {
    const macro = this.getMacro(id);
    if (!macro) return;
    macro.currentlyPlaying = true;
    this.macroListWatcher.triggerListeners();
  }

  StopMacro(id: string) {
    const macro = this.getMacro(id);
    if (!macro) return;
    macro.currentlyPlaying = false;
    this.macroListWatcher.triggerListeners();
  }

  setMacroName(id: string, name: string) {
    const macro = this.getMacro(id);
    if (!macro) return;
    macro.name = name;
    this.macroListWatcher.triggerListeners();
    localStorage.setItem("macros", JSON.stringify(this.macroListWatcher.value));
  }

  createNewMacro() {
    const newMacro: Macro = {
      id: uuidv4(),
      name: "No name",
      commands: [],
      completionPercent: 0,
      currentlyPlaying: false,
    };
    this.macroListWatcher.value = [...this.macroListWatcher.value, newMacro];
    return newMacro.id;
  }

  deleteMacro(id: string) {
    this.macroListWatcher.value = [
      ...this.macroListWatcher.value.filter((ele) => ele.id !== id),
    ];
  }
}

interface Options {
  sensitivity: number;
}

interface AxisState {
  [key: string]: number | null;
  X: number | null;
  Y: number | null;
}

interface DefaultState {
  type?: Exclude<
    ActionTypes,
    ActionTypes.BUTTON_ACTION | ActionTypes.STICK_ACTION
  >;
  delay?: number;
  stick?: string;
  changedAxes?: AxisState;
  button?: string;
  pressed?: boolean;
}

export type CommandType = StickState | ButtonState | DefaultState;

export type StickState = {
  type: ActionTypes.STICK_ACTION;
  delay: number;
  stick: string;
  changedAxes: AxisState;
  button?: string;
  pressed?: boolean;
};

export type ButtonState = {
  type: ActionTypes.BUTTON_ACTION;
  delay: number;
  button: string;
  pressed: boolean;
  stick?: string;
  changedAxes?: AxisState;
};
