import React from "react";
import Button from "../Button/Button";
import Blank from "./Blank";

type button = { symbol: string; button: string };
type props = {
  buttons: button[];
  mouseDown: boolean;
};

const Diamond = ({ buttons, mouseDown }: props) => {
  return (
    <div className="select-none flex items-center justify-center py-4">
      <div>
        <Blank />
        <Button button={buttons[3]} mouseDown={mouseDown} />
        <Blank />
      </div>
      <div>
        <Button button={buttons[2]} mouseDown={mouseDown} />
        <Blank />
        <Button button={buttons[1]} mouseDown={mouseDown} />
      </div>
      <div>
        <Blank />
        <Button button={buttons[0]} mouseDown={mouseDown} />
        <Blank />
      </div>
    </div>
  );
};

export default Diamond;
