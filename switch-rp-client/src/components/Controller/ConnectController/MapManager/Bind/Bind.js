import React from "react";
import classes from "./Bind.module.css";
import { getControllerMap } from "../../../../../gameController";

function Bind(props) {
  return (
    <div className={classes.Bind}>
      <div className={classes.ColContainer}>
        <h4>{props.label}</h4>
      </div>
      <div className={classes.ColContainer}>
        <input
          value={getControllerMap()[props.buttonKey]}
          onFocus={(e) => props.setToBind(props.buttonKey)}
          onBlur={(e) => props.setToBind(null)}
        />
      </div>
    </div>
  );
}

export default Bind;
