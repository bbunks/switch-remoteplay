import { useRef } from "react";

interface props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  sublabel: string;
}

function Bind({ label, sublabel, ...rest }: props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label
        htmlFor="company-website"
        className="block text-sm font-medium text-gray-700"
      >
        {sublabel}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <span className="w-1/2 inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
          {label}
        </span>
        <input
          {...rest}
          ref={inputRef}
          type="text"
          name="company-website"
          id="company-website"
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
        />
      </div>
    </div>
  );
}

export default Bind;