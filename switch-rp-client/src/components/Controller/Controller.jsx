import React from "react";
import ConnectController from "./ConnectController/ConnectController";
import classes from "./Controller.module.css";
import Diamond from "./Diamond/Diamond";
import Joystick from "./Joystick/Joystick";
const Controller = (props) => {
  return (
    <div className={classes.Controller}>
      <div>
        <div>
          <div
            className={
              classes.LargeButton +
              (props.controllerState["l"] ? " " + classes.Pressed : "")
            }
          >
            <p>L</p>
          </div>
          <div className={classes.Row}>
            <div
              className={
                classes.SmallButton +
                (props.controllerState["zl"] ? " " + classes.Pressed : "")
              }
            >
              <p>ZL</p>
            </div>
            <div
              className={
                classes.Symbol +
                (props.controllerState["minus"] ? " " + classes.PressedAlt : "")
              }
            >
              <p>-</p>
            </div>
          </div>
        </div>
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
        />
      </div>
      <div>
        <div>
          <div
            className={
              classes.LargeButton +
              (props.controllerState["r"] ? " " + classes.Pressed : "")
            }
          >
            <p>R</p>
          </div>
          <div className={classes.Row}>
            <div
              className={
                classes.Symbol +
                (props.controllerState["plus"] ? " " + classes.PressedAlt : "")
              }
            >
              <p>+</p>
            </div>
            <div
              className={
                classes.SmallButton +
                (props.controllerState["zr"] ? " " + classes.Pressed : "")
              }
            >
              <p>ZR</p>
            </div>
          </div>
        </div>
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
