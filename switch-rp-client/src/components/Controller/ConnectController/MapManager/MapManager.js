import React, { useState, useEffect } from "react";
import classes from "./MapManager.module.css";
import Bind from "./Bind/Bind";
import JoystickBind from "./JoystickBind/JoystickBind";
import {
  getControllerMap,
  setBind,
  getNextButton,
  addMirrorMap,
  removeMirrorMap,
} from "../../../../gameController";

function MapManager(props) {
  let [controllerMap, setControllerMap] = useState(getControllerMap());
  const [toBind, setToBind] = useState(null);
  const [emulated, setEmulated] = useState(controllerMap["emulate-joystick"]);

  useEffect(() => {
    console.log("Adding MapMirror");
    addMirrorMap((map) => {
      console.log(map["emulate-joystick"]);
      setControllerMap(map);
      setEmulated(map["emulate-joystick"]);
    }, "MapManager");

    return () => {
      console.log("Removing MapMirror");
      removeMirrorMap("MapManager");
    };
  }, []);

  const setButtonBindTrigger = (key, inputRef) => {
    setToBind(key);

    if (key) {
      getNextButton((nextButton) => {
        console.log("Got the presses for " + key + ": " + nextButton);
        setBind(key, nextButton);
        inputRef.current.blur();
      });
    } else {
      getNextButton(null);
    }
  };

  //These could be generated with a object.keys, but I want to organize them and this was the best way I could think of
  return (
    <div className={classes.MapManager}>
      <div className={classes.Row}>
        <div className={classes.ButtonGroup}>
          <Bind label="A" buttonKey="a" setToBind={setButtonBindTrigger} />
          <Bind label="B" buttonKey="b" setToBind={setButtonBindTrigger} />
          <Bind label="X" buttonKey="x" setToBind={setButtonBindTrigger} />
          <Bind label="Y" buttonKey="y" setToBind={setButtonBindTrigger} />
        </div>
        <div className={classes.ButtonGroup}>
          <Bind label="Up" buttonKey="up" setToBind={setButtonBindTrigger} />
          <Bind
            label="Down"
            buttonKey="down"
            setToBind={setButtonBindTrigger}
          />
          <Bind
            label="Left"
            buttonKey="left"
            setToBind={setButtonBindTrigger}
          />
          <Bind
            label="Right"
            buttonKey="right"
            setToBind={setButtonBindTrigger}
          />
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
              });
            }}
          />
        </div>
        <JoystickBind
          label="Left Stick X"
          emulated={emulated}
          buttonKey="left-stick-x"
          setToBind={setButtonBindTrigger}
        />
        <JoystickBind
          label="Left Stick Y"
          emulated={emulated}
          buttonKey="left-stick-y"
          setToBind={setButtonBindTrigger}
        />
        <JoystickBind
          label="Right Stick X"
          emulated={emulated}
          buttonKey="right-stick-x"
          setToBind={setButtonBindTrigger}
        />
        <JoystickBind
          label="Right Stick Y"
          emulated={emulated}
          buttonKey="right-stick-y"
          setToBind={setButtonBindTrigger}
        />
      </div>
      <div className={classes.Row}>
        <div className={classes.ButtonGroup}>
          <Bind
            label="Left Stick Click"
            buttonKey="l_stick"
            setToBind={setButtonBindTrigger}
          />
          <Bind
            label="Left Bumper"
            buttonKey="zl"
            setToBind={setButtonBindTrigger}
          />
          <Bind
            label="Left Trigger"
            buttonKey="l"
            setToBind={setButtonBindTrigger}
          />
        </div>
        <div className={classes.ButtonGroup}>
          <Bind
            label="Right Stick Click"
            buttonKey="r_stick"
            setToBind={setButtonBindTrigger}
          />
          <Bind
            label="Right Bumper"
            buttonKey="zr"
            setToBind={setButtonBindTrigger}
          />
          <Bind
            label="Right Trigger"
            buttonKey="r"
            setToBind={setButtonBindTrigger}
          />
        </div>
      </div>
    </div>
  );
}

export default MapManager;
