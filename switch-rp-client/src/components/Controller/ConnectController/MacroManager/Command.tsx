import { XIcon } from "@heroicons/react/solid";
import { useContext } from "react";
import {
  ActionTypes,
  ButtonState,
  Macro,
  readableActionTypes,
  StickState,
} from "../../../../gamepad/GamepadMacros";
import {
  GamepadMapButton,
  GamepadMapStick,
  readableGamepadButton,
} from "../../../../gamepad/GamepadMapping";
import { GamepadContext } from "../../../context/GamepadContext";
import Disclosure from "../../../shared/Disclosure";
import Select from "../../../shared/Select";
import TextInput from "../../../shared/TextInput";

interface props {
  command: StickState | ButtonState;
  macro: Macro;
  index: number;
}

// TODO: Swap from enums to use current Map. Will be more extendable.
const ActionTypesList = Object.values(ActionTypes).map((ele) => {
  return {
    id: ele,
    name: readableActionTypes(ele),
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

const AxesList = [
  { name: "X", id: "X" },
  { name: "Y", id: "Y" },
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
  command: ButtonState | StickState;
  updateCommand: (command: ButtonState) => void;
}) {
  return (
    <Select<ActionTypes>
      label="Action Type"
      value={ActionTypesList.find((ele) => ele.id === command?.type)}
      items={ActionTypesList}
      labelClasses="text-black"
      onChange={(item) => {
        updateCommand({
          ...command,
          type: item.id,
        });
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
  return (
    <>
      <div className="grid grid-cols-3 gap-2 col-span-2">
        <Select<ActionTypes>
          label="Stick"
          value={StickList.find((ele) => ele.id === command?.type)}
          items={StickList}
          labelClasses="text-black"
          onChange={(item) => {
            updateCommand({
              ...command,
              type: item.id,
            });
          }}
        />
        <Select<ActionTypes>
          label="Axis"
          value={AxesList.find((ele) => ele.id === command?.type)}
          items={AxesList}
          labelClasses="text-black"
          onChange={(item) => {
            updateCommand({
              ...command,
              type: item.id,
            });
          }}
        />
        <TextInput
          label="Value"
          labelClasses="text-gray-900"
          value={command.delay}
          onChange={() => {}}
        />
      </div>
      {/* <Disclosure title="Changes" className="col-span-2"></Disclosure> */}
    </>
  );
}

function updateCommand(
  macro: Macro,
  command: StickState | ButtonState,
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

function Command({ macro, command, index }: props) {
  const { macroManager } = useContext(GamepadContext);
  function wrappedUpdateCommand(newCommand: StickState | ButtonState) {
    updateCommand(
      macro,
      newCommand,
      index,
      macroManager.macroListWatcher.triggerListeners
    );
  }
  return (
    <div className="rflex w-full px-2 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
      <div className="flex gap 2 z-1 relative">
        <div className="grid grid-cols-2 gap-2 grow">
          <TypeSelect command={command} updateCommand={wrappedUpdateCommand} />
          <TextInput
            label="Delay (ms)"
            labelClasses="text-gray-900"
            value={command.delay}
            onChange={(e) =>
              wrappedUpdateCommand({
                ...command,
                delay: parseInt(e.target.value || 0),
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
          className="h-4 w-4 shrink-0 grow-0"
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
