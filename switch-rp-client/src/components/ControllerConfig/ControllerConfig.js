import React from "react";
import classes from "./ControllerConfig.module.css";
import { getController } from "../../gameController";
import Bind from "./Bind/Bind";

const ControllerConfig = (props) => {
  return (
    <div className={classes.ControllerConfig}>
      <div className={classes.Card}>
        <Bind />
      </div>
    </div>
  );
};

export default ControllerConfig;
