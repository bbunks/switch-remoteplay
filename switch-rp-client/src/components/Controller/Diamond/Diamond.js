import React from "react";
import classes from "./Diamond.module.css";
import Button from "../Button/Button";
import Blank from "./Blank";

const Diamond = (props) => {
  return (
    <div className={classes.Diamond}>
      <div>
        <Blank />
        <Button buttonName={props.buttons[3]} />
        <Blank />
      </div>
      <div>
        <Button buttonName={props.buttons[2]} />
        <Blank />
        <Button buttonName={props.buttons[1]} />
      </div>
      <div>
        <Blank />
        <Button buttonName={props.buttons[0]} />
        <Blank />
      </div>
    </div>
  );
};

export default Diamond;
