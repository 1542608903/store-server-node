const socketIo = require("socket.io");

let io;

const initSocket = (server) => {
  io = socketIo(server);
  io.on("connection", (socket) => {
    console.log("客户端连接");
    socket.on("chat message", (data) => {
      console.log("客户端发送数据", data);
      io.emit("chat message", data);
    });

    socket.on("disconnect", () => {
      console.log("客户端断开连接");
    });
  });
};

const getSocketInstance = () => {
  if (!io) {
    throw new Error("套接字未初始化。首先调用initSocket。");
  }
  return io;
};

module.exports = {
  initSocket,
  getSocketInstance,
};
