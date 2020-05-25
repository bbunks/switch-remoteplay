const io = require("socket.io-client");

let socket;

export const setConnection = (ip, onConnect, onDisconnect) => {
  let parsedIP = "https://" + ip.replace("http://", "").replace("https://", "");
  socket = io(parsedIP);

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
};

export const sendCommand = (command) => {
  if (socket) {
    //console.log("sending the command '" + command + "'");
    socket.emit("p", command);
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
  socket = null;
};

export default socket;
