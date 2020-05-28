import React, { useRef } from "react";
import classes from "./Bind.module.css";
import { getControllerMap } from "../../../../../gameController";

function Bind(props) {
  const inputRef = useRef();

  return (
    <div className={classes.Bind + (props.small ? " " + classes.Mini : "")}>
      <div className={classes.ColContainer}>
        {props.small ? <p>{props.label}</p> : <h4>{props.label}</h4>}
      </div>
      <div className={classes.ColContainer}>
        <input
          ref={inputRef}
          value={getControllerMap()[props.buttonKey]}
          onFocus={(e) => props.setToBind(props.buttonKey, inputRef)}
          onBlur={(e) => props.setToBind(null, inputRef)}
        />
      </div>
    </div>
  );
}

export default Bind;
