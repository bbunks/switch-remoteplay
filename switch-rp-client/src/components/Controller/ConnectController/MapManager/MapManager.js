import React, { useState } from "react";
import classes from "./MapManager.module.css";
import Bind from "./Bind/Bind";
import JoystickBind from "./JoystickBind/JoystickBind";
import { getControllerMap, setBind } from "../../../../gameController";

function MapManager(props) {
  let controllerMap = getControllerMap();
  const [toBind, setToBind] = useState(null);
  const [emulated, setEmulated] = useState(controllerMap["emulate-joystick"]);

  //These could be generated with a object.keys, but I want to organize them and this was the best way I could think of
  return (
    <div className={classes.MapManager}>
      <div className={classes.Row}>
        <div className={classes.ButtonGroup}>
          <Bind label="A" buttonKey="a" setToBind={setToBind} />
          <Bind label="B" buttonKey="b" setToBind={setToBind} />
          <Bind label="X" buttonKey="x" setToBind={setToBind} />
          <Bind label="Y" buttonKey="y" setToBind={setToBind} />
        </div>
        <div className={classes.ButtonGroup}>
          <Bind label="Up" buttonKey="up" setToBind={setToBind} />
          <Bind label="Down" buttonKey="down" setToBind={setToBind} />
          <Bind label="Left" buttonKey="left" setToBind={setToBind} />
          <Bind label="Right" buttonKey="right" setToBind={setToBind} />
        </div>
      </div>
      <div className={classes.ButtonGroup}>
        <div className={classes.Row}>
          <h4>Emulate Joysticks</h4>
          <input
            className={classes.RowSelect}
            type="checkbox"
            checked={emulated}
            onChange={() => {
              setEmulated((prev) => {
                setBind("emulate-joystick", !prev);
                return !prev;
              });
            }}
          />
        </div>
        <JoystickBind
          label="Left Stick X"
          value={controllerMap["left-stick-x"]}
          emulated={emulated}
          buttonKey="left-stick-x"
        />
        <JoystickBind
          label="Left Stick Y"
          value={controllerMap["left-stick-y"]}
          emulated={emulated}
          buttonKey="left-stick-y"
        />
        <JoystickBind
          label="Right Stick X"
          value={controllerMap["right-stick-x"]}
          emulated={emulated}
          buttonKey="right-stick-x"
        />
        <JoystickBind
          label="Right Stick Y"
          value={controllerMap["right-stick-y"]}
          emulated={emulated}
          buttonKey="right-stick-y"
        />
      </div>
      <div className={classes.Row}>
        <div className={classes.ButtonGroup}>
          <Bind label="Left Trigger" buttonKey="l" setToBind={setToBind} />
          <Bind label="Left Bumper" buttonKey="zl" setToBind={setToBind} />
        </div>
        <div className={classes.ButtonGroup}>
          <Bind label="Right Trigger" buttonKey="r" setToBind={setToBind} />
          <Bind label="Right Bumper" buttonKey="zr" setToBind={setToBind} />
        </div>
      </div>
    </div>
  );
}

export default MapManager;
