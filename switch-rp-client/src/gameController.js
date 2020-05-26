import { sendCommand } from "./socketio";

let controllerMap = {
  a: 0,
  b: 1,
  x: 2,
  y: 3,
  up: 12,
  down: 13,
  left: 14,
  right: 15,
  zr: 5,
  zl: 4,
  r: 7,
  l: 6,
  plus: 9,
  minus: 8,
  r_stick: 11,
  l_stick: 10,
  //only read if the emulated joysticks is false
  "right-stick-x": 2,
  "right-stick-y": 3,
  "left-stick-x": 0,
  "left-stick-y": 1,
  //set to true for emulated joysticks
  "emulate-joystick": false,
  //only read if the emulated joysticks is true
  "right-stick-y-up": 12,
  "right-stick-y-down": 13,
  "right-stick-x-left": 14,
  "right-stick-x-right": 15,
  "left-stick-x-left": 0,
  "left-stick-x-right": 0,
  "left-stick-y-up": 1,
  "left-stick-y-down": 1,
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
const calcJoystick = (stick, axes, gamepad) => {
  let emulatedValue = 0;
  if (controllerMap["emulate-joystick"]) {
    let keyStr = stick + "-stick-" + axes + "-";

    emulatedValue += gamepad.buttons[
      controllerMap[keyStr + (axes === "x" ? "left" : "up")]
    ].pressed
      ? -1
      : 0;
    emulatedValue += gamepad.buttons[
      controllerMap[keyStr + (axes === "x" ? "right" : "down")]
    ].pressed
      ? 1
      : 0;
  } else {
    emulatedValue = gamepad.axes[controllerMap[stick + "-stick-" + axes]];
  }

  return emulatedValue;
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
    "right-stick-x": calcJoystick("right", "x", gamepad),
    "right-stick-y": calcJoystick("right", "y", gamepad),
    "left-stick-x": calcJoystick("left", "x", gamepad),
    "left-stick-y": calcJoystick("left", "y", gamepad),
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

export const setBind = (key, button) => {
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
