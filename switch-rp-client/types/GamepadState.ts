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
    RIGHT_STICK: boolean;
    LEFT_STICK: boolean;
    HOME: boolean;
    CAPTURE: boolean;
  };
  sticks: {
    [key: string]: { X: number; Y: number };
    RIGHT_STICK: { X: number; Y: number };
    LEFT_STICK: { X: number; Y: number };
  };
}
