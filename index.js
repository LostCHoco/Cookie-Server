import { Server } from "socket.io";
import { setID, updateUserlist } from "./roomRepository.js";

const PORT = 3333;
const io = new Server(PORT, {
  cors: {
    origin: ["http://localhost:3000", "https://cookiechat-4df6b.web.app"],
  },
});
console.log(`server on => http://localhost:${PORT}`);
const roomRepository = [
  {
    id: "test",
    title: "Test Room",
    password: "1234",
    current: 0,
    max: 8,
    userList: {},
  },
];
const roomID = [];
const chatRepository = {};
const users = [];
const userInfo = {};

function sendToAll(socket, key, data) {
  socket.broadcast.emit(key, data);
  socket.emit(key, data);
}

//클라이언트에서 유저 접속 했을 때 이벤트 발생
io.on("connection", (socket) => {
  console.log(socket.id);
  const ip = socket.handshake.address;
  /*클라이언트에서 유저가 접속시
  서버에 저장되어있는 방들의 데이터 배열을 전송*/
  socket.emit("initialize", [roomRepository, chatRepository]);
  socket.emit("clientID", socket.id);
  // 채팅메세지 수신
  socket.on("chat-request", (msg) => {
    const { id, user, photo, date, text } = msg;
    const data = { user: user, photo: photo, date: date, text: text };
    if (chatRepository[id] === undefined) chatRepository[id] = [];
    chatRepository[id].push(data);
    // 채팅메세지 송신
    sendToAll(socket, "chat-response", chatRepository);
    console.log(chatRepository);
  });
  // 클라이언트에서 방 생성 요청
  socket.on("newRoom", (room) => {
    room.id = setID(roomID);
    if (room.id === -1) {
      console.log("overflow: 방 생성 실패");
      return false;
    }
    socket.emit("newRoomId", room.id);
    roomRepository.push(room);
    roomID.push(room.id);
    // 서버에서 방 생성 응답
    sendToAll(socket, "rooms", roomRepository);
  });
  //채팅방에 유저 입장
  socket.on("enter-room", (data) => {
    console.log(data.user);

    const idx = roomRepository.findIndex((item) => item.id === data.id);
    // roomRepository[idx].userList = updateUserlist(
    //   roomRepository[idx].userList,
    //   data.user.uid
    // );
    Object.defineProperty(roomRepository[idx].userList, data.user.uid, {
      value: {
        name: data.user.name,
        photo: data.user.photo,
      },
      configurable: true,
      enumerable: true,
      writable: true,
    });
    const current = Object.keys(roomRepository[idx].userList).length;
    roomRepository[idx].current = current;
    sendToAll(socket, "update-room", roomRepository);
    console.log("list", roomRepository[idx]);
    // console.log("info : ", userInfo);
  });
  //접속 해제 이벤트
  socket.on("disconnect", (data) => {
    console.log(socket.id, "disconnected");
    users.splice(users.indexOf(socket.id), 1);
  });
});
