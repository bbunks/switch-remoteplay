import { GamepadListener as GamepadJSListener } from "gamepad.js";

export const GamepadListener = new GamepadJSListener({
  deadZone: 0.06,
});
GamepadListener.start();
