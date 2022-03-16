import React, { useEffect, useState } from "react";
import ConnectionSettings from "./components/Controller/ConnectController/ConnectionSettings/ConnectionSettings";
import ControllerSettings from "./components/Controller/ConnectController/ControllerSettings/ControllerSettings";
import Controller from "./components/Controller/Controller";
import Header from "./components/Header/Header";
import Disclosure from "./components/shared/Disclosure";
import Tabs from "./components/shared/Tabs";
import useWatcherState from "./customHooks/useWatcherState";
import {
  GamepadController,
  GamepadStateController,
  KeyboardController,
} from "./gamepad/GamepadController";
import * as GamepadManager from "./gamepad/GamepadManager";

export const App = () => {
  const [controllerList] = useWatcherState(
    GamepadManager.ControllerListWatcher
  );
  const [activeController, setActiveController] = useWatcherState(
    GamepadManager.ActiveControllerIndexWatcher
  );

  const [gamepadState] = useWatcherState<GamepadStateMap>(
    GamepadManager.GamepadState
  );

  const [currentGamepad, setCurrentGamepad] = useState<GamepadStateController>(
    new KeyboardController(GamepadManager.GamepadState)
  );

  useEffect(() => {
    GamepadManager.ActiveControllerIndexWatcher.addListener((value) => {
      if (value < 0) {
        setCurrentGamepad(
          () => new KeyboardController(GamepadManager.GamepadState)
        );
      } else {
        setCurrentGamepad(
          () => new GamepadController(GamepadManager.GamepadState, value)
        );
      }
    });
  }, []);

  useEffect(() => {
    currentGamepad.StartListeners();

    return () => {
      currentGamepad.StopListeners();
    };
  }, [currentGamepad]);

  return (
    <div>
      <Header />
      <Controller controllerState={gamepadState}>
        <div className="flex flex-col items-strech text-white">
          <Tabs.TabContainer>
            <Tabs.Tab tabName="Connection">
              <ConnectionSettings currentGamepad={currentGamepad} />
            </Tabs.Tab>
            <Tabs.Tab tabName="Controller">
              <ControllerSettings
                currentGamepad={currentGamepad}
                activeController={activeController}
                setActiveController={setActiveController}
                controllerList={controllerList}
              />
            </Tabs.Tab>
            <Tabs.Tab tabName="Macros">
              <div>To be implemented</div>
            </Tabs.Tab>
            <Tabs.Tab tabName="Info">
              <div className="flex flex-col gap-4">
                <Disclosure title="Instructions">
                  <div>Need to write</div>
                </Disclosure>
                <Disclosure title="About the project">
                  <div>
                    The original source code for this site can be found at{" "}
                    <a href="https://github.com/juharris/switch-remoteplay">
                      https://github.com/juharris/switch-remoteplay
                    </a>
                    .
                  </div>
                </Disclosure>
              </div>
            </Tabs.Tab>
          </Tabs.TabContainer>
        </div>
      </Controller>
    </div>
  );
};
