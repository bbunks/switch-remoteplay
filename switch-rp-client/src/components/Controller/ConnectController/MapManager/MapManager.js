import React, { useState } from "react";
import classes from "./MapManager.module.css";
import Bind from "./Bind/Bind";
import { getControllerMap } from "../../../../gameController";

function MapManager(props) {
  let controllerMap = getControllerMap();

  return (
    <div className={classes.MapManager}>
      <div className={classes.Row}>
        <div className={classes.ButtonGroup}>
          <Bind label="A" value={controllerMap.a} />
          <Bind label="B" value={controllerMap.b} />
          <Bind label="X" value={controllerMap.x} />
          <Bind label="Y" value={controllerMap.y} />
        </div>
        <div className={classes.ButtonGroup}>
          <Bind label="Up" value={controllerMap.up} />
          <Bind label="Down" value={controllerMap.down} />
          <Bind label="Left" value={controllerMap.left} />
          <Bind label="Right" value={controllerMap.right} />
        </div>
      </div>
      <div className={classes.ButtonGroup}>
        <Bind label="Left Stick X" value={controllerMap["left-stick-x"]} />
        <Bind label="Left Stick Y" value={controllerMap["left-stick-y"]} />
        <Bind label="Right Stick X" value={controllerMap["right-stick-x"]} />
        <Bind label="Right Stick Y" value={controllerMap["right-stick-y"]} />
      </div>
      <div className={classes.Row}>
        <div className={classes.ButtonGroup}>
          <Bind label="Left Trigger" value={controllerMap.l} />
          <Bind label="Left Bumper" value={controllerMap.zl} />
        </div>
        <div className={classes.ButtonGroup}>
          <Bind label="Right Trigger" value={controllerMap.r} />
          <Bind label="Right Bumper" value={controllerMap.zr} />
        </div>
      </div>
    </div>
  );
}

export default MapManager;
