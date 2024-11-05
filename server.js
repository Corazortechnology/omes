const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const { ExpressPeerServer } = require("peer");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const dotenv = require("dotenv");
const connectDB = require("./Server/database/connection");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

connectDB();
app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

app.set("view engine", "ejs");

app.use("/css", express.static(path.resolve(__dirname, "Assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "Assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "Assets/js")));

app.use("/", require("./Server/routes/router"));

// Creating HTTP server
const server = http.createServer(app);

// PeerJS server setup
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs'
});
app.use("/peerjs", peerServer);

// Socket.io setup
const io = socketio(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

var userConnection = [];

io.on("connection", (socket) => {
  console.log("Socket id is: ", socket.id);

  socket.on("userconnect", (data) => {
    console.log("Logged in username", data.displayName);
    userConnection.push({
      connectionId: socket.id,
      user_id: data.displayName,
    });

    var userCount = userConnection.length;
    console.log("UserCount", userCount);
    userConnection.map(function (user) {
      console.log("Username is: ", user.user_id);
    });
  });
  socket.on("offerSentToRemote", (data) => {
    var offerReceiver = userConnection.find(
      (o) => o.user_id === data.remoteUser
    );
    if (offerReceiver) {
      console.log("OfferReceiver user is: ", offerReceiver.connectionId);
      socket.to(offerReceiver.connectionId).emit("ReceiveOffer", data);
    }
  });
  socket.on("answerSentToUser1", (data) => {
    var answerReceiver = userConnection.find(
      (o) => o.user_id === data.receiver
    );
    if (answerReceiver) {
      console.log("answerReceiver user is: ", answerReceiver.connectionId);
      socket.to(answerReceiver.connectionId).emit("ReceiveAnswer", data);
    }
  });
  socket.on("candidateSentToUser", (data) => {
    var candidateReceiver = userConnection.find(
      (o) => o.user_id === data.remoteUser
    );
    if (candidateReceiver) {
      console.log(
        "candidateReceiver user is: ",
        candidateReceiver.connectionId
      );
      socket.to(candidateReceiver.connectionId).emit("candidateReceiver", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // var disUser = userConnection.find((p) => (p.connectionId = socket.id));
    // if (disUser) {
    userConnection = userConnection.filter((p) => p.connectionId !== socket.id);
    console.log(
      "Rest users username are: ",
      userConnection.map(function (user) {
        return user.user_id;
      })
    );
    // }
  });
  socket.on("remoteUserClosed", (data) => {
    var closedUser = userConnection.find((o) => o.user_id === data.remoteUser);
    if (closedUser) {
      console.log("closedUser user is: ", closedUser.connectionId);
      socket.to(closedUser.connectionId).emit("closedRemoteUser", data);
    }
  });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).broadcast.emit('user-connected', userId);

      socket.on('disconnect', () => {
          socket.to(roomId).broadcast.emit('user-disconnected', userId);
      });
  });
});
