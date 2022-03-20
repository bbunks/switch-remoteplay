import { useContext, useRef } from "react";
import { GamepadContext } from "../../context/GamepadContext";

type props = {
  stickName: string;
  stickButtonName: string;
};

function preventScroll(e: any) {
  e.preventDefault();
}

const Joystick = ({ stickName, stickButtonName }: props) => {
  const gamepadContext = useContext(GamepadContext);
  const moved = useRef(false);
  const prevX = useRef(0);
  const prevY = useRef(0);
  const prevH = useRef(0);
  const prevV = useRef(0);

  const x = gamepadContext.gamepadStateManager.value.sticks[stickName].X ?? 0;
  const y = gamepadContext.gamepadStateManager.value.sticks[stickName].Y ?? 0;
  const pressed =
    gamepadContext.gamepadStateManager.value.buttons[stickButtonName];

  //const distance = Math.sqrt(x * x + y * y); used with rotate3d(0, ${x}, ${y}, ${distance * 18}deg) for a perspective

  const styles = {
    transform: `translate(${x * 12}px, ${y * 12}px)`,
  };

  function onSelect(
    e:
      | React.TouchEvent<HTMLDivElement>
      | React.DragEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    let x, y;
    moved.current = false;
    if (e.type.includes("drag")) {
      const event = e as React.DragEvent<HTMLDivElement>;
      x = event.clientX;
      y = event.clientY;
    } else if (e.type === "mousedown") {
      const event = e as React.MouseEvent<HTMLDivElement, MouseEvent>;
      x = event.screenX;
      y = event.screenY;

      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", onUnselect);
    } else {
      const event = e as React.TouchEvent<HTMLDivElement>;

      const touch = event.targetTouches[0];
      x = touch.clientX;
      y = touch.clientY;
    }
    prevX.current = x;
    prevY.current = y;

    document.addEventListener("touchmove", preventScroll, { passive: false });
    e.preventDefault();
  }

  function onDrag(
    e:
      | React.TouchEvent<HTMLDivElement>
      | React.DragEvent<HTMLDivElement>
      | MouseEvent
  ) {
    let x, y;
    if (e.type.includes("drag")) {
      const event = e as React.DragEvent<HTMLDivElement>;
      x = event.clientX;
      y = event.clientY;
    } else if (e.type === "mousemove") {
      const event = e as MouseEvent;
      x = event.screenX;
      y = event.screenY;
    } else {
      const event = e as React.TouchEvent<HTMLDivElement>;

      const touch = event.targetTouches[0];
      x = touch.clientX;
      y = touch.clientY;
    }
    const scale = 32;
    const threshold = 0.01;
    const h = (x - prevX.current) / scale;
    const v = (y - prevY.current) / scale;
    if (
      Math.abs(h - prevH.current) > threshold ||
      Math.abs(v - prevV.current) > threshold
    ) {
      moved.current = true;
      gamepadContext.gamepadStateManager.setStickState(stickName, {
        Y: v,
        X: h,
      });
    }
    prevH.current = h;
    prevV.current = v;
  }

  function onUnselect(
    e:
      | React.TouchEvent<HTMLDivElement>
      | React.DragEvent<HTMLDivElement>
      | MouseEvent
  ) {
    document.removeEventListener("touchmove", preventScroll);
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", onUnselect);

    gamepadContext.gamepadStateManager.setAxisState(stickName, "X", 0);
    gamepadContext.gamepadStateManager.setAxisState(stickName, "Y", 0);

    e.preventDefault();
  }

  return (
    <div className="relative h-32 w-32 m-auto flex items-center justify-center">
      <div
        className={`h-32 w-32 rounded-[50%] my-4 mx-auto absolute outline outline-2 outline-gray-500 ${
          pressed ? "bg-neutral-500" : "bg-neutral-900"
        }`}
      />
      <div
        className={`h-[6.5rem] w-[6.5rem] rounded-[50%] my-4 mx-auto absolute ${
          pressed ? "bg-black" : "bg-white"
        }`}
        style={styles}
        onDragStart={onSelect}
        onTouchStart={onSelect}
        onMouseDown={onSelect}
        onDrag={onDrag}
        onTouchMove={onDrag}
        onDragEnd={onUnselect}
        onTouchEnd={onUnselect}
      />
    </div>
  );
};

export default Joystick;
