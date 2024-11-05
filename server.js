const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const { ExpressPeerServer } = require("peer");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./Server/database/connection");
// const cors = require("cors");
// dotenv.config({ path: "config.env" });
const PORT = 8080;
const allowedOrigins = ["https://omes.onrender.com", "http://localhost:8080"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.) if needed
  })
);
connectDB();
app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

app.set("view engine", "ejs");

app.use("/css", express.static(path.resolve(__dirname, "Assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "Assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "Assets/js")));

app.use("/", require("./Server/routes/router"));

var server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  allowEIO3: true, //False by default
});
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);
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
