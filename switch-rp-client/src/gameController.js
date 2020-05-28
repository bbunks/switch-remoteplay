import { sendCommand } from "./socketio";

let controllerMap;
let keyboardMap;

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

let gamepadIndex = -1;
let gamepadId = 0;
let prevGamepadID;

export const setActiveGamepad = (activeIndex, activeGamepadId) => {
  gamepadIndex = activeIndex;
  gamepadId = activeGamepadId;
};

let rawGamepadState = null;
let doOnNextPress = null;

//Returns the joysitck value after taking into account if the sticks are being emulated from buttons
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

//translates a gamepad press through the map and returns a Gamepad layout.
export const translateGamepad = (gamepad) => {
  let maxButtonNum = gamepad.buttons.length;
  let newGPState = {
    a:
      controllerMap.a < maxButtonNum
        ? gamepad.buttons[controllerMap.a].pressed
        : false,
    b:
      controllerMap.b < maxButtonNum
        ? gamepad.buttons[controllerMap.b].pressed
        : false,
    x:
      controllerMap.x < maxButtonNum
        ? gamepad.buttons[controllerMap.x].pressed
        : false,
    y:
      controllerMap.y < maxButtonNum
        ? gamepad.buttons[controllerMap.y].pressed
        : false,
    up:
      controllerMap.up < maxButtonNum
        ? gamepad.buttons[controllerMap.up].pressed
        : false,
    down:
      controllerMap.down < maxButtonNum
        ? gamepad.buttons[controllerMap.down].pressed
        : false,
    right:
      controllerMap.right < maxButtonNum
        ? gamepad.buttons[controllerMap.right].pressed
        : false,
    left:
      controllerMap.left < maxButtonNum
        ? gamepad.buttons[controllerMap.left].pressed
        : false,
    zr:
      controllerMap.zr < maxButtonNum
        ? gamepad.buttons[controllerMap.zr].pressed
        : false,
    zl:
      controllerMap.zl < maxButtonNum
        ? gamepad.buttons[controllerMap.zl].pressed
        : false,
    r:
      controllerMap.r < maxButtonNum
        ? gamepad.buttons[controllerMap.r].pressed
        : false,
    l:
      controllerMap.l < maxButtonNum
        ? gamepad.buttons[controllerMap.l].pressed
        : false,
    plus:
      controllerMap.plus < maxButtonNum
        ? gamepad.buttons[controllerMap.plus].pressed
        : false,
    minus:
      controllerMap.minus < maxButtonNum
        ? gamepad.buttons[controllerMap.minus].pressed
        : false,
    r_stick:
      controllerMap.r_stick < maxButtonNum
        ? gamepad.buttons[controllerMap.r_stick].pressed
        : false,
    l_stick:
      controllerMap.l_stick < maxButtonNum
        ? gamepad.buttons[controllerMap.l_stick].pressed
        : false,
    //add logic here to emulate joysticks.
    "right-stick-x": calcJoystick("right", "x", gamepad),
    "right-stick-y": calcJoystick("right", "y", gamepad),
    "left-stick-x": calcJoystick("left", "x", gamepad),
    "left-stick-y": calcJoystick("left", "y", gamepad),
  };

  updateGamepadState(newGPState);
  updateRawGamepad(gamepad);

  return newGPState;
};

//Updates a raw gamepad state used for finding the button/stick to bind to
const updateRawGamepad = (gamepad) => {
  if (rawGamepadState === null || prevGamepadID !== gamepadId) {
    console.log("scream");
    rawGamepadState = gamepad;
    prevGamepadID = gamepadId;
    return;
  }

  let buttonChanges = [];
  Object.keys(gamepad.buttons).forEach((key) => {
    if (rawGamepadState.buttons[key].value !== gamepad.buttons[key].value) {
      buttonChanges.push({
        key: key,
        value: gamepad.buttons[key].value,
      });
    }
  });

  rawGamepadState = gamepad;

  buttonChanges.forEach((change) => {
    //checks if the change was on a button
    const { key, value } = change;

    if (doOnNextPress && value) {
      doOnNextPress(key);
      doOnNextPress = null;
    }
  });
};

//Sends commands to the API through the socket
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

//This is takes a function as a parameter. When the next button is pressed, run the function and return the button key (0-16)
export const getNextButton = (response) => {
  doOnNextPress = response;
};

export const setBind = (key, button) => {
  console.log("Binding " + key + " to " + button);
  controllerMap[key] = button;
  localStorage.setItem("ControllerMapping", exportMapToJSON());
};

export const checkPress = (key) => {
  let mapIndex = Object.values(controllerMap).indexOf(key);
  let button = Object.keys(controllerMap)[mapIndex];

  return button;
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
//check if we have a Map in storage, if so load it, else we will load the default.
if (localStorage.getItem("ControllerMapping")) {
  importMapFromJSON(localStorage.getItem("ControllerMapping"));
} else {
  controllerMap = {
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
    "left-stick-x-right": 1,
    "left-stick-y-up": 0,
    "left-stick-y-down": 1,
  };

  keyboardMap = {
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
    "left-stick-x-right": 1,
    "left-stick-y-up": 0,
    "left-stick-y-down": 1,
  };
}
