import React from "react";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import Controller from "./components/Controller/Controller";

const App = () => {
  return (
    <div className={classes.App}>
      <Header />
      <Controller />
    </div>
  );
};

export default App;
