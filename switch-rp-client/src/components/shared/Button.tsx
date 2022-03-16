import React from "react";

interface props {
  children: React.ReactChild;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({ children, ...rest }: props) {
  return (
    <button
      {...rest}
      className="my-4 group relative self-center flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {children}
    </button>
  );
}

Button.propTypes = {};

export default Button;
