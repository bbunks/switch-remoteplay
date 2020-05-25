import React, { useState, useEffect, useCallback, useRef } from "react";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import Controller from "./components/Controller/Controller";
import { translateGamepad } from "./gameController";
import StreamEmbed from "./components/StreamEmbed/StreamEmbed";

const App = (props) => {
  const [controllerList, setControllerList] = useState([
    {
      index: -1,
      id: "Keyboard",
    },
  ]);
  const [activeController, setActiveController] = useState(-1);
  const [controllerState, setControllerState] = useState({});
  const [channel, setChannel] = useState("monstercat");
  const [platform, setPlatform] = useState("twitch");
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

  const pollGamepads = useCallback(() => {
    let gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
      ? navigator.webkitGetGamepads()
      : [];

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

  //on load
  useEffect(() => {
    window.addEventListener("gamepadconnected", addController);
  }, []);

  useEffect(() => {
    if (activeController !== -1) {
      console.log(
        "Polling " + controllerList.find((i) => i.index === activeController).id
      );
      pollRef = requestAnimationFrame(pollGamepads);
    }
    return () => {
      console.log(
        "Stopped polling " +
          controllerList.find((i) => i.index === activeController).id
      );
      cancelAnimationFrame(pollRef);
    };
  }, [pollGamepads]);

  useEffect(() => {
    window.addEventListener("gamepaddisconnected", removeController);

    return () => {
      window.removeEventListener("gamepaddisconnected", removeController);
    };
  }, [removeController]);

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
