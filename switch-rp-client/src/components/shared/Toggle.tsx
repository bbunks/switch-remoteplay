/* This example requires Tailwind CSS v2.0+ */
import { Switch } from "@headlessui/react";
import Tooltip from "./Tooltip";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface props {
  label: string;
  subLabel?: string;
  tooltip?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({
  label,
  subLabel,
  checked,
  onChange,
  tooltip,
}: props) {
  return (
    <Switch.Group as="div" className="flex items-center py-4 justify-center">
      <Switch
        checked={checked}
        onChange={onChange}
        className={classNames(
          checked ? "bg-primary-600" : "bg-gray-200",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-100">{label}</span>
        <span className="text-sm text-gray-300">{subLabel}</span>
      </Switch.Label>
      {tooltip && <Tooltip tipText={tooltip} />}
    </Switch.Group>
  );
}
