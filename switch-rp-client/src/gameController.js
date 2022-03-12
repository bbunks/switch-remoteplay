import { sendCommand } from "./socketio";

let controllerMap;
let keyboardMap;

//this is a local version of what buttons are currently pressed.
let rawGamepadState = null;

//this is used to describe the current gamepad in use. If this is = -1, it is a keyboard
let gamepadIndex = -1;
let gamepadId = 0;
let prevGamepadID;

//this is a list of functions that will be ran anytime a key bind is changed. This is used to update the state of MapManager
let mirriorFuncs = [];

//this is to be called when ever you change controllers
export const setActiveGamepad = (activeIndex, activeGamepadId) => {
  gamepadIndex = activeIndex;
  gamepadId = activeGamepadId;
  mirriorFuncs.forEach((mirror) => mirror.func(getControllerMap()));
};

//this will be set to a function and ran whenever it is not null. It returns the key value of the next button that is pressed.
let doOnNextPress = null;

//Returns the joysitck value after taking into account if the sticks are being emulated from buttons
const calcJoystick = (stick, axes, gamepad) => {
  let emulatedValue = 0;
  if (getControllerMap()["emulate-joystick"] && gamepadIndex !== -1) {
    let keyStr = stick + "-stick-" + axes + "-";

    if (
      getControllerMap()[keyStr + (axes === "x" ? "left" : "up")] >
        gamepad.buttons.length ||
      getControllerMap()[keyStr + (axes === "x" ? "right" : "down")] >
        gamepad.buttons.length
    ) {
      return emulatedValue;
    }

    emulatedValue += gamepad.buttons[
      getControllerMap()[keyStr + (axes === "x" ? "left" : "up")]
    ].pressed
      ? -1
      : 0;
    emulatedValue += gamepad.buttons[
      getControllerMap()[keyStr + (axes === "x" ? "right" : "down")]
    ].pressed
      ? 1
      : 0;
  } else {
    emulatedValue = gamepad.axes[getControllerMap()[stick + "-stick-" + axes]];
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
    if (
      typeof gamepadState[key] === "number"
        ? Math.round(newGPState[key] * 10) / 10 !== gamepadState[key]
        : newGPState[key] !== gamepadState[key]
    ) {
      console.log(
        "updatingState: " +
          key +
          " | " +
          (typeof gamepadState[key] === "number"
            ? Math.round(newGPState[key] * 10) / 10
            : newGPState[key]) +
          " ? " +
          gamepadState[key]
      );
      changes.push({
        key: key,
        value:
          typeof gamepadState[key] === "number"
            ? Math.round(newGPState[key] * 10) / 10
            : newGPState[key],
      });
      gamepadState[key] =
        typeof gamepadState[key] === "number"
          ? Math.round(newGPState[key] * 10) / 10
          : newGPState[key];
    }
  });

  let commands = [];
  changes.forEach((change) => {
    let command;
    //checks if the change was on a button
    const { key, value } = change;

    if (key.search("-stick") === -1) {
      command = key;
      if (value === true) {
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

      command += value;
    }
    commands.push(command);
  });
  if (commands.length > 0) {
    console.log(commands.join("&"));
    sendCommand(commands.join("&"));
  }
};

//setting up translation for keyboard
const modifierKeys = ["Control", "Shift", "Alt"];

//needs to be bound to the keypress event.
//I now realize that I could do that in this module but I currently have it bind in a useEffect in the App.js file
export const pressKey = (e, setState) => {
  let newGPState = { ...gamepadState };
  if (doOnNextPress && modifierKeys.findIndex((i) => i === e.key) === -1) {
    doOnNextPress(e.key);
    doOnNextPress = null;
    return;
  }

  if (gamepadIndex === -1 && !e.repeat) {
    let wantedKey = false;
    Object.keys(keyboardMap).forEach((key) => {
      if (e.key === keyboardMap[key]) {
        console.log(e.key + " | " + keyboardMap[key]);
        wantedKey = true;
        if (key.search("-stick") >= 0) {
          //joy-stick-logic
          let joystickKey = key.substring(0, key.lastIndexOf("-"));
          if (key.search("-up") >= 0 || key.search("-left") >= 0) {
            newGPState[joystickKey] -= 1;
            setState((prev) => {
              return { ...newGPState };
            });
          } else {
            newGPState[joystickKey] += 1;
            setState((prev) => {
              return { ...newGPState };
            });
          }

          if (newGPState[joystickKey] < -1) {
            newGPState[joystickKey] = 0;
          } else if (newGPState[joystickKey] > 1) {
            newGPState[joystickKey] = 0;
          }
        } else {
          //console.log("Setting " + key + " to true");
          newGPState[key] = true;
          setState((prev) => {
            return { ...newGPState };
          });
        }
      }
    });
    if (wantedKey === true) updateGamepadState(newGPState);
  }
};

//Same as above but for the release
export const releaseKey = (e, setState) => {
  let newGPState = { ...gamepadState };
  if (gamepadIndex === -1) {
    Object.keys(keyboardMap).forEach((key) => {
      if (
        e.key.toLowerCase() ===
        (typeof keyboardMap[key] === "string"
          ? keyboardMap[key].toLowerCase()
          : keyboardMap[key])
      ) {
        if (key.search("-stick") >= 0) {
          //joy-stick-logic
          let joystickKey = key.substring(0, key.lastIndexOf("-"));
          if (key.search("-up") >= 0 || key.search("-left") >= 0) {
            if (newGPState[joystickKey] !== 0) {
              newGPState[joystickKey] += 1;
              setState((prev) => {
                return { ...newGPState };
              });
            }
          } else {
            if (newGPState[joystickKey] !== 0) {
              newGPState[joystickKey] -= 1;
              setState((prev) => {
                return { ...newGPState };
              });
            }
          }
          if (newGPState[joystickKey] < -1) {
            newGPState[joystickKey] = 0;
          } else if (newGPState[joystickKey] > 1) {
            newGPState[joystickKey] = 0;
          }
        } else {
          newGPState[key] = false;
          setState((prev) => {
            return { ...newGPState };
          });
        }
      }
    });
    updateGamepadState(newGPState);
  }
};

//This is takes a function as a parameter. When the next button is pressed, run the function and return the button key (0-16)
export const getNextButton = (response) => {
  doOnNextPress = response;
};

export const setBind = (key, button) => {
  if (gamepadIndex === -1) {
    //console.log("Binding " + key + " to " + button + " for Keyboard");
    keyboardMap[key] = button;
  } else {
    //console.log("Binding " + key + " to " + button + " for Gamepad");
    controllerMap[key] = button;
  }
  mirriorFuncs.forEach((mirror) => mirror.func(getControllerMap()));
  localStorage.setItem("ControllerMapping", exportMapToJSON());
};

//this takes a function as an input. The function will be ran anytime a keybind is changed.
//This was added to properly update the state in the map manager
export const addMirrorMap = (func, id) => {
  mirriorFuncs.push({ id: id, func: func });
};

//this will remove the mirrior function with the ascociated ID
export const removeMirrorMap = (id) => {
  mirriorFuncs.filter((mirror) => mirror.id !== id);
};

//I didn't use this because i forgot that I wrote it. I basically rewrote it in the keypress function above
export const checkPress = (key) => {
  let mapIndex = Object.values(keyboardMap).indexOf(key);
  let button = Object.keys(keyboardMap)[mapIndex];
  return button;
};

//exports the maps to JSON
export const exportMapToJSON = () => {
  return JSON.stringify({
    controllerMap: controllerMap,
    keyboardMap: keyboardMap,
  });
};

//imports the maps from JSON
export const importMapFromJSON = (mapJSONString) => {
  let map = JSON.parse(mapJSONString);
  controllerMap = map.controllerMap;
  keyboardMap = map.keyboardMap;
};

//returns the controller map depending on what controller is active
export const getControllerMap = () => {
  return gamepadIndex === -1 ? keyboardMap : controllerMap;
};

//Set the maps to the default binds
export const setBindsToDefault = () => {
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
    a: "p",
    b: "l",
    x: "o",
    y: "k",
    up: "W",
    down: "S",
    left: "A",
    right: "D",
    zr: 5,
    zl: 4,
    r: 7,
    l: 6,
    plus: "=",
    minus: "-",
    capture: "End",
    home: "Home",
    r_stick: 11,
    l_stick: 10,
    //only read if the emulated joysticks is false This will not crash, but it wont do anything...
    "right-stick-x": 2,
    "right-stick-y": 3,
    "left-stick-x": 0,
    "left-stick-y": 1,
    //set to true for emulated joysticks
    "emulate-joystick": true,
    //only read if the emulated joysticks is true
    "right-stick-y-up": "ArrowUp",
    "right-stick-y-down": "ArrowDown",
    "right-stick-x-left": "ArrowLeft",
    "right-stick-x-right": "ArrowRight",
    "left-stick-x-left": "a",
    "left-stick-x-right": "d",
    "left-stick-y-up": "w",
    "left-stick-y-down": "s",
  };

  mirriorFuncs.forEach((mirror) => mirror.func(getControllerMap()));
};
//check if we have a Map in storage, if so load it, else we will load the default.
if (localStorage.getItem("ControllerMapping")) {
  importMapFromJSON(localStorage.getItem("ControllerMapping"));
} else {
  setBindsToDefault();
}
