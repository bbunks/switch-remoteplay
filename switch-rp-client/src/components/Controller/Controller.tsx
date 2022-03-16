import React, { useEffect, useState } from "react";
import ControllerButton from "./ControllerButton";
import Diamond from "./Diamond/Diamond";
import Joystick from "./Joystick/Joystick";

interface props {
  controllerState: GamepadStateMap;
}

const BigShoulderButton =
  "bg-neutral-900 my-4 rounded-[10%] flex justify-center text-white font-black text-3xl py-1";
const SmallShoulderButton =
  "bg-neutral-900 rounded-[10%] flex justify-center text-white font-black text-large py-1 grow";

const Pressed = "bg-neutral-500 text-neutral-900";

const Controller = ({
  controllerState,
  children,
}: React.PropsWithChildren<props>) => {
  if (!controllerState) return <div></div>;
  const [mouseDown, setMouseDown] = useState(false);
  useEffect(() => {
    function mouseDown() {
      setMouseDown(() => true);
    }
    document.addEventListener("mousedown", mouseDown);
    function mouseUp() {
      setMouseDown(() => false);
    }
    document.addEventListener("mouseup", mouseUp);
    return () => {
      document.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  return (
    <div className="flex justify-center gap-8 select-none">
      <div className="select-none">
        <ControllerButton
          mouseDown={mouseDown}
          defaultClasses={BigShoulderButton}
          pressedClasses={Pressed}
          button="L"
        >
          <p>L</p>
        </ControllerButton>
        <div className="flex pb-8 items-center">
          <ControllerButton
            mouseDown={mouseDown}
            defaultClasses={SmallShoulderButton}
            pressedClasses={Pressed}
            button="ZL"
          >
            <p>ZL</p>
          </ControllerButton>
          <ControllerButton
            mouseDown={mouseDown}
            defaultClasses={"px-4"}
            pressedClasses={""}
            button="MINUS"
          >
            {/*Minus Sign*/}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={
                "h-6 w-6 " +
                (controllerState.buttons.MINUS
                  ? "stroke-white"
                  : "stroke-neutral-900")
              }
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={4}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </ControllerButton>
        </div>
        <Joystick stickName={"LEFT_STICK"} stickButtonName="L_STICK" />
        <Diamond
          mouseDown={mouseDown}
          buttons={[
            { symbol: "▶", button: "RIGHT" },
            { symbol: "▼", button: "DOWN" },
            { symbol: "▲", button: "UP" },
            { symbol: "◀", button: "LEFT" },
          ]}
        />
      </div>
      <div className="bg-neutral-900 flex flex-col p-4 flex-grow max-w-[23rem]">
        {children}
      </div>
      <div className="select-none">
        <ControllerButton
          mouseDown={mouseDown}
          defaultClasses={BigShoulderButton}
          pressedClasses={Pressed}
          button="R"
        >
          <p>R</p>
        </ControllerButton>
        <div className="flex pb-8 items-center select-none">
          <ControllerButton
            mouseDown={mouseDown}
            defaultClasses={"px-4"}
            pressedClasses={""}
            button="PLUS"
          >
            {/*Plus Sign*/}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={
                "h-6 w-6 " +
                (controllerState.buttons.PLUS
                  ? "stroke-white"
                  : "stroke-neutral-900")
              }
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </ControllerButton>
          <ControllerButton
            mouseDown={mouseDown}
            defaultClasses={SmallShoulderButton}
            pressedClasses={Pressed}
            button="ZR"
          >
            <p>ZR</p>
          </ControllerButton>
        </div>
        <Diamond
          mouseDown={mouseDown}
          buttons={[
            { symbol: "a", button: "A" },
            { symbol: "b", button: "B" },
            { symbol: "x", button: "X" },
            { symbol: "y", button: "Y" },
          ]}
        />
        <Joystick stickName="RIGHT_STICK" stickButtonName="R_STICK" />
      </div>
    </div>
  );
};

export default Controller;
