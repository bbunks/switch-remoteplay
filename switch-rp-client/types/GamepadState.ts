interface GamepadStateMap {
  buttons: {
    [key: string]: boolean;
    A: boolean;
    B: boolean;
    X: boolean;
    Y: boolean;
    UP: boolean;
    DOWN: boolean;
    RIGHT: boolean;
    LEFT: boolean;
    ZR: boolean;
    ZL: boolean;
    R: boolean;
    L: boolean;
    PLUS: boolean;
    MINUS: boolean;
    R_STICK: boolean;
    L_STICK: boolean;
    HOME: boolean;
    CAPTURE: boolean;
  };
  axes: {
    [key: string]: number;
    RIGHT_STICK_X: number;
    RIGHT_STICK_Y: number;
    LEFT_STICK_X: number;
    LEFT_STICK_Y: number;
  };
}
