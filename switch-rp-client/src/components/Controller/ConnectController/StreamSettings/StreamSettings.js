import React from "react";
import classes from "./StreamSettings.module.css";

const StreamSettings = (props) => {
  return (
    <>
      <h2>Stream</h2>
      <hr />
      <h3>Platform</h3>
      <select
        value={props.platform}
        onChange={(e) => props.setPlatform(e.target.value)}
      >
        <option value="mixer">Mixer</option>
        <option value="none">None</option>
      </select>
      <h3>Channel</h3>
      <input
        value={props.channel}
        onChange={(e) => {
          props.setChannel(e.target.value);
        }}
      />
    </>
  );
};

export default StreamSettings;
