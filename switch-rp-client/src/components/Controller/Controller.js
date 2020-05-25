import React, { useState } from "react";
import classes from "./Controller.module.css";
import Joystick from "./Joystick/Joystick";
import Diamond from "./Diamond/Diamond";
import ConnectController from "./ConnectController/ConnectController";
const Controller = (props) => {
  return (
    <div className={classes.Controller}>
      <div>
        <Joystick
          x={props.controllerState["left-stick-x"]}
          y={props.controllerState["left-stick-y"]}
          pressed={props.controllerState["l_stick"]}
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
          controllerList={props.controllerList}
          activeController={props.activeController}
          setActiveController={props.setActiveController}
          channel={props.channel}
          setChannel={props.setChannel}
          platform={props.platform}
          setPlatform={props.setPlatform}
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
          pressed={props.controllerState["r_stick"]}
        />
      </div>
    </div>
  );
};

export default Controller;
