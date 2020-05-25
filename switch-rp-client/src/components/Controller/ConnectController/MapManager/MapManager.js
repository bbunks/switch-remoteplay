import React, { useState } from "react";
import classes from "./MapManager.module.css";
import Bind from "./Bind/Bind";

function MapManager(props) {
  const [controllerMap, setContollerMap] = useState({
    a: 0,
    b: 0,
    x: 0,
    y: 0,
    up: 0,
    down: 0,
    right: 0,
    left: 0,
    rb: 0,
    lb: 0,
    rt: 0,
    lt: 0,
    start: 0,
    select: 0,
    "right-stick-x-left": 0,
    "right-stick-x-right": 0,
    "right-stick-y-up": 0,
    "right-stick-y-down": 0,
    "left-stick-x-left": 0,
    "left-stick-y-right": 0,
    "left-stick-x-up": 0,
    "left-stick-y-down": 0,
  });

  return (
    <div className={classes.MapManager}>
      <div className={classes.Row}>
        <div className={classes.ButtonGroup}>
          <Bind label="A" />
          <Bind label="B" />
          <Bind label="X" />
          <Bind label="Y" />
        </div>
        <div className={classes.ButtonGroup}>
          <Bind label="Up" />
          <Bind label="Down" />
          <Bind label="Left" />
          <Bind label="Right" />
        </div>
      </div>
      <div className={classes.ButtonGroup}>
        <Bind label="Left Stick X" />
        <Bind label="Left Stick Y" />
        <Bind label="Right Stick X" />
        <Bind label="Right Stick Y" />
      </div>
      <div className={classes.Row}>
        <div className={classes.ButtonGroup}>
          <Bind label="Left Trigger" />
          <Bind label="Left Bumper" />
        </div>
        <div className={classes.ButtonGroup}>
          <Bind label="Right Trigger" />
          <Bind label="Right Bumper" />
        </div>
      </div>
    </div>
  );
}

export default MapManager;
