import React, { useState, useEffect, useCallback, useRef } from "react";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import Controller from "./components/Controller/Controller";
import {
  translateGamepad,
  setActiveGamepad,
  pressKey,
  releaseKey,
} from "./gameController";
import StreamEmbed from "./components/StreamEmbed/StreamEmbed";
import useStickyState from "./customHooks/stickyState";

const App = (props) => {
  const [controllerList, setControllerList] = useState([
    {
      index: -1,
      id: "Keyboard",
    },
  ]);
  const [activeController, setActiveController] = useState(-1);
  const [controllerState, setControllerState] = useState({});
  const [channel, setChannel] = useStickyState("monstercat", "channel");
  const [platform, setPlatform] = useState("none");
  const [timestamp, setTimestamp] = useState(0);
  let pollRef;

  //Handles the Controllers Connection
  const addController = (e) => {
    console.log(e.gamepad.id + "connected");
    setControllerList((prevControllerList) => [
      ...prevControllerList,
      {
        index: e.gamepad.index,
        id: e.gamepad.id,
      },
    ]);
  };

  //Handles the Controllers Disconnect
  const removeController = useCallback(
    (e) => {
      if (activeController === e.gamepad.index) setActiveController(-1); //If the controller is disconnected, set the active controller to the keyboard
      setControllerList((prevControllerList) => [
        ...prevControllerList.filter((gp) => gp.index !== e.gamepad.index),
      ]);
    },
    [activeController]
  );

  //the gamepad poll using animation frames
  const pollGamepads = useCallback(() => {
    //get the list of all active gamepads
    let gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
      ? navigator.webkitGetGamepads()
      : [];

    //destructures the controlers index and id
    let { index, id } = controllerList.find(
      (i) => i.index === activeController
    );

    if (gamepads[index]) {
      setControllerState((prevState) => {
        if (prevState.timestamp !== gamepads[index].timestamp) {
          setTimestamp((prevTimestamp) => gamepads[index].timestamp);
          return translateGamepad(gamepads[index]);
        } else {
          return prevState;
        }
      });
    }

    pollRef = requestAnimationFrame(pollGamepads);
  }, [activeController]);

  //adds an event listener to check for new gamepads
  useEffect(() => {
    window.addEventListener("gamepadconnected", addController);
    window.addEventListener("keydown", (e) => pressKey(e, setControllerState));
    window.addEventListener("keyup", (e) => releaseKey(e, setControllerState));
  }, []);

  //adds an event listener to check for removed gamepads
  useEffect(() => {
    window.addEventListener("gamepaddisconnected", removeController);

    return () => {
      window.removeEventListener("gamepaddisconnected", removeController);
    };
  }, [removeController]);

  //Starts a poll for gamepad whenever it is selected from the drop down menu
  useEffect(() => {
    //the keyboard is -1 so we don't want to poll a keyboard
    setActiveGamepad(
      activeController,
      controllerList.find((i) => i.index === activeController).id
    );
    if (activeController !== -1) {
      console.log(
        "Polling " + controllerList.find((i) => i.index === activeController).id
      );
      pollRef = requestAnimationFrame(pollGamepads);
    }

    //tells the poll to stop when a new controller is selected.
    return () => {
      console.log(
        "Stopped polling " +
          controllerList.find((i) => i.index === activeController).id
      );
      cancelAnimationFrame(pollRef);
    };
  }, [pollGamepads, activeController]);

  return (
    <div className={classes.App}>
      <Header />
      <StreamEmbed channel={channel} platform={platform} />
      <Controller
        controllerList={controllerList}
        activeController={activeController}
        setActiveController={setActiveController}
        controllerState={controllerState}
        channel={channel}
        setChannel={setChannel}
        platform={platform}
        setPlatform={setPlatform}
      />
    </div>
  );
};

export default App;
