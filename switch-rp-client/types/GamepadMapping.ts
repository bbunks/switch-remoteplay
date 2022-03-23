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
