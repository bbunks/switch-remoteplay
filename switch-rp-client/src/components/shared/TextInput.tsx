import React from "react";

interface props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  id?: string;
  inputClasses?: string;
  type?: "text" | "email" | "password";
}

export default function TextInput({
  label,
  className,
  inputClasses,
  id,
  type = "text",
  ...rest
}: props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          className={
            "shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 text-black" +
            (inputClasses ?? "")
          }
          {...rest}
          type={type}
        />
      </div>
    </div>
  );
}
