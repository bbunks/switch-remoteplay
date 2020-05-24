import React from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.css";

const Header = (props) => {
  return (
    <div>
      <header className={classes.Header}>
        <p>Remote Play Switch</p>
        <button>Set Binds</button>
      </header>
    </div>
  );
};

export default Header;
