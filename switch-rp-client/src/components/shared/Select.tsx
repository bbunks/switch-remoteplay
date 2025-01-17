/* This example requires Tailwind CSS v2.0+ */
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ListItem<T = number> {
  name: string;
  id: T;
}

interface props<T = number> {
  items: ListItem<T>[];
  label: string;
  value: Partial<ListItem<T>> | undefined | null;
  onChange: (item: ListItem<T>) => void;
  labelClasses?: string;
  containerClasses?: string;
}

export default function Select<T>({
  items = [],
  label = "",
  value,
  onChange,
  labelClasses = "",
  containerClasses = "",
}: props<T>) {
  const selected = items.find((ele) => ele.id === value?.id) ?? items[0];
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className={containerClasses}>
          <Listbox.Label
            className={
              "block text-sm font-medium text-gray-200 " + labelClasses
            }
          >
            {label}
          </Listbox.Label>
          <div className="relative">
            <Listbox.Button className="mt-1 text-black bg-gray-100 relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <span className="block truncate text-gray-900 text-sm font-medium">
                {selected.name}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.id + ""}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-primary-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {item.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-primary-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
}
