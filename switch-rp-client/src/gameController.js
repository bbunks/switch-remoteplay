//this is used to generate a controller throughout the code as needed. This is not the current controller state
export let controllerState = {
  a: false,
  b: false,
  x: false,
  y: false,
  up: false,
  down: false,
  right: false,
  left: false,
  rb: false,
  lb: false,
  rt: false,
  lt: false,
  start: false,
  select: false,
  "right-stick-x": 0.0,
  "right-stick-y": 0.0,
  "left-stick-x": 0.0,
  "left-stick-y": 0.0,
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
