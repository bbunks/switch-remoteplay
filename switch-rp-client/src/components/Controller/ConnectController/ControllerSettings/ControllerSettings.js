import React, { useState } from "react";
import classes from "./ControllerSettings.module.css";
import MapManager from "../MapManager/MapManager";

function ControllerSettings(props) {
  const [showMapping, setShowMapping] = useState(false);

  return (
    <>
      <h2>Controls</h2>
      <hr />
      <h3>Controller</h3>
      <select
        value={props.activeController.index}
        onChange={(e) => props.setActiveController(parseInt(e.target.value))}
      >
        {props.controllerList.map((i) => {
          return (
            <option key={i.index} value={i.index}>
              {i.id}
            </option>
          );
        })}
      </select>
      <div className={classes.Row}>
        <h3>Controller Mapping</h3>
        <button onClick={() => setShowMapping(!showMapping)}>
          {showMapping ? "-" : "+"}
        </button>
      </div>
      {showMapping ? <MapManager /> : null}
    </>
  );
}

export default ControllerSettings;
