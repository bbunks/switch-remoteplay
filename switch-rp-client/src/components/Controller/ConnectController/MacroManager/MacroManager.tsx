import {
  PencilAltIcon,
  PlayIcon,
  SearchIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { VariableSizeList as List } from "react-window";
import {
  CSSProperties,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useWatcherState from "../../../../customHooks/useWatcherState";
import { ActionTypes } from "../../../../gamepad/GamepadMacros";
import { GamepadMapButton } from "../../../../gamepad/GamepadMapping";
import { GamepadContext } from "../../../context/GamepadContext";
import Button from "../../../shared/Button";
import TextInput from "../../../shared/TextInput";
import Command from "./Command";
import AutoSizer from "react-virtualized-auto-sizer";

function MacroManager() {
  const [macroToDelete, setMacroToDelete] = useState("");
  const { macroManager, gamepadStateManager } = useContext(GamepadContext);
  const [activeMacroID, setActiveMacroID] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const macroListRenderer: RefObject<List<any> | undefined> = useRef();

  const [macroList] = useWatcherState(macroManager.macroListWatcher);

  const activeMacro = macroManager.getMacro(activeMacroID);

  const iconClasses =
    "h-6 w-6 hover:text-red-700 text-gray-800 relative z-1 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 hover:cursor-pointer";

  function stopMacroRecording() {
    macroManager.StopMacroRecord(activeMacroID, gamepadStateManager);
  }

  useEffect(() => {
    function resetWindowCache() {
      macroListRenderer.current?.resetAfterIndex(0);
    }

    macroManager.macroListWatcher.addListener(resetWindowCache);

    return () => {
      macroManager.macroListWatcher.removeListener(resetWindowCache);
    };
  }, []);

  useEffect(() => {
    stopMacroRecording();
    setIsRecording(false);
    macroListRenderer.current?.resetAfterIndex(0);
  }, [activeMacroID]);

  const macroListLength = activeMacro?.commands.length ?? 0;

  const CommandRenderer = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) =>
    index < macroListLength ? (
      <Command
        style={style}
        command={activeMacro?.commands[index]}
        macro={activeMacro}
        index={index}
      />
    ) : (
      <Button
        style={{
          top: (style.top as number) + 12,
          margin: "auto",
        }}
        onClick={() => {
          activeMacro?.commands.push({
            type: ActionTypes.BUTTON_ACTION,
            button: GamepadMapButton.A,
            pressed: true,
            delay: 0,
          });
          macroManager.macroListWatcher.triggerListeners();
        }}
      >
        + New Command
      </Button>
    );

  function getItemSize(index: number) {
    if (index >= (activeMacro?.commands.length ?? 0)) return 50;
    if (activeMacro?.commands[index].type === ActionTypes.BUTTON_ACTION)
      return 158;
    if (activeMacro?.commands[index].type === ActionTypes.STICK_ACTION)
      return 258;
    return 0;
  }

  return (
    <>
      <div>
        <div>
          <div className="flex flex-col mb-4">
            <h3 className="mb-1 block text-sm font-medium text-gray-200">
              Macros
            </h3>
            <TextInput
              placeholder="Search"
              rightIcon={<SearchIcon className="h-6 w-6" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex flex-col mt-4 max-h-[200px] overflow-x-auto gap-2">
              {macroList
                .filter((ele) =>
                  ele.name.toLowerCase().startsWith(searchText.toLowerCase())
                )
                .map((macro) => (
                  <div
                    key={macro.id}
                    onClick={() => setActiveMacroID(macro.id)}
                    className="relative flex justify-between w-full px-2 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 hover:bg-gray-300"
                  >
                    <div className="flex items-center justify-center gap-2 z-20">
                      {!macro.currentlyPlaying ? (
                        <PlayIcon
                          className={iconClasses}
                          onClick={(e) => {
                            e.stopPropagation();
                            macroManager.StartMacro(
                              macro.id,
                              gamepadStateManager
                            );
                          }}
                          tabIndex={0}
                        />
                      ) : (
                        <StopIcon
                          className={iconClasses}
                          onClick={(e) => {
                            e.stopPropagation();
                            macroManager.StopMacro(
                              macro.id,
                              gamepadStateManager
                            );
                          }}
                          tabIndex={0}
                        />
                      )}
                      <span>{macro.name}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 z-20">
                      <PencilAltIcon className={iconClasses} tabIndex={0} />
                      <TrashIcon
                        className={iconClasses}
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMacroToDelete(macro.id);
                        }}
                      />
                    </div>
                    {/* this is the loading bar */}
                    <div
                      className="absolute top-[calc(100%-5px)] left-0 bottom-0 bg bg-green-500 z-auto rounded-md"
                      style={{
                        right: `${
                          100 -
                          Math.floor(
                            (macro.timePlayed /
                              macro.commands.reduce(
                                (prev, curr) => prev + curr.delay,
                                0
                              ) ?? 0) * 100
                          ) /
                            100
                        }%`,
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => setActiveMacroID(macroManager.createNewMacro())}
            >
              + New Macro
            </Button>
          </div>
        </div>
        {activeMacroID !== "" && (
          <>
            <div className="border-solid border-b border-neutral-100 my-4"></div>
            <TextInput
              label="Macro Name"
              value={activeMacro?.name}
              onChange={(e) =>
                macroManager.setMacroName(activeMacroID, e.target.value)
              }
            />
            <p className="mb-1 mt-4 block text-sm font-medium text-gray-200">
              Commands
            </p>
            <div className="flex flex-col h-[400px] overflow-x-auto gap-2">
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    ref={macroListRenderer as unknown as RefObject<List<any>>}
                    height={height}
                    width={width}
                    itemCount={activeMacro?.commands.length + 1 ?? 1}
                    itemSize={getItemSize}
                  >
                    {CommandRenderer}
                  </List>
                )}
              </AutoSizer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                onClick={() => {
                  if (isRecording) {
                    macroManager.StopMacroRecord(
                      activeMacroID,
                      gamepadStateManager
                    );
                    setIsRecording(false);
                  } else {
                    macroManager.StartMacroRecord(
                      activeMacroID,
                      gamepadStateManager
                    );
                    setIsRecording(true);
                  }
                }}
              >
                {isRecording ? "Stop Recording" : "Record"}
              </Button>
              <Button onClick={() => setMacroToDelete(activeMacroID)}>
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
      {macroToDelete && (
        <div className="flex items-center justify-center bg-black/75 fixed top-0 left-0 w-[100vw] h-[100vh] z-[100]">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-black flex flex-col gap-4">
              <h1 className="text-xl">Delete Macro</h1>
              <p>Are you sure you want to delete this macro?</p>
              <div className="flex gap-4 justify-end">
                <Button
                  onClick={() => {
                    setMacroToDelete("");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 focus:ring-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    macroManager.deleteMacro(macroToDelete);
                    setMacroToDelete("");
                    if (activeMacroID === macroToDelete) setActiveMacroID("");
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

MacroManager.propTypes = {};

export default MacroManager;
