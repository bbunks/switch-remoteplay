import React, { useRef } from "react";
import { GamepadState } from "../../gamepad/GamepadManager";

interface props {
  defaultClasses: string;
  pressedClasses: string;
  button: string;
  mouseDown: boolean;
}

function preventScroll(e: TouchEvent) {
  e.preventDefault();
}

export default function ControllerButton({
  children,
  defaultClasses,
  pressedClasses,
  mouseDown,
  button,
}: React.PropsWithChildren<props>) {
  const pressed = GamepadState.value.buttons[button];
  const buttonRef = useRef(null);
  const releaseRef = useRef<null | ((event: TouchEvent) => void)>(null);

  function touchStart(e: React.TouchEvent) {
    startClick(e);
    releaseRef.current = (event: TouchEvent) => {
      event.preventDefault();
      var touch = event.touches[0];
      if (
        buttonRef.current !==
        document.elementFromPoint(touch.pageX, touch.pageY)
      ) {
        endClick(event);
        if (!releaseRef.current) return;
        document.removeEventListener("touchmove", releaseRef.current, false);
      }
    };
    document.addEventListener("touchmove", releaseRef.current, false);
  }

  function startClick(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    GamepadState.setButtonState(button, true);
    document.addEventListener("touchmove", preventScroll, {
      passive: false,
    });
  }

  function endClick(
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ) {
    GamepadState.setButtonState(button, false);
    document.removeEventListener("touchmove", preventScroll);
    if (!releaseRef.current) return;
    document.removeEventListener("touchmove", releaseRef.current, false);
  }

  return (
    <div
      className={
        "select-none " + defaultClasses + (pressed ? " " + pressedClasses : "")
      }
      onMouseDown={startClick}
      onTouchStart={touchStart}
      onMouseEnter={(e) => {
        mouseDown && startClick(e);
      }}
      onMouseUp={endClick}
      onTouchEnd={endClick}
      onMouseLeave={(e) => {
        if (pressed) endClick(e);
      }}
      draggable={false}
    >
      {children}
    </div>
  );
}
