import { GamepadConnectEvent, GamepadDisconnectEvent } from "gamepad.js";
import { Watcher } from "../components/Watcher";
import { GamepadListener } from "./GamepadListener";
import { GamepadState as GamepadStateClass } from "./GamepadState";

// init gamepad listener

// create watchers
export let ControllerListWatcher = new Watcher<ControllerDescription[]>([
  {
    index: -1,
    id: "Keyboard",
  },
]);
export let ActiveControllerIndexWatcher = new Watcher<number>(-1);

// setup responses to eventss
function addController(e: GamepadConnectEvent) {
  console.log("connected");
  ControllerListWatcher.value = [
    ...ControllerListWatcher.value,
    {
      index: e.detail.index,
      id: e.detail.gamepad.id,
    },
  ];
}
GamepadListener.on("gamepad:connected", addController);

function removeController(e: GamepadDisconnectEvent) {
  if (ActiveControllerIndexWatcher.value === e.detail.index)
    ActiveControllerIndexWatcher.value = -1;
  ControllerListWatcher.value = [
    ...ControllerListWatcher.value.filter((gp) => gp.index !== e.detail.index),
  ];
}
GamepadListener.on("gamepad:disconnected", removeController);

//create watcher rules
function doesGamepadExist(index: number) {
  if (ControllerListWatcher.value.findIndex((ele) => ele.index === index) < 0) {
    throw new Error("Active Controller: Gamepad does not exist");
  }
}
ActiveControllerIndexWatcher.addRule(doesGamepadExist);

export const GamepadState = new GamepadStateClass();
