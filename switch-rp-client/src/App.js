import React, { useState, useEffect, useCallback } from "react";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import Controller from "./components/Controller/Controller";
import ControllerConfig from "./components/ControllerConfig/ControllerConfig";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  const [controllerList, setControllerList] = useState([
    {
      index: "-1",
      id: "Keyboard",
    },
  ]);
  const [activeController, setActiveController] = useState(-1);
  const [controllerState, setControllerState] = useState(null);
  const [activePoll, setActivePoll] = useState(0);

  //Handles the Controllers Connection
  const addController = (e) => {
    console.log(e.gamepad.id + "connected");
    setControllerList((prevControllerList) => [
      ...prevControllerList,
      {
        index: e.gamepad.index.toString(),
        id: e.gamepad.id,
      },
    ]);
  };

  //Handles the Controllers Disconnect
  const removeController = useCallback(
    (e) => {
      console.log(activeController + typeof activeController);
      console.log(e.gamepad.index + typeof e.gamepad.index);
      if (activeController === e.gamepad.index) setActiveController(-1); //If the controller is disconnected, set the active controller to the keyboard
      setControllerList((prevControllerList) => [
        ...prevControllerList.filter((gp) => gp.index != e.gamepad.index),
      ]);
    },
    [activeController]
  );

  //on load
  useEffect(() => {
    window.addEventListener("gamepadconnected", addController);
  }, []);

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
