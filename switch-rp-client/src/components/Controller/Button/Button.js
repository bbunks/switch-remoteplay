import React from "react";
import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <div className={classes.Button}>
      <h1>{props.buttonName}</h1>
    </div>
  );
};

export default Button;
