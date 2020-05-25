import React from "react";
import classes from "./Bind.module.css";

function Bind(props) {
  return (
    <div className={classes.Bind}>
      <div className={classes.ColContainer}>
        <h4>{props.label}</h4>
      </div>
      <div className={classes.ColContainer}>
        <input></input>
      </div>
    </div>
  );
}

export default Bind;
