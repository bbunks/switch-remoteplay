import React, { useEffect, useRef } from "react";
import classes from "./StreamEmbed.module.css";

const StreamEmbed = (props) => {
  const twitchStream = useRef();
  const script = useRef();
  const firstUpdate = useRef(true);

  useEffect(() => {
    script.current = document.createElement("script");
    script.current.setAttribute("src", "https://embed.twitch.tv/embed/v1.js");

    document.body.appendChild(script.current);
    script.current.addEventListener("load", () => {
      twitchStream.current = new window.Twitch.Embed("video-embed", {
        height: "100%",
        width: "100%",
        layout: "video",
        channel: props.channel,
        theme: "dark",
      });
    });
  }, []);

  useEffect(() => {
    if (!firstUpdate.current) {
      if (props.platform === "twitch") {
        twitchStream.current.setChannel(props.channel.toLowerCase());
      }
    } else {
      firstUpdate.current = false;
    }
  }, [props.channel, props.platform]);

  let stream = null;
  switch (props.platform) {
    case "twitch":
      stream = <div id="video-embed" className={classes.StreamEmbed} />;
      break;
    case "mixer":
      stream = (
        <iframe
          className={classes.StreamEmbed}
          title="Halios's player frame"
          i18n-title="channel#ShareDialog:playerEmbedFrame|Embed player Frame copied from share dialog"
          allowfullscreen="true"
          src={
            "https://mixer.com/embed/player/" +
            props.channel +
            "?disableLowLatency=0"
          }
          width="100%"
          height="100%"
        >
          {" "}
        </iframe>
      );
      break;
  }
  return stream;
};

export default StreamEmbed;
