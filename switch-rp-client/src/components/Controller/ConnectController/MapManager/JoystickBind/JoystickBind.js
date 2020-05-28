import React, { useState, useRef } from "react";
import classes from "./JoystickBind.module.css";
import Bind from "../Bind/Bind";
import { getControllerMap } from "../../../../../gameController";

function JoystickBind(props) {
  return (
    <div className={classes.Bind}>
      <div className={classes.ColContainer}>
        <h4>{props.label}</h4>
      </div>
      {props.emulated ? (
        <>
          <div className={classes.ColContainer}>
            <Bind
              small={true}
              label={props.buttonKey.search("x") >= 0 ? "Left" : "Up"}
              buttonKey={
                props.buttonKey +
                (props.buttonKey.search("x") >= 0 ? "-left" : "-up")
              }
              setToBind={props.setToBind}
            />
          </div>
          <div className={classes.ColContainer}>
            <Bind
              small={true}
              label={props.buttonKey.search("x") >= 0 ? "Right" : "Down"}
              buttonKey={
                props.buttonKey +
                (props.buttonKey.search("x") >= 0 ? "-right" : "-down")
              }
              setToBind={props.setToBind}
            />
          </div>
        </>
      ) : (
        <div className={classes.ColContainer}>
          <Bind
            small={true}
            label="Stick"
            buttonKey={props.buttonKey}
            setToBind={props.setToBind}
          />
        </div>
      )}
    </div>
  );
}

export default JoystickBind;
