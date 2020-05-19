const io = require("socket.io-client");

let socket;

export const setConnection = (ip, onConnect, onDisconnect) => {
  let parsedIP = "http://" + ip.replace("http://", "");
  socket = io(parsedIP);

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
};

export const sendCommand = (command) => {};
export const disconnectSocket = () => {
  socket.disconnect();
  socket = null;
};

export default socket;
