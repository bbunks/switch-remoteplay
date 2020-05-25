import { sendCommand } from "./socketio";

let controllerMap = {
  a: 1,
  b: 0,
  x: 3,
  y: 2,
  up: 12,
  down: 13,
  right: 15,
  left: 14,
  zr: 5,
  zl: 4,
  r: 7,
  l: 6,
  plus: 9,
  minus: 8,
  r_stick: 11,
  l_stick: 10,
  "right-stick-x": 2,
  "right-stick-y": 3,
  "left-stick-x": 0,
  "left-stick-y": 1,
};

let gamepadState = {
  a: false,
  b: false,
  x: false,
  y: false,
  up: false,
  down: false,
  right: false,
  left: false,
  zr: false,
  zl: false,
  r: false,
  l: false,
  plus: false,
  minus: false,
  r_stick: false,
  l_stick: false,
  "right-stick-x": 0,
  "right-stick-y": 0,
  "left-stick-x": 0,
  "left-stick-y": 0,
};

export const translateGamepad = (gamepad) => {
  let newGPState = {
    a: gamepad.buttons[controllerMap.a].pressed,
    b: gamepad.buttons[controllerMap.b].pressed,
    x: gamepad.buttons[controllerMap.x].pressed,
    y: gamepad.buttons[controllerMap.y].pressed,
    up: gamepad.buttons[controllerMap.up].pressed,
    down: gamepad.buttons[controllerMap.down].pressed,
    right: gamepad.buttons[controllerMap.right].pressed,
    left: gamepad.buttons[controllerMap.left].pressed,
    zr: gamepad.buttons[controllerMap.zr].pressed,
    zl: gamepad.buttons[controllerMap.zl].pressed,
    r: gamepad.buttons[controllerMap.r].pressed,
    l: gamepad.buttons[controllerMap.l].pressed,
    plus: gamepad.buttons[controllerMap.plus].pressed,
    minus: gamepad.buttons[controllerMap.minus].pressed,
    r_stick: gamepad.buttons[controllerMap.r_stick].pressed,
    l_stick: gamepad.buttons[controllerMap.l_stick].pressed,
    //add logic here to emulate joysticks.
    "right-stick-x": gamepad.axes[controllerMap["right-stick-x"]],
    "right-stick-y": gamepad.axes[controllerMap["right-stick-y"]],
    "left-stick-x": gamepad.axes[controllerMap["left-stick-x"]],
    "left-stick-y": gamepad.axes[controllerMap["left-stick-y"]],
  };

  updateGamepadState(newGPState);

  return newGPState;
};

const updateGamepadState = (newGPState) => {
  let changes = [];
  Object.keys(gamepadState).forEach((key) => {
    if (newGPState[key] !== gamepadState[key]) {
      changes.push({ key: key, value: newGPState[key] });
      gamepadState[key] = newGPState[key];
    }
  });

  let commands = [];
  changes.forEach((change) => {
    let command;
    //checks if the change was on a button
    const { key, value } = change;
    if (key.search("-stick") === -1) {
      command = key;
      if (value) {
        command += " d";
      } else {
        command += " u";
      }
    } else {
      command = "s ";

      if (key.search("left") >= 0) {
        command += "l ";
      } else if (key.search("right") >= 0) {
        command += "r ";
      }

      if (key.search("x") >= 0) {
        command += "h ";
      } else if (key.search("y") >= 0) {
        command += "v ";
      }

      command += Math.round(value * 10) / 10;
    }
    commands.push(command);
  });
  if (commands.length > 0) sendCommand(commands.join("&"));
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
