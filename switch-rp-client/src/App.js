import React, { useState, useEffect, useCallback, useRef } from "react";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import Controller from "./components/Controller/Controller";
import ControllerConfig from "./components/ControllerConfig/ControllerConfig";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  const [controllerList, setControllerList] = useState([
    {
      index: -1,
      id: "Keyboard",
    },
  ]);
  const [activeController, setActiveController] = useState(-1);
  const [controllerState, setControllerState] = useState({ timestamp: 0 });
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
          return gamepads[index];
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
    <Router>
      <div className={classes.App}>
        <Header />
        <button onClick={(e) => console.log(activeController)}></button>
        <Controller
          controllerList={controllerList}
          activeController={activeController}
          setActiveController={setActiveController}
        />
        <Switch>
          <Route path="/controls">
            <ControllerConfig />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
