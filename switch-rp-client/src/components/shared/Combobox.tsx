import { Combobox as ComboboxHUI } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useContext, useState } from "react";
import { GamepadContext } from "../context/GamepadContext";

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export type ItemOption = { id: number | string; name: string };

type props = {
  items: ItemOption[];
  selectedItem: Partial<ItemOption>;
  setSelectedItem: (value: ItemOption) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  actions?: React.ReactNode | React.ReactElement;
};

export default function Combobox({
  items,
  selectedItem,
  setSelectedItem,
  label,
  disabled = false,
  placeholder = "",
  actions = <></>,
}: props) {
  const { gamepadStateController } = useContext(GamepadContext);
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <ComboboxHUI
      as="div"
      value={selectedItem}
      onChange={setSelectedItem}
      disabled={disabled}
    >
      <div className="flex flex-row justify-between items-end">
        <ComboboxHUI.Label className="block text-sm font-medium text-gray-200">
          {label}
        </ComboboxHUI.Label>
        {actions}
      </div>
      <div className="relative mt-1">
        <ComboboxHUI.Input
          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 text-black"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(selectedItem: ItemOption) => selectedItem.name ?? ""}
          placeholder={placeholder}
          onFocus={
            !disabled ? gamepadStateController.value.PauseListeners : () => {}
          }
          onBlur={gamepadStateController.value.ResumeListeners}
        />
        <ComboboxHUI.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxHUI.Button>

        {filteredItems.length > 0 && (
          <ComboboxHUI.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <ComboboxHUI.Option
                key={item.id}
                value={item}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-primary-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {item.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-primary-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxHUI.Option>
            ))}
          </ComboboxHUI.Options>
        )}
      </div>
    </ComboboxHUI>
  );
}
