import { Popover, Transition } from "@headlessui/react";
import { Fragment, ReactElement } from "react";

type props = {
  tipText: string | ReactElement;
};

export default function Tooltip({ tipText }: props) {
  return (
    <Popover className="relative">
      <Popover.Button
        className={`px-1 py-1 m-1 rounded-full inline-flex
        items-center text-base font-medium hover:bg-gray-700 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-10 max-w-sm px-4 ml-3 transform -translate-y-1/2 left-full top-1/2 sm:px-0 lg:max-w-3xl">
          <div className="p-4 bg-gray-50 overflow-hidden shadow rounded-lg w-[20vw] outline-gray-300 text-gray-500">
            {tipText}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
