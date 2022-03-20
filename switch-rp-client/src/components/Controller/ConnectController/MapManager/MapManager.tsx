import { useContext, useEffect, useState } from "react";
import { GamepadContext } from "../../../context/GamepadContext";
import Tabs from "../../../shared/Tabs";
import Toggle from "../../../shared/Toggle";
import Bind from "./Bind/Bind";
import JoystickBind from "./JoystickBind/JoystickBind";

function MapManager() {
  const gamepadContext = useContext(GamepadContext);
  const [gamepadMap, setGamepadMap] = useState(
    gamepadContext.gamepadMap.getGamepadMapping()
  );

  const gamepadMapManager = gamepadContext.gamepadMap;

  useEffect(() => {
    function updateState(value: GamepadMap) {
      setGamepadMap(() => value);
    }
    gamepadMapManager.addMappingListner(updateState);
    return () => {
      gamepadMapManager.addMappingListner(updateState);
    };
  });

  const emulated = gamepadMap.emulateSticks;

  function makeButtonBindProps(buttonName: string) {
    return {
      onFocus: () => {
        // gamepadContext.gamepadStateController.value.HijackButtonListners(
        //   (e: KeyboardEvent | GamepadButtonEvent) => {}
        // );
      },
      value: gamepadMap.buttons[buttonName],
    };
  }

  function makeJoystickBindProps(stickName: string, axis: "X" | "Y") {
    return {
      onFocus: () => {
        gamepadContext.gamepadStateController.value.HijackStickListners(
          (e: GamepadAxisEvent) => {}
        );
      },
      ...(emulated
        ? {
            POSITIVE: gamepadMap.sticks[stickName][axis].POSITIVE,
            NEGATIVE: gamepadMap.sticks[stickName][axis].NEGATIVE,
          }
        : { STICK_INDEX: gamepadMap.sticks[stickName][axis].AXIS_INDEX }),
      axis,
      emulated,
    };
  }

  //These could be generated with a object.keys, but I want to organize them and this was the best way I could think of
  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-8">
        <div>
          <Bind label="Up" {...makeButtonBindProps("UP")} />
          <Bind label="Down" {...makeButtonBindProps("DOWN")} />
          <Bind label="Left" {...makeButtonBindProps("LEFT")} />
          <Bind label="Right" {...makeButtonBindProps("RIGHT")} />
          <Bind label="ZL" {...makeButtonBindProps("ZL")} />
          <Bind label="L" {...makeButtonBindProps("L")} />
          <Bind label="Capture" {...makeButtonBindProps("CAPTURE")} />
          <Bind label="Minus" {...makeButtonBindProps("MINUS")} />
        </div>
        <div>
          <Bind label="A" {...makeButtonBindProps("A")} />
          <Bind label="B" {...makeButtonBindProps("B")} />
          <Bind label="X" {...makeButtonBindProps("X")} />
          <Bind label="Y" {...makeButtonBindProps("Y")} />
          <Bind label="ZR" {...makeButtonBindProps("ZR")} />
          <Bind label="R" {...makeButtonBindProps("R")} />
          <Bind label="Home" {...makeButtonBindProps("HOME")} />
          <Bind label="Plus" {...makeButtonBindProps("PLUS")} />
        </div>
      </div>
      <Toggle
        label="Emulate Joysticks"
        checked={emulated}
        onChange={gamepadContext.gamepadMap.setEmulateSticks}
        tooltip="This is used to determine if joysticks should read from actual joysticks or from keystrokes"
      />

      <div className="justify-center items-center gap-8">
        <Tabs.TabContainer>
          {["LEFT", "RIGHT"].map((stick) => (
            <Tabs.Tab title={stick + " Stick"}>
              <JoystickBind {...makeJoystickBindProps(stick + "_STICK", "X")} />
              <JoystickBind {...makeJoystickBindProps(stick + "_STICK", "Y")} />
              <Bind
                label="Stick Click"
                {...makeButtonBindProps(stick + "_STICK")}
              />
            </Tabs.Tab>
          ))}
        </Tabs.TabContainer>
      </div>
    </div>
  );
}

export default MapManager;
