import { Disclosure as HUIDisclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

interface props {
  children: React.ReactNode;
  title: React.ReactElement | string;
  className?: string;
}

function Disclosure({ children, title, className }: props) {
  return (
    <HUIDisclosure>
      {({ open }) => (
        <div className={className}>
          <HUIDisclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
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
