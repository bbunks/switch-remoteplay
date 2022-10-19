import { XIcon } from "@heroicons/react/solid";
import { CSSProperties, useContext, useState } from "react";
import {
  ActionTypes,
  ButtonState,
  CommandType,
  DefaultActionStates,
  Macro,
  makeActionTypeReadable,
  StickState,
} from "../../../../gamepad/GamepadMacros";
import {
  GamepadMapButton,
  GamepadMapStick,
  readableGamepadButton,
} from "../../../../gamepad/GamepadMapping";
import { GamepadContext } from "../../../context/GamepadContext";
import Select from "../../../shared/Select";
import TextInput from "../../../shared/TextInput";
import Toggle from "../../../shared/Toggle";

const reg = /^-?[0-9]*\.?[0-9]*$/;

interface props {
  command: CommandType;
  macro: Macro;
  index: number;
  style: CSSProperties;
}

// TODO: Swap from enums to use current Map. Will be more extendable.
const ActionTypesList = Object.values(ActionTypes).map((ele) => {
  return {
    id: ele,
    name: makeActionTypeReadable(ele),
  };
});

const ButtonList = Object.values(GamepadMapButton).map((ele) => {
  return {
    id: ele,
    name: readableGamepadButton(ele),
  };
});

const ButtonStates = [
  { name: "Press", id: true },
  { name: "Release", id: false },
];

const StickList = Object.values(GamepadMapStick).map((ele) => {
  return {
    id: ele,
    name: ele.slice(0, 1),
  };
});

function TypeSelect({
  command,
  updateCommand,
}: {
  command: CommandType;
  updateCommand: (command: CommandType) => void;
}) {
  return (
    <Select<ActionTypes>
      label="Action Type"
      value={ActionTypesList.find((ele) => ele.id === command?.type)}
      items={ActionTypesList}
      labelClasses="text-black"
      onChange={(item) => {
        const newCommand: CommandType = DefaultActionStates[item.id];
        newCommand.delay = command.delay;
        updateCommand(newCommand);
      }}
    />
  );
}

function ButtonCommand({
  command,
  updateCommand,
}: {
  command: ButtonState;
  updateCommand: (command: ButtonState) => void;
}) {
  return (
    <>
      <Select<GamepadMapButton>
        label="Button"
        value={ButtonList.find((ele) => ele.id === command.button)}
        items={ButtonList}
        labelClasses="text-black"
        onChange={(item) => {
          updateCommand({
            ...command,
            button: item.id,
          });
        }}
      />
      <Select<boolean>
        label="Value"
        value={ButtonStates.find((ele) => ele.id === command.pressed)}
        items={ButtonStates}
        labelClasses="text-black"
        onChange={(item) => {
          updateCommand({
            ...command,
            pressed: item.id,
          });
        }}
      />
    </>
  );
}

function StickCommand({
  command,
  updateCommand,
}: {
  command: StickState;
  updateCommand: (command: StickState) => void;
}) {
  const [stickAxises, setStickAxis] = useState(
    Object.entries(command.changedAxes).map(([key, value]) => {
      return {
        id: key,
        value: value?.toString(),
      };
    })
  );
  return (
    <div className="grid grid-cols-3 gap-2 col-span-2">
      <Select<string>
        label="Stick"
        value={StickList.find((ele) => ele.id === command?.stick)}
        items={StickList}
        labelClasses="text-black"
        containerClasses="rows-span-2"
        onChange={(item) => {
          updateCommand({
            ...command,
            stick: item.id,
          });
        }}
      />
      <div className="grid grid-cols-2 gap-2 col-span-2">
        {Object.keys(command.changedAxes).map((axis, index) => {
          return (
            <>
              <div>
                <label
                  htmlFor={"axesCommand" + index}
                  className={"mb-1 block text-sm font-medium"}
                >
                  Enable {axis}
                </label>
                <Toggle
                  checked={command.changedAxes[axis] !== null}
                  onChange={(value) => {
                    setStickAxis((prev) => [
                      ...prev.filter((ele) => ele.id !== axis),
                      {
                        id: axis,
                        value: value ? "0" : "",
                      },
                    ]);
                    updateCommand({
                      ...command,
                      changedAxes: {
                        ...command.changedAxes,
                        [axis]: value ? 0 : null,
                      },
                    });
                  }}
                />
              </div>
              <TextInput
                disabled={command.changedAxes[axis] === null}
                label="Value"
                labelClasses="text-gray-900"
                value={stickAxises.find((ele) => ele.id === axis)?.value ?? ""}
                onChange={(e) => {
                  if (reg.test(e.target.value)) {
                    setStickAxis((prev) => [
                      ...prev.filter((ele) => ele.id !== axis),
                      {
                        id: axis,
                        value: e.target.value,
                      },
                    ]);
                    updateCommand({
                      ...command,
                      changedAxes: {
                        ...command.changedAxes,
                        [axis]: parseFloat(e.target.value),
                      },
                    });
                  }
                }}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}

function updateCommand(
  macro: Macro,
  command: CommandType,
  commandIndex: number,
  triggerListeners: () => void
) {
  macro.commands[commandIndex] = command;
  triggerListeners();
}

function deleteCommand(
  macro: Macro,
  commandIndex: number,
  triggerListeners: () => void
) {
  macro.commands.splice(commandIndex, 1);
  triggerListeners();
}

function Command({ macro, command, index, style }: props) {
  const { macroManager } = useContext(GamepadContext);
  function wrappedUpdateCommand(newCommand: CommandType) {
    updateCommand(
      macro,
      newCommand,
      index,
      macroManager.macroListWatcher.triggerListeners
    );
  }
  return (
    <div
      style={{
        ...style,
        top: (style.top as number) + 8,
        height: (style.height as number) - 8,
      }}
      className="flex w-full px-2 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
    >
      <div className="z-1 relative">
        <div className="grid grid-cols-2 gap-2 grow">
          <TypeSelect command={command} updateCommand={wrappedUpdateCommand} />
          <TextInput
            label="Delay (ms)"
            labelClasses="text-gray-900"
            value={command.delay}
            onChange={(e) =>
              wrappedUpdateCommand({
                ...command,
                delay: parseInt(e.target.value || "0"),
              })
            }
          />
          {command.type === ActionTypes.BUTTON_ACTION && (
            <ButtonCommand
              command={command}
              updateCommand={wrappedUpdateCommand}
            />
          )}
          {command.type === ActionTypes.STICK_ACTION && (
            <StickCommand
              command={command}
              updateCommand={wrappedUpdateCommand}
            />
          )}
        </div>
        <XIcon
          className="h-4 w-4 shrink-0 grow-0 absolute right-0 top-0"
          onClick={() =>
            deleteCommand(
              macro,
              index,
              macroManager.macroListWatcher.triggerListeners
            )
          }
        />
      </div>
    </div>
  );
}

export default Command;
