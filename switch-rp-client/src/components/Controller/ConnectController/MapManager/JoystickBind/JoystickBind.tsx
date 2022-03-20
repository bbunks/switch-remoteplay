import Bind from "../Bind/Bind";

type props = {
  axis: "X" | "Y";
  POSITIVE: ControllerButton;
  NEGATIVE: ControllerButton;
  STICK_INDEX: number;
  onFocus: () => void;
  emulated: boolean;
};

function JoystickBind({
  axis,
  STICK_INDEX,
  POSITIVE,
  NEGATIVE,
  onFocus,
  emulated,
}: props) {
  return (
    <div className="flex flex-row items-center gap-8">
      <h3 className="text-lg leading-6 font-medium text-gray-100 my-2  border-r border-gray-200 px-4">
        {axis}
      </h3>
      {emulated ? (
        <div>
          <Bind label={axis === "X" ? "Left" : "Up"} value={NEGATIVE} />
          <Bind label={axis === "X" ? "Right" : "Down"} value={POSITIVE} />
        </div>
      ) : (
        <Bind label="Stick" value={STICK_INDEX} />
      )}
    </div>
  );
}

export default JoystickBind;
