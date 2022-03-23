import {
  ACTION_TYPES,
  ButtonState,
  StickState,
} from "../../../../gamepad/GamepadMacros";

interface props {
  command: StickState | ButtonState;
}

function ButtonCommand({ command }: { command: ButtonState }) {
  return <></>;
}

function StickCommand({ command }: { command: StickState }) {
  return <></>;
}

function Command({ command }: props) {
  return (
    <div className="relative flex justify-between w-full px-2 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
      <div className="flex items-center justify-center gap-2 z-20">
        {command.type === ACTION_TYPES.BUTTON_ACTION && (
          <ButtonCommand command={command} />
        )}
        {command.type === ACTION_TYPES.STICK_ACTION && (
          <StickCommand command={command} />
        )}
      </div>
    </div>
  );
}

export default Command;
