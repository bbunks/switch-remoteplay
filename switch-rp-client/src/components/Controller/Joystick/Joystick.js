import React from "react";
import classes from "./Joystick.module.css";

const Joystick = (props) => {
  const styles = {
    transform: `translate(${props.x * 10}px, ${props.y * 10}px)`,
  };
  return <div className={classes.Joystick} style={styles}></div>;
};

export default Joystick;
