import { Disclosure as HUIDisclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import React from "react";

interface props {
  children: React.ReactElement;
  title: React.ReactElement | string;
}

function Disclosure({ children, title }: props) {
  return (
    <HUIDisclosure>
      {({ open }) => (
        <div>
          <HUIDisclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
            <span>{title}</span>
            <ChevronUpIcon
              className={`${open ? "transform rotate-180" : ""} w-5 h-5 pri`}
            />
          </HUIDisclosure.Button>
          <HUIDisclosure.Panel className="px-4 py-2 text-sm text-gray-200">
            {children}
          </HUIDisclosure.Panel>
        </div>
      )}
    </HUIDisclosure>
  );
}

export default Disclosure;
