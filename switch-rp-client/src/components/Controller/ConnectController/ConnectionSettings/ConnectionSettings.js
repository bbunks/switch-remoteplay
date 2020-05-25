import React, { useState } from "react";
import classes from "./ConnectionSettings.module.css";
import { setConnection, disconnectSocket } from "../../../../socketio";

const ConnectionSettings = (props) => {
  const [connectionStatus, setConnectionStatus] = useState("");
  const [hostname, setHostname] = useState("127.0.0.1");
  const [port, setPort] = useState("5000");
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

  let jsx = null;
  switch (connectionStatus) {
    case "connecting":
      jsx = (
        <>
          <h3>
            Connecting to {hostname}:{port}...
          </h3>
          <button onClick={disconnect}>Cancel</button>
        </>
      );
      break;
    case "connected":
      jsx = (
        <>
          <h3>
            Connected to {hostname}:{port}
          </h3>
          <button onClick={disconnect}>Disconnect</button>
        </>
      );
      break;
    default:
      jsx = (
        <>
          <h3>Hostname</h3>
          <input
            value={hostname}
            onChange={(e) => {
              setHostname(e.target.value);
            }}
          />

          <h3>Port</h3>
          <input
            value={port}
            onChange={(e) => {
              const reg = /^[0-9]*$/;
              if (reg.test(e.target.value)) setPort(e.target.value);
            }}
          />

          <button onClick={connect}>Connect</button>
        </>
      );
      break;
  }
  return (
    <>
      <h2>Connection</h2>
      <hr />
      {jsx}
    </>
  );
};

export default ConnectionSettings;
