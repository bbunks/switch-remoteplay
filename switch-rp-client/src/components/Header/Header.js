import React from "react";
import classes from "./Header.module.css";

const Header = (props) => {
  return (
    <div>
      <header className={classes.Header}>
        <p>Remote Play Switch</p>
      </header>
    </div>
  );
};

export default Header;
