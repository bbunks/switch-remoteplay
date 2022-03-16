import React, { useState } from "react";
import useStickyState from "../../../../customHooks/useStickyState";
import { GamepadStateController } from "../../../../gamepad/GamepadController";
import { disconnectSocket, setConnection } from "../../../../socketio";
import Button from "../../../shared/Button";
import TextInput from "../../../shared/TextInput";

interface props {
  currentGamepad: GamepadStateController;
}

const ConnectionSettings = ({ currentGamepad }: props) => {
  const [connectionStatus, setConnectionStatus] = useState("");
  const [hostname, setHostname] = useStickyState(
    window.location.hostname,
    "hostname"
  );
  const [port, setPort] = useStickyState(window.location.port, "port");
  //Defining how to connect
  const connect = () => {
    setConnectionStatus("connecting");
    setConnection(
      hostname + ":" + port,
      () => setConnectionStatus("connected"),
      () => setConnectionStatus("disconnected")
    );
  };

  //Defining how to disconnect connect
  const disconnect = () => {
    disconnectSocket();
    setConnectionStatus("disconnected");
  };

  switch (connectionStatus) {
    case "connecting":
      return (
        <div className="flex flex-col">
          <h3>
            Connecting to {hostname}:{port}...
          </h3>
          <Button onClick={disconnect}>Cancel</Button>
        </div>
      );
      break;
    case "connected":
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
        <div className="flex flex-col">
          <TextInput
            label="Hostname"
            value={hostname}
            onChange={(e) => {
              setHostname(e.target.value);
            }}
            onFocus={currentGamepad.PauseListeners}
            onBlur={currentGamepad.ResumeListeners}
          />
          <TextInput
            className="pt-4"
            label="Port"
            value={port}
            onChange={(e) => {
              const reg = /^[0-9]*$/;
              if (reg.test(e.target.value)) setPort(e.target.value);
            }}
            onFocus={currentGamepad.PauseListeners}
            onBlur={currentGamepad.ResumeListeners}
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
