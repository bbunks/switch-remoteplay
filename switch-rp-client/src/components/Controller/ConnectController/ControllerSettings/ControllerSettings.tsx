import { GamepadStateController } from "../../../../gamepad/GamepadController";
import Disclosure from "../../../shared/Disclosure";
import Select from "../../../shared/Select";
import MapManager from "../MapManager/MapManager";

interface props {
  controllerList: ControllerDescription[];
  activeController: number;
  currentGamepad: GamepadStateController;
  setActiveController: React.Dispatch<React.SetStateAction<number>>;
}

function ControllerSettings({
  controllerList,
  activeController,
  setActiveController,
}: props) {
  return (
    <>
      <Select
        label="Controller"
        items={controllerList.map((i) => {
          return {
            id: i.index,
            name: i.id,
          };
        })}
        value={activeController}
        onChange={(selectedValue) => setActiveController(selectedValue.id)}
      />
      <p className={"text-xs mb-2 text-gray-400"}>
        * If your controller is not showing, press a button on the controller
      </p>
      <Disclosure title="Controller Mapping">
        <MapManager />
      </Disclosure>
    </>
  );
}

export default ControllerSettings;
