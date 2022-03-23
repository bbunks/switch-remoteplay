import {
  PencilAltIcon,
  PlayIcon,
  SearchIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { useContext, useState } from "react";
import useWatcherState from "../../../../customHooks/useWatcherState";
import { GamepadContext } from "../../../context/GamepadContext";
import Button from "../../../shared/Button";
import TextInput from "../../../shared/TextInput";
import Command from "./Command";

function MacroManager() {
  const [macroToDelete, setMacroToDelete] = useState("");
  const { macroManager, gamepadStateManager } = useContext(GamepadContext);
  const [activeMacroID, setActiveMacroID] = useState("");
  const [searchText, setSearchText] = useState("");

  const [macroList, setMacroList] = useWatcherState(
    macroManager.macroListWatcher
  );
  const disabled = macroList.length === 0;
  const selectedItem = macroList.find((ele) => ele.id === activeMacroID);
  const comboboxSelectedItem = {
    id: selectedItem?.id,
    name: selectedItem?.name,
  };

  const activeMacro = macroManager.getMacro(activeMacroID);

  const iconClasses =
    "h-6 w-6 hover:text-gray-700 text-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 hover:cursor-pointer";

  return (
    <>
      <div>
        <div>
          <div className="flex flex-col mb-4">
            <TextInput
              placeholder="Search"
              rightIcon={<SearchIcon className="h-6 w-6" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <p className="mb-1 mt-4 block text-sm font-medium text-gray-200">
              Macros
            </p>
            <div className="flex flex-col max-h-[200px] overflow-x-auto gap-2">
              {macroList
                .filter((ele) =>
                  ele.name.toLowerCase().startsWith(searchText.toLowerCase())
                )
                .map((macro) => (
                  <div
                    key={macro.id}
                    className="relative flex justify-between w-full px-2 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <div className="flex items-center justify-center gap-2 z-20">
                      {!macro.currentlyPlaying ? (
                        <PlayIcon
                          className={iconClasses}
                          onClick={() => macroManager.StartMacro(macro.id)}
                          tabIndex={0}
                        />
                      ) : (
                        <StopIcon
                          className={iconClasses}
                          onClick={() => macroManager.StopMacro(macro.id)}
                          tabIndex={0}
                        />
                      )}
                      <span>{macro.name}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 z-20">
                      <PencilAltIcon
                        className={iconClasses}
                        onClick={() => setActiveMacroID(macro.id)}
                        tabIndex={0}
                      />
                      <TrashIcon
                        className={iconClasses}
                        tabIndex={0}
                        onClick={() => setMacroToDelete(macro.id)}
                      />
                    </div>
                    {/* this is the loading bar */}
                    <div
                      className="absolute top-[calc(100%-5px)] left-0 bottom-0 bg bg-green-500 z-auto rounded-md"
                      style={{
                        right: `${
                          100 -
                          Math.floor((macro.completionPercent ?? 0) * 100) / 100
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
            <div className="flex flex-col max-h-[200px] overflow-x-auto gap-2">
              {activeMacro?.commands.map((command, index) => (
                <Command key={"command" + index} command={command} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button>Record</Button>
              <Button onClick={() => setMacroToDelete(activeMacroID)}>
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
      {macroToDelete && (
        <div className="flex items-center justify-center bg-black/75 fixed top-0 left-0 w-[100vw] h-[100vh] z-100">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-black flex flex-col gap-4">
              <h1 className="text-xl">Delete Macro</h1>
              <p>Are you sure you want to delete this macro?</p>
              <div className="flex gap-4 justify-end">
                <Button
                  onClick={() => {
                    setShowModal(false);
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
