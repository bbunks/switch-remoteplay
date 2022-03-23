import { useContext, useState } from "react";
import useStickyState from "../../../../customHooks/useStickyState";
import useWatcherState from "../../../../customHooks/useWatcherState";
import { PythonSwitchController } from "../../../../gamepad/GamepadConnector";
import { GamepadStateController } from "../../../../gamepad/GamepadController";
import { GamepadContext } from "../../../context/GamepadContext";
import Button from "../../../shared/Button";
import Select from "../../../shared/Select";
import TextInput from "../../../shared/TextInput";

interface props {
  currentGamepad: GamepadStateController;
}

interface ListItem {
  name: string;
  id: number;
}

enum ConnectionStatus {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
}

const ControllerTypes = [{ id: 0, name: "Switch Controller" }];

const ConnectionSettings = ({ currentGamepad }: props) => {
  const gamepadContext = useContext(GamepadContext);
  const [gamepadConnector, setGamepadConnector] = useWatcherState(
    gamepadContext.gamepadConnectorWatcher
  );
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.DISCONNECTED
  );
  const [hostname, setHostname] = useStickyState(
    window.location.hostname,
    "hostname"
  );
  const [port, setPort] = useStickyState(window.location.port, "port");
  const [controllerType, setControllerType] = useState(ControllerTypes[0]);
  //Defining how to connect
  const connect = () => {
    setConnectionStatus(ConnectionStatus.CONNECTING);
    gamepadConnector.connect(
      hostname + ":" + port,
      () => setConnectionStatus(ConnectionStatus.CONNECTED),
      () => setConnectionStatus(ConnectionStatus.DISCONNECTED)
    );
  };

  function SelectConnectionTypeChange(selected: ListItem) {
    setControllerType(selected);
    gamepadContext.gamepadStateManager.addButtonChangeListener(
      gamepadContext.gamepadConnectorWatcher.value.buttonChangeListener
    );
    gamepadContext.gamepadStateManager.addButtonChangeListener(
      gamepadContext.gamepadConnectorWatcher.value.buttonChangeListener
    );
    setGamepadConnector(new PythonSwitchController());
  }

  //Defining how to disconnect connect
  const disconnect = () => {
    gamepadConnector.disconnect();
    setConnectionStatus(ConnectionStatus.DISCONNECTED);
  };

  switch (connectionStatus) {
    case ConnectionStatus.CONNECTING:
      return (
        <div className="flex flex-col">
          <h3>
            Connecting to {hostname}:{port}...
          </h3>
          <Button onClick={disconnect}>Cancel</Button>
        </div>
      );
      break;
    case ConnectionStatus.CONNECTED:
      return (
        <div className="flex flex-col">
          <h3>
            Connected to {hostname}:{port}
          </h3>
          <Button onClick={disconnect}>Disconnect</Button>
        </div>
      );
      break;
    default:
      return (
        <div className="flex flex-col gap-4">
          <TextInput
            label="Hostname"
            value={hostname}
            onChange={(e) => {
              setHostname(e.target.value);
            }}
          />
          <TextInput
            label="Port"
            value={port}
            id="port-input"
            onChange={(e) => {
              const reg = /^[0-9]*$/;
              if (reg.test(e.target.value)) setPort(e.target.value);
            }}
          />
          {/*this will not be nessicary with and intermediary server*/}
          <Select
            label={"Connection Type"}
            items={ControllerTypes}
            value={controllerType}
            onChange={SelectConnectionTypeChange}
          />
          <div className="flex justify-center mt-2">
            <Button onClick={connect}>Connect</Button>
          </div>
        </div>
      );
      break;
  }
};

export default ConnectionSettings;
