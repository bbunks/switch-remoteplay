import Bind from "../Bind/Bind";

type props = {
  axis: "X" | "Y";
  POSITIVE: ControllerButton;
  NEGATIVE: ControllerButton;
  AXIS_INDEX: number | string;
  STICK_INDEX: number | string;
  POSITIVE_PROPS: any;
  NEGATIVE_PROPS: any;
  ANALOG_PROPS: any;
  emulated: boolean;
};

function JoystickBind({
  axis,
  AXIS_INDEX,
  STICK_INDEX,
  POSITIVE,
  NEGATIVE,
  POSITIVE_PROPS,
  NEGATIVE_PROPS,
  ANALOG_PROPS,
  emulated,
}: props) {
  return (
    <div className="flex flex-row items-center gap-8">
      <h3 className="text-lg leading-6 font-medium text-gray-100 my-2  border-r border-gray-200 px-4">
        {axis}
      </h3>
      {emulated ? (
        <div>
          <Bind
            label={axis === "X" ? "Left" : "Up"}
            value={NEGATIVE}
            {...NEGATIVE_PROPS}
          />
          <Bind
            label={axis === "X" ? "Right" : "Down"}
            value={POSITIVE}
            {...POSITIVE_PROPS}
          />
        </div>
      ) : (
        <div>
          <Bind
            label="Stick | Axis"
            value={STICK_INDEX + " | " + AXIS_INDEX}
            {...ANALOG_PROPS}
          />
        </div>
      )}
    </div>
  );
}

export default JoystickBind;
