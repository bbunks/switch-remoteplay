import React from "react";
import classes from "./ConnectController.module.css";
import ConnectionSettings from "./ConnectionSettings/ConnectionSettings";
import ControllerSettings from "./ControllerSettings/ControllerSettings";

const ConnectController = (props) => {
  //Determining what to render depending on the connection state

  return (
    <div className={classes.ConnectController}>
      <ConnectionSettings />
      <ControllerSettings
        activeController={props.activeController}
        setActiveController={props.setActiveController}
        controllerList={props.controllerList}
      />
    </div>
  );
};

export default ConnectController;
