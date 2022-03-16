import io from "socket.io-client";

let socket = io();

export const setConnection = (
  ip: string,
  onConnect: () => void,
  onDisconnect: () => void
) => {
  let parsedIP = "http://" + ip.replace("http://", "").replace("https://", "");
  socket = io(parsedIP);

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
};

export const sendCommand = (command: string) => {
  if (socket) {
    socket.emit("p", command);
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
  socket = io();
};

export default socket;
