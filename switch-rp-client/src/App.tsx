import { useContext, useEffect } from "react";
import {
  DefaultValues,
  GamepadContext,
} from "./components/context/GamepadContext";
import ConnectionSettings from "./components/Controller/ConnectController/ConnectionSettings/ConnectionSettings";
import ControllerSettings from "./components/Controller/ConnectController/ControllerSettings/ControllerSettings";
import Controller from "./components/Controller/Controller";
import Header from "./components/Header/Header";
import Disclosure from "./components/shared/Disclosure";
import Tabs from "./components/shared/Tabs";
import useWatcherState from "./customHooks/useWatcherState";
import { GamepadStateController } from "./gamepad/GamepadController";

export const App = () => {
  const gamepadContext = useContext(GamepadContext);
  const [controllerList] = useWatcherState(
    gamepadContext.controllerListWatcher
  );
  const [activeController, setActiveController] = useWatcherState(
    gamepadContext.activeControllerIndexWatcher
  );

  const [gamepadState] = useWatcherState<GamepadStateMap>(
    gamepadContext.gamepadStateManager
  );

  const [currentGamepad, setCurrentGamepad] =
    useWatcherState<GamepadStateController>(
      gamepadContext.gamepadStateController
    );

  useEffect(() => {
    currentGamepad.StartListeners();

    return () => {
      currentGamepad.StopListeners();
    };
  }, [currentGamepad]);

  return (
    <GamepadContext.Provider value={DefaultValues}>
      <div>
        <Header />
        <Controller controllerState={gamepadState}>
          <div className="flex flex-col items-strech text-white">
            <Tabs.TabContainer>
              <Tabs.Tab title="Connection">
                <ConnectionSettings currentGamepad={currentGamepad} />
              </Tabs.Tab>
              <Tabs.Tab title="Controller">
                <ControllerSettings
                  currentGamepad={currentGamepad}
                  activeController={activeController}
                  setActiveController={setActiveController}
                  controllerList={controllerList}
                />
              </Tabs.Tab>
              <Tabs.Tab title="Macros">
                <div>To be implemented</div>
              </Tabs.Tab>
              <Tabs.Tab title="Info">
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
    </GamepadContext.Provider>
  );
};
