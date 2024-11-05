let localStream;
let username;
let remoteUser;
let peer;
let connection; // For data connections
let call; // For media calls
let remoteStream;
let msgInput = document.querySelector("#msg-input");
let msgSendBtn = document.querySelector(".msg-send-button");
let chatTextArea = document.querySelector(".chat-text-area");
var omeID = localStorage.getItem("omeID");

if (omeID) {
  $.ajax({
    url: "/new-user-update/" + omeID + "",
    type: "PUT",
    success: function (data) {
      const newOmeID = data.omeID;
      if (newOmeID) {
        localStorage.removeItem("omeID");
        localStorage.setItem("omeID", newOmeID);
        username = newOmeID;
        console.log("Here username is: ", username);
        initializePeer();
      } else {
        username = omeID;
        console.log("Here username is: ", username);
        initializePeer();
      }
    },
  });
} else {
  var postData = "Demo Data";
  $.ajax({
    type: "POST",
    url: "/api/users",
    data: postData,
    success: function (response) {
      console.log(response);
      localStorage.setItem("omeID", response);
      username = response;
      initializePeer();
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// Initialize Peer connection
function initializePeer() {
  peer = new Peer(username, {
    host: "omes-2.onrender.com", // Change to your server's host
    path: "/peerjs",
    secure: true,
  });

  peer.on("open", (id) => {
    console.log("Connected with Peer ID:", id);
    runUser(); // Initialize user after Peer ID is ready
  });

  peer.on("call", (incomingCall) => {
    incomingCall.answer(localStream); // Answer incoming call with local stream
    incomingCall.on("stream", (incomingStream) => {
      remoteStream = incomingStream;
      document.getElementById("user-2").srcObject = remoteStream;
    });
    call = incomingCall; // Keep reference for further actions
  });

  peer.on("connection", (dataConnection) => {
    connection = dataConnection;
    connection.on("data", (data) => {
      chatTextArea.innerHTML += `<div><b>Stranger: </b>${data}</div>`;
    });
  });
}

async function runUser() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  document.getElementById("user-1").srcObject = localStream;

  $.post("https://omes-2.onrender.com/get-remote-users", { omeID: username })
    .done(function (data) {
      if (data[0] && data[0]._id !== username) {
        remoteUser = data[0]._id;
        initiateConnection(remoteUser);
      }
    })
    .fail(function (xhr) {
      console.log(xhr.responseText);
    });
}

// Initiate Peer connection with remote user
function initiateConnection(remoteUserId) {
  connection = peer.connect(remoteUserId); // Data connection for messaging

  // Set up chat
  connection.on("open", () => {
    console.log("Data connection established");
  });

  // Call remote user with media
  call = peer.call(remoteUserId, localStream);
  call.on("stream", (incomingStream) => {
    remoteStream = incomingStream;
    document.getElementById("user-2").srcObject = remoteStream;
  });
}

// Send chat message
function sendData() {
  const msgData = msgInput.value;
  chatTextArea.innerHTML += `<div><b>Me: </b>${msgData}</div>`;
  if (connection && connection.open) {
    connection.send(msgData);
    msgInput.value = "";
  }
}

msgSendBtn.addEventListener("click", sendData);

// Disconnect handling
window.addEventListener("unload", function (event) {
  if (call) call.close();
  if (connection) connection.close();
});

// Function for closing connection and fetching next user
async function closeConnection() {
  document.querySelector(".chat-text-area").innerHTML = "";
  if (call) call.close();
  if (connection) connection.close();
  // Reset video element
  const remoteVid = document.getElementById("user-2");
  if (remoteVid.srcObject) {
    remoteVid.srcObject.getTracks().forEach((track) => track.stop());
    remoteVid.srcObject = null;
  }
  // Fetch the next user
  fetchNextUser(remoteUser);
}

// Fetch the next user
function fetchNextUser(remoteUser) {
  $.post(
    "https://omes-2.onrender.com/get-next-user",
    { omeID: username, remoteUser: remoteUser },
    function (data) {
      if (data[0] && data[0]._id !== username) {
        remoteUser = data[0]._id;
        initiateConnection(remoteUser);
      }
    }
  );
}

// Listen for the "Next Chat" button click
$(document).on("click", ".next-chat", function () {
  console.log("From Next Chat button");
  closeConnection();
});
