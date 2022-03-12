import React from "react";
import Controller from "./components/Controller/Controller";
import Header from "./components/Header/Header";
import useWatcherState from "./customHooks/useWatcherState";
import GamepadManager from "./gamepad/GamepadManager";
import { GamepadState } from "./gamepad/GamepadState";

export const App = () => {
  const [controllerList, setControllerList] = useWatcherState(
    GamepadManager.ControllerListWatcher
  );
  const [activeController, setActiveController] = useWatcherState(
    GamepadManager.ActiveControllerIndexWatcher
  );

  return (
    <div className="bg-slate-700">
      <Header />
      <Controller
        controllerList={controllerList}
        activeController={activeController}
        setActiveController={setActiveController}
        controllerState={new GamepadState()}
      />
    </div>
  );
};
