import React, { useState } from "react";
import classes from "./JoystickBind.module.css";
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
            <p>{props.buttonKey.search("x") >= 0 ? "Left" : "Up"}</p>
            <input
              value={
                getControllerMap()[
                  props.buttonKey +
                    (props.buttonKey.search("x") >= 0 ? "-left" : "-up")
                ]
              }
              onFocus={(e) => props.setToBind([props.buttonKey])}
            />
          </div>
          <div className={classes.ColContainer}>
            <p>{props.buttonKey.search("x") >= 0 ? "Right" : "Down"}</p>
            <input
              value={
                getControllerMap()[
                  props.buttonKey +
                    (props.buttonKey.search("x") >= 0 ? "-right" : "-down")
                ]
              }
              onFocus={(e) => props.setToBind([props.buttonKey])}
            />
          </div>
        </>
      ) : (
        <div className={classes.ColContainer}>
          <input
            value={getControllerMap()[props.buttonKey]}
            onFocus={(e) => props.setToBind([props.buttonKey])}
          />
        </div>
      )}
    </div>
  );
}

export default JoystickBind;
