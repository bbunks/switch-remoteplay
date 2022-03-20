type ControllerButton = string | number;
type ControllerStick = number;

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
  AXIS_INDEX: ControllerStick;
};

type EmulatedStickMapping = {
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
          STICK_INDEX: number;
          X: AnalogStickMapping;
          Y: AnalogStickMapping;
        };
        RIGHT_STICK: {
          STICK_INDEX: number;
          X: AnalogStickMapping;
          Y: AnalogStickMapping;
        };
        LEFT_STICK: {
          STICK_INDEX: number;
          X: AnalogStickMapping;
          Y: AnalogStickMapping;
        };
      };
    };
