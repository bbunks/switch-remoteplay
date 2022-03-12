type ControllerButton = string | number;
type ControllerStick = number;

type GamepadMap = {
  buttons: {
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
    R_STICK: ControllerButton;
    L_STICK: ControllerButton;
    HOME: ControllerButton;
    CAPTURE: ControllerButton;
  };
  axes:
    | {
        emulated: false;
        analog: {
          [key: string]: ControllerStick;
          RIGHT_STICK_X: ControllerStick;
          RIGHT_STICK_Y: ControllerStick;
          LEFT_STICK_X: ControllerStick;
          LEFT_STICK_Y: ControllerStick;
        };
        virtualButton?: any;
      }
    | {
        emulated: true;
        analog?: any;
        virtualButton: {
          [key: string]: ControllerButton;
          RIGHT_STICK_X_UP: ControllerButton;
          RIGHT_STICK_X_DOWN: ControllerButton;
          RIGHT_STICK_Y_LEFT: ControllerButton;
          RIGHT_STICK_Y_RIGHT: ControllerButton;
          LEFT_STICK_X_UP: ControllerButton;
          LEFT_STICK_X_DOWN: ControllerButton;
          LEFT_STICK_Y_LEFT: ControllerButton;
          LEFT_STICK_Y_RIGHT: ControllerButton;
        };
      };
};
