import React, { useState } from "react";
import classes from "./ConnectController.module.css";
import StreamSettings from "./StreamSettings/StreamSettings";
import ControllerSettings from "./ControllerSettings/ControllerSettings";
import ConnectionSettings from "./ConnectionSettings/ConnectionSettings";

const ConnectController = (props) => {
  //Determining what to render depending on the connection state

  return (
    <div className={classes.ConnectController}>
      <StreamSettings
        channel={props.channel}
        setChannel={props.setChannel}
        platform={props.platform}
        setPlatform={props.setPlatform}
      />
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
