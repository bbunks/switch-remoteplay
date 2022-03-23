import { GamepadAxisEvent, GamepadButtonEvent } from "gamepad.js";
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
        gamepadContext.gamepadStateController.value.HijackButtonListners(
          (e: KeyboardEvent | GamepadButtonEvent) => {
            gamepadContext.gamepadMap.setButtonBinding(
              buttonName,
              typeof e.detail === "object" ? e.detail.button : e.key
            );

            //start the blur process once key is pressed
            document.addEventListener("keyup", () => {
              const activeInput = document.activeElement as HTMLInputElement;
              activeInput.blur();
              gamepadContext.gamepadStateController.value.ResumeListeners();
            });
          }
        );
      },
      onBlur: () => {
        gamepadContext.gamepadStateController.value.ResumeListeners();
      },
      value: gamepadMap.buttons[buttonName],
    };
  }

  function makeJoystickBindProps(stickName: string, axis: "X" | "Y") {
    return {
      POSITIVE_PROPS: {
        onFocus: () => {
          gamepadContext.gamepadStateController.value.HijackButtonListners(
            (e: KeyboardEvent | GamepadButtonEvent) => {
              gamepadContext.gamepadMap.setEmulatedStickBindings(
                { axis, stick: stickName, direction: "POSITIVE" },
                typeof e.detail === "object" ? e.detail.button : e.key
              );

              //start the blur process once key is pressed
              document.addEventListener("keyup", () => {
                const activeInput = document.activeElement as HTMLInputElement;
                activeInput.blur();
                gamepadContext.gamepadStateController.value.ResumeListeners();
              });
            }
          );
        },
        onBlur: gamepadContext.gamepadStateController.value.ResumeListeners,
      },
      NEGATIVE_PROPS: {
        onFocus: () => {
          gamepadContext.gamepadStateController.value.HijackButtonListners(
            (e: KeyboardEvent | GamepadButtonEvent) => {
              gamepadContext.gamepadMap.setEmulatedStickBindings(
                { axis, stick: stickName, direction: "NEGATIVE" },
                typeof e.detail === "object" ? e.detail.button : e.key
              );

              //start the blur process once key is pressed
              document.addEventListener("keyup", () => {
                const activeInput = document.activeElement as HTMLInputElement;
                activeInput.blur();
                gamepadContext.gamepadStateController.value.ResumeListeners();
              });
            }
          );
        },
        onBlur: gamepadContext.gamepadStateController.value.ResumeListeners,
      },
      ANALOG_PROPS: {
        onFocus: () => {
          gamepadContext.gamepadStateController.value.HijackStickListners(
            (e: GamepadAxisEvent) => {
              gamepadContext.gamepadMap.setAnalogStickBindings(
                { stick: stickName, axis },
                { axis: e.detail.axis, stick: e.detail.stick }
              );

              const activeInput = document.activeElement as HTMLInputElement;
              activeInput.blur();
            }
          );
        },
        onBlur: gamepadContext.gamepadStateController.value.ResumeListeners,
      },
      POSITIVE: gamepadMap.sticks[stickName][axis]?.POSITIVE ?? "n/a",
      NEGATIVE: gamepadMap.sticks[stickName][axis]?.NEGATIVE ?? "n/a",
      AXIS_INDEX: gamepadMap.sticks[stickName][axis]?.AXIS_INDEX ?? "n/a",
      STICK_INDEX: gamepadMap.sticks[stickName][axis]?.STICK_INDEX ?? "n/a",
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
            <Tabs.Tab title={stick + " Stick"} key={stick + "jsbind"}>
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
