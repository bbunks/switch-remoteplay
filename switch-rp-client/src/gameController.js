let controllerMap = {
  a: 1,
  b: 0,
  x: 3,
  y: 2,
  up: 12,
  down: 13,
  right: 15,
  left: 14,
  rb: 5,
  lb: 4,
  rt: 7,
  lt: 6,
  start: 9,
  select: 8,
  "right-stick-x": 2,
  "right-stick-y": 3,
  "left-stick-x": 0,
  "left-stick-y": 1,
};

export const translateGamepad = (gamepad) => {
  return {
    a: gamepad.buttons[controllerMap.a].pressed,
    b: gamepad.buttons[controllerMap.b].pressed,
    x: gamepad.buttons[controllerMap.x].pressed,
    y: gamepad.buttons[controllerMap.y].pressed,
    up: gamepad.buttons[controllerMap.up].pressed,
    down: gamepad.buttons[controllerMap.down].pressed,
    right: gamepad.buttons[controllerMap.right].pressed,
    left: gamepad.buttons[controllerMap.left].pressed,
    rb: gamepad.buttons[controllerMap.rb].pressed,
    lb: gamepad.buttons[controllerMap.lb].pressed,
    rt: gamepad.buttons[controllerMap.rt].pressed,
    lt: gamepad.buttons[controllerMap.lt].pressed,
    start: gamepad.buttons[controllerMap.start].pressed,
    select: gamepad.buttons[controllerMap.select].pressed,
    "right-stick-x": gamepad.axes[controllerMap["right-stick-x"]],
    "right-stick-y": gamepad.axes[controllerMap["right-stick-y"]],
    "left-stick-x": gamepad.axes[controllerMap["left-stick-x"]],
    "left-stick-y": gamepad.axes[controllerMap["left-stick-y"]],
  };
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
