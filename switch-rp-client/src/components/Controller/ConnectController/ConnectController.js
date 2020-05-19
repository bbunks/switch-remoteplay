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
        <div className={classes.ConnectController}>
          <h3>
            Connecting to {props.hostname}:{props.port}...
          </h3>
          <button onClick={disconnect}>Cancel</button>
        </div>
      );
      break;
    case "connected":
      jsx = (
        <div className={classes.ConnectController}>
          <h3>
            Connected to {props.ip}:{props.port}
          </h3>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      );
      break;
    default:
      jsx = (
        <div className={classes.ConnectController}>
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
        </div>
      );
      break;
  }
  return jsx;
};

export default ConnectController;
