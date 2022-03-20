import { GamepadConnectEvent, GamepadDisconnectEvent } from "gamepad.js";
import { createContext } from "react";
import {
  GamepadConnector,
  PythonSwitchController,
} from "../../gamepad/GamepadConnector";
import {
  GamepadController,
  GamepadStateController,
  KeyboardController,
} from "../../gamepad/GamepadController";
import { GamepadListener } from "../../gamepad/GamepadListener";
import { GamepadMapping } from "../../gamepad/GamepadMapping";
import { GamepadState } from "../../gamepad/GamepadState";
import { Watcher } from "../../utils/Watcher";

// create watchers
const controllerListWatcher = new Watcher<ControllerDescription[]>([
  {
    index: -1,
    id: "Keyboard",
  },
]);
const activeControllerIndexWatcher = new Watcher<number>(-1);

// setup responses to eventss
function addController(e: GamepadConnectEvent) {
  console.log("connected");
  controllerListWatcher.value = [
    ...controllerListWatcher.value,
    {
      index: e.detail.index,
      id: e.detail.gamepad.id,
    },
  ];
}
GamepadListener.on("gamepad:connected", addController);

function removeController(e: GamepadDisconnectEvent) {
  if (activeControllerIndexWatcher.value === e.detail.index)
    activeControllerIndexWatcher.value = -1;
  controllerListWatcher.value = [
    ...controllerListWatcher.value.filter((gp) => gp.index !== e.detail.index),
  ];
}
GamepadListener.on("gamepad:disconnected", removeController);

//create watcher rules
function doesGamepadExist(index: number) {
  if (controllerListWatcher.value.findIndex((ele) => ele.index === index) < 0) {
    throw new Error("Active Controller: Gamepad does not exist");
  }
}
activeControllerIndexWatcher.addRule(doesGamepadExist);

const gamepadStateManager = new GamepadState();
const gamepadMap = new GamepadMapping();
const gamepadStateController = new Watcher<GamepadStateController>(
  new KeyboardController(gamepadStateManager, gamepadMap)
);

activeControllerIndexWatcher.addListener((value) => {
  if (value < 0) {
    gamepadStateController.value = new KeyboardController(
      gamepadStateManager,
      gamepadMap
    );
  } else {
    gamepadStateController.value = new GamepadController(
      gamepadStateManager,
      value,
      gamepadMap
    );
  }
});

const gamepadConnectorWatcher = new Watcher<GamepadConnector>(
  new PythonSwitchController()
);

gamepadStateManager.addButtonChangeListener(
  gamepadConnectorWatcher.value.buttonChangeListener
);
gamepadStateManager.addStickChangeListener(
  gamepadConnectorWatcher.value.stickChangeListener
);

//rules run before a value is set. This will always make sure that if we are changing the Controller the old Listeners are removed
gamepadConnectorWatcher.addRule(() => {
  gamepadStateManager.removeButtonChangeListener(
    gamepadConnectorWatcher.value.buttonChangeListener
  );
  gamepadStateManager.removeStickChangeListener(
    gamepadConnectorWatcher.value.stickChangeListener
  );
});

//this will add the listeners whenever a new change is added.
gamepadConnectorWatcher.addListener(() => {
  gamepadStateManager.addButtonChangeListener(
    gamepadConnectorWatcher.value.buttonChangeListener
  );
  gamepadStateManager.addStickChangeListener(
    gamepadConnectorWatcher.value.stickChangeListener
  );
});

export const DefaultValues = {
  gamepadStateManager,
  gamepadMap,
  gamepadStateController,
  controllerListWatcher,
  activeControllerIndexWatcher,
  gamepadConnectorWatcher,
};

export const GamepadContext = createContext(DefaultValues);
