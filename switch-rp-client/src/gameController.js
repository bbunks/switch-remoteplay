const initiateControllerPoll = () => {};

let controllerState = null;

export const pollGamepads = (
  activeController,
  controllerList,
  pollRef
) => () => {
  let gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
    ? navigator.webkitGetGamepads()
    : [];

  let { index, id } = controllerList.find((i) => i.index === activeController);

  console.log(gamepads[index]);

  if (gamepads[index]) {
    controllerState = gamepads[index];
  }

  pollRef = requestAnimationFrame(
    pollGamepads(activeController, controllerList, pollRef)
  );
};

let controllerMap = {
  controller: "kb",
  a: 0,
  b: 0,
  x: 0,
  y: 0,
  up: 0,
  down: 0,
  right: 0,
  left: 0,
  rb: 0,
  lb: 0,
  rt: 0,
  lt: 0,
  start: 0,
  select: 0,
  "right-stick-x-left": 0,
  "right-stick-x-right": 0,
  "right-stick-y-up": 0,
  "right-stick-y-down": 0,
  "left-stick-x-left": 0,
  "left-stick-y-right": 0,
  "left-stick-x-up": 0,
  "left-stick-y-down": 0,
};

export const bindControl = (key, button) => {
  controllerMap[key] = button;
};

export const checkPress = (key) => {
  let mapIndex = Object.values(controllerMap).indexOf(key);
  let button = Object.keys(controllerMap)[mapIndex];

  return button;
};

export const pressButton = (button) => {
  //to be written
};

export const exportMapToJSON = () => {
  return JSON.stringify(controllerMap);
};

export const importMapFromJSON = (mapJSONString) => {
  controllerMap = JSON.parse(mapJSONString);
};

export const getControllerMap = () => {
  return controllerMap;
};
