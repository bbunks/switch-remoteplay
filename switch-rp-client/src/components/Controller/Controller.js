import React, { useState, useEffect } from "react";
import classes from "./Controller.module.css";
import Joystick from "./Joystick/Joystick";
import Diamond from "./Diamond/Diamond";
import ConnectController from "./ConnectController/ConnectController";
//import "../../gameController";

const Controller = (props) => {
  const [connectionStatus, setConnectionStatus] = useState("");
  const [hostname, setHostname] = useState("127.0.0.1");
  const [port, setPort] = useState("5000");

  return (
    <div className={classes.Controller}>
      <div>
        <Joystick />
        <Diamond buttons={["▶", "▼", "▲", "◀"]} />
      </div>
      <div className={classes.Middle}>
        <h1>Switch RP</h1>
        <ConnectController
          connectionStatus={connectionStatus}
          hostname={hostname}
          hostnameChange={setHostname}
          setConnectionStatus={setConnectionStatus}
          port={port}
          portChange={setPort}
        />
      </div>
      <div>
        <Diamond buttons={["a", "b", "x", "y"]} />
        <Joystick />
      </div>
    </div>
  );
};

export default Controller;
