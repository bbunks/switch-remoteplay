import React, { useState, useEffect } from "react";
import classes from "./Controller.module.css";
import Joystick from "./Joystick/Joystick";
import Diamond from "./Diamond/Diamond";
import ConnectController from "./ConnectController/ConnectController";
const Controller = (props) => {
  const [connectionStatus, setConnectionStatus] = useState("");
  const [hostname, setHostname] = useState("127.0.0.1");
  const [port, setPort] = useState("5000");

  return (
    <div className={classes.Controller}>
      <div>
        <Joystick
          x={props.controllerState["left-stick-x"]}
          y={props.controllerState["left-stick-y"]}
        />
        <Diamond
          buttons={[
            { symbol: "▶", pressed: props.controllerState.right },
            { symbol: "▼", pressed: props.controllerState.down },
            { symbol: "▲", pressed: props.controllerState.up },
            { symbol: "◀", pressed: props.controllerState.left },
          ]}
        />
      </div>
      <div className={classes.Middle}>
        <ConnectController
          connectionStatus={connectionStatus}
          hostname={hostname}
          hostnameChange={setHostname}
          setConnectionStatus={setConnectionStatus}
          port={port}
          portChange={setPort}
          controllerList={props.controllerList}
          activeController={props.activeController}
          setActiveController={props.setActiveController}
        />
      </div>
      <div>
        <Diamond
          buttons={[
            { symbol: "a", pressed: props.controllerState.a },
            { symbol: "b", pressed: props.controllerState.b },
            { symbol: "x", pressed: props.controllerState.x },
            { symbol: "y", pressed: props.controllerState.y },
          ]}
        />
        <Joystick
          x={props.controllerState["right-stick-x"]}
          y={props.controllerState["right-stick-y"]}
        />
      </div>
    </div>
  );
};

export default Controller;
