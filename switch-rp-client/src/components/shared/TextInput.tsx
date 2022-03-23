import { useContext } from "react";
import { GamepadContext } from "../context/GamepadContext";

interface props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  id?: string;
  inputClasses?: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  rightIcon?: React.ReactElement | React.ReactNode;
}

export default function TextInput({
  label,
  className,
  inputClasses,
  id,
  type = "text",
  disabled = false,
  rightIcon = null,
  ...rest
}: props) {
  const { gamepadStateController } = useContext(GamepadContext);
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={
            "shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 text-black" +
            (inputClasses ?? "")
          }
          {...rest}
          type={type}
          onFocus={
            !disabled ? gamepadStateController.value.PauseListeners : () => {}
          }
          onBlur={gamepadStateController.value.ResumeListeners}
        />
        <div className="absolute top-2 right-2 text-gray-500 pointer-events-none">
          {rightIcon}
        </div>
      </div>
    </div>
  );
}
