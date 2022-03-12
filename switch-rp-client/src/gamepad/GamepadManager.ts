import {
  GamepadConnectEvent,
  GamepadDisconnectEvent,
  GamepadListener,
} from "gamepad.js";
import { Watcher } from "../components/Watcher";
import { pressKey, releaseKey } from "../gameController";

// init gamepad listener
const listener = new GamepadListener();
listener.start();

// create watchers
let ControllerListWatcher = new Watcher<ControllerDescription[]>([
  {
    index: -1,
    id: "Keyboard",
  },
]);

let ActiveControllerIndexWatcher = new Watcher<number>(-1);

// setup responses to eventss
function addController(e: GamepadConnectEvent) {
  ControllerListWatcher.value.push({
    index: e.detail.index,
    id: e.detail.gamepad.id,
  });
}
listener.on("gamepad:connected", addController);

function removeController(e: GamepadDisconnectEvent) {
  if (ActiveControllerIndexWatcher.value === e.detail.index)
    ActiveControllerIndexWatcher.value = -1;
  ControllerListWatcher.value = [
    ...ControllerListWatcher.value.filter((gp) => gp.index !== e.detail.index),
  ];
}
listener.on("gamepad:disconnected", removeController);

function doesGamepadExist(index: number) {
  return (
    ControllerListWatcher.value.findIndex((ele) => ele.index === index) < 0
  );
}
ActiveControllerIndexWatcher.addRule(doesGamepadExist);

window.addEventListener("keydown", (e) => pressKey(e, () => {})); //for listening to keyboard. It had setControllerState
window.addEventListener("keyup", (e) => releaseKey(e, () => {})); //for listening to keyboard. It had setControllerState

const GamepadManager = {
  ControllerListWatcher,
  ActiveControllerIndexWatcher,
};

export default GamepadManager;
