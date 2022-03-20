import {
  Children,
  isValidElement,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useState,
} from "react";

interface ITab {
  title: ReactNode;
  children: ReactElement | ReactNode;
}
export function Tab({ children }: ITab) {
  return <>{children}</>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface TabsProps {
  children:
    | ReactElement<ITab, JSXElementConstructor<ITab>>
    | Array<ReactElement<ITab, JSXElementConstructor<ITab>>>;
}

function Tabs({ children }: TabsProps) {
  const [index, setIndex] = useState(0);

  const tabs = Children.toArray(children).map((ele) =>
    isValidElement(ele) ? ele : <div>{ele}</div>
  );
  if (tabs.length < 1) return <></>;

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          onChange={(e) => {
            setIndex(parseInt(e.target.value));
          }}
          className="block w-full focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md text-black"
          defaultValue={tabs[index]?.props.name ?? "Select and Item"}
        >
          {tabs.map((tab, index) => (
            <option key={"tab" + index} value={index} className="capitalize">
              {tab.props.title.toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block mb-2  ">
        <div className="border-b border-gray-200 ">
          <nav className="-mb-px flex " aria-label="Tabs">
            {tabs.map((tab, tabIndex) => (
              <button
                key={tabIndex}
                onClick={() => {
                  setIndex(tabIndex);
                }}
                className={classNames(
                  tabIndex === index
                    ? "border-primary-300 text-primary-400"
                    : "border-transparent text-gray-200 hover:text-gray-400 hover:border-gray-300",
                  `py-4 px-1 text-center border-b-2 font-medium text-sm flex-grow capitalize`
                )}
                aria-current={tabIndex === index ? "page" : undefined}
              >
                {tab.props.title.toLowerCase()}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* They are hidden because I want the tabs to live even when they are not active  */}
      {tabs.map((ele, tabIndex) => (
        <div key={tabIndex} className={index === tabIndex ? "" : "hidden"}>
          {ele}
        </div>
      ))}
    </div>
  );
}

export default {
  TabContainer: Tabs,
  Tab,
};
