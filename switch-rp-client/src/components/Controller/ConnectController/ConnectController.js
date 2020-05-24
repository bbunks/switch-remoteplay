import React from "react";
import classes from "./ConnectController.module.css";
import { setConnection, disconnectSocket } from "../../../socketio";

const ConnectController = (props) => {
  //Defining how to connect
  const connect = () => {
    props.setConnectionStatus("connecting");
    setConnection(
      props.hostname + ":" + props.port,
      () => props.setConnectionStatus("connected"),
      () => props.setConnectionStatus("disconnected")
    );
  };

  //Defining how to disconnect connect
  const disconnect = () => {
    disconnectSocket();
    props.setConnectionStatus("disconnected");
  };

  //Determining what to render depending on the connection state
  let jsx = null;
  switch (props.connectionStatus) {
    case "connecting":
      jsx = (
        <>
          <h3>
            Connecting to {props.hostname}:{props.port}...
          </h3>
          <button onClick={disconnect}>Cancel</button>
        </>
      );
      break;
    case "connected":
      jsx = (
        <>
          <h3>
            Connected to {props.ip}:{props.port}
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
            value={props.hostname}
            onChange={(e) => {
              props.hostnameChange(e.target.value);
            }}
          />

          <h3>Port</h3>
          <input
            value={props.port}
            onChange={(e) => {
              const reg = /^[0-9]*$/;
              if (reg.test(e.target.value)) props.portChange(e.target.value);
            }}
          />

          <button onClick={connect}>Connect</button>
        </>
      );
      break;
  }
  return (
    <div className={classes.ConnectController}>
      <h2>Connection</h2>
      <hr />
      {jsx}
      <h2>Controller</h2>
      <hr />
      <select
        value={props.activeController.index}
        onChange={(e) => props.setActiveController(parseInt(e.target.value))}
      >
        {props.controllerList.map((i) => {
          return (
            <option key={i.index} value={i.index}>
              {i.id}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ConnectController;
