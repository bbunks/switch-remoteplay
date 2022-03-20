import ControllerButton from "../ControllerButton";

interface props {
  button: {
    button: string;
    symbol: string;
  };
  mouseDown: boolean;
}

const Button = ({ button: { button, symbol }, mouseDown }: props) => {
  return (
    <ControllerButton
      mouseDown={mouseDown}
      button={button}
      pressedClasses="bg-neutral-500 text-neutral-900"
      defaultClasses="flex rounded-[50%] h-16 w-16 justify-center items-center capitalize select-none bg-neutral-900 text-white outline outline-2 outline-gray-500"
    >
      <h1 className="text-center font-black text-xl">{symbol}</h1>
    </ControllerButton>
  );
};

export default Button;
