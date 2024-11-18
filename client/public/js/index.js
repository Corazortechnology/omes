// let localStream;
// var username;
// let remoteUser;
// let url = new URL(window.location.href);
// // // username = url.searchParams.get("username");
// // remoteUser = url.searchParams.get("remoteuser");
// let peerConnection;
// let remoteStream;
// let sendChannel;
// let receiveChannel;
// var msgInput = document.querySelector("#msg-input");
// var msgSendBtn = document.querySelector(".msg-send-button");
// var chatTextArea = document.querySelector(".chat-text-area");
// var omeID = localStorage.getItem("omeID");
// if (omeID) {
//   $.ajax({
//     url: "/new-user-update/" + omeID + "",
//     type: "PUT",
//     success: function (data) {
//       const newOmeID = data.omeID;
//       if (newOmeID) {
//         localStorage.removeItem("omeID");
//         localStorage.setItem("omeID", newOmeID);
//         username = newOmeID;
//         console.log("Here username is: ", username);
//         runUser();
//       } else {
//         username = omeID;
//         console.log("Here username is: ", username);
//         runUser();
//       }
//     },
//   });
//   console.log("Here username is: ", username);
// } else {
//   var postData = "Demo Data";
//   $.ajax({
//     type: "POST",
//     url: "/api/users",
//     data: postData,
//     success: function (response) {
//       console.log(response);
//       localStorage.setItem("omeID", response);
//       username = response;
//       runUser();
//     },
//     error: function (error) {
//       console.log(error);
//     },
//   });
// }
// // ......Delete All Records..........

// document.addEventListener("DOMContentLoaded", () => {
//   const deleteButton = document.getElementById("deleteButton");

//   if (deleteButton) {
//     deleteButton.addEventListener("click", () => {
//       console.log("Delete button clicked!");
//       // Your logic here
//     });
//   } else {
//     console.warn("Delete button not found in the DOM!");
//   }
// });

// // ......Delete All Records..........
// function runUser() {
//   let init = async () => {
//     localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     const videoElement = document.getElementById("user-1");
//     if (videoElement) {
//       videoElement.srcObject = localStream;
//     } else {
//       console.error("Video element with id 'user-1' not found.");
//     }

//     $.post("/get-remote-users", { omeID: username })
//       .done(function (data) {
//         console.log(data);
//         if (data[0]) {
//           if (data[0]._id == remoteUser || data[0]._id == username) {
//           } else {
//             remoteUser = data[0]._id;
//             createOffer(data[0]._id);
//           }
//         }
//       })
//       .fail(function (xhr, textStatus, errorThrown) {
//         console.log(xhr.responseText);
//       });
//   };
//   init();
//   let socket = io.connect();
//   socket.on("connect", () => {
//     if (socket.connected) {
//       socket.emit("userconnect", {
//         displayName: username,
//       });
//     }
//   });
//   let servers = {
//     iceServers: [
//       {
//         urls: [
//           "stun:stun1.1.google.com:19302",
//           "stun:stun2.1.google.com:19302",
//         ],
//       },
//     ],
//   };
//   let createPeerConnection = async () => {
//     peerConnection = new RTCPeerConnection(servers);
//     remoteStream = new MediaStream();
//     document.getElementById("user-2").srcObject = remoteStream;
//     localStream.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, localStream);
//     });
//     peerConnection.ontrack = async (event) => {
//       event.streams[0].getTracks().forEach((track) => {
//         remoteStream.addTrack(track);
//       });
//     };
//     remoteStream.oninactive = () => {
//       remoteStream.getTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       peerConnection.close();
//     };
//     peerConnection.onicecandidate = async (event) => {
//       if (event.candidate) {
//         socket.emit("candidateSentToUser", {
//           username: username,
//           remoteUser: remoteUser,
//           iceCandidateData: event.candidate,
//         });
//       }
//     };
//     sendChannel = peerConnection.createDataChannel("sendDataChannel");
//     sendChannel.onopen = () => {
//       console.log("Data channel is now open and ready to use");
//       onSendChannelStateChange();
//     };

//     peerConnection.ondatachannel = receiveChannelCallback;
//     // sendChannel.onmessage=onSendChannelMessageCallBack;
//   };
//   function sendData() {
//     const msgData = msgInput.value;
//     chatTextArea.innerHTML +=
//       "<div style='margin-top:2px; margin-bottom:2px;'><b>Me: </b>" +
//       msgData +
//       "</div>";
//     if (sendChannel) {
//       onSendChannelStateChange();
//       sendChannel.send(msgData);
//       msgInput.value = "";
//     } else {
//       receiveChannel.send(msgData);
//       msgInput.value = "";
//     }
//   }
//   function receiveChannelCallback(event) {
//     console.log("Receive Channel Callback");
//     receiveChannel = event.channel;
//     receiveChannel.onmessage = onReceiveChannelMessageCallback;
//     receiveChannel.onopen = onReceiveChannelStateChange;
//     receiveChannel.onclose = onReceiveChannelStateChange;
//   }
//   function onReceiveChannelMessageCallback(event) {
//     console.log("Received Message");
//     chatTextArea.innerHTML +=
//       "<div style='margin-top:2px; margin-bottom:2px;'><b>Stranger: </b>" +
//       event.data +
//       "</div>";
//   }
//   function onReceiveChannelStateChange() {
//     const readystate = receiveChannel.readystate;
//     console.log("Receive channel state is: " + readystate);
//     if (readystate === "open") {
//       console.log(
//         "Data channel ready state is open - onReceiveChannelStateChange"
//       );
//     } else {
//       console.log(
//         "Data channel ready state is NOT open - onReceiveChannelStateChange"
//       );
//     }
//   }
//   function onSendChannelStateChange() {
//     const readystate = sendChannel.readystate;
//     console.log("Send channel state is: " + readystate);
//     if (readystate === "open") {
//       console.log(
//         "Data channel ready state is open - onSendChannelStateChange"
//       );
//     } else {
//       console.log(
//         "Data channel ready state is NOT open - onSendChannelStateChange"
//       );
//     }
//   }
//   function fetchNextUser(remoteUser) {
//     $.post(
//       "/get-next-user",
//       { omeID: username, remoteUser: remoteUser },
//       function (data) {
//         console.log("Next user is: ", data);
//         if (data[0]) {
//           if (data[0]._id == remoteUser || data[0]._id == username) {
//           } else {
//             remoteUser = data[0]._id;
//             createOffer(data[0]._id);
//           }
//         }
//       }
//     );
//   }
//   let createOffer = async (remoteU) => {
//     createPeerConnection();
//     let offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     socket.emit("offerSentToRemote", {
//       username: username,
//       remoteUser: remoteU,
//       offer: peerConnection.localDescription,
//     });
//   };

//   let createAnswer = async (data) => {
//     remoteUser = data.username;
//     createPeerConnection();
//     await peerConnection.setRemoteDescription(data.offer);
//     let answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
//     socket.emit("answerSentToUser1", {
//       answer: answer,
//       sender: data.remoteUser,
//       receiver: data.username,
//     });
//     document.querySelector(".next-chat").style.pointerEvents = "auto";
//     $.ajax({
//       url: "/update-on-engagement/" + username + "",
//       type: "PUT",
//       success: function (response) {},
//     });
//   };
//   socket.on("ReceiveOffer", function (data) {
//     createAnswer(data);
//   });
//   let addAnswer = async (data) => {
//     if (!peerConnection.currentRemoteDescription) {
//       peerConnection.setRemoteDescription(data.answer);
//     }
//     document.querySelector(".next-chat").style.pointerEvents = "auto";
//     $.ajax({
//       url: "/update-on-engagement/" + username + "",
//       type: "PUT",
//       success: function (response) {},
//     });
//   };
//   socket.on("ReceiveAnswer", function (data) {
//     addAnswer(data);
//   });
//   socket.on("closedRemoteUser", function (data) {
//     const remotStream = peerConnection.getRemoteStreams()[0];
//     remotStream.getTracks().forEach((track) => track.stop());
//     peerConnection.close();
//     document.querySelector(".chat-text-area").innerHTML = "";
//     const remoteVid = document.getElementById("user-2");
//     if (remoteVid.srcObject) {
//       remoteVid.srcObject.getTracks().forEach((track) => track.stop());
//       remoteVid.srcObject = null;
//     }
//     console.log("Closed Remote user");
//     $.ajax({
//       url: "/update-on-next/" + username + "",
//       type: "PUT",
//       success: function (response) {
//         fetchNextUser(remoteUser);
//       },
//     });
//   });

//   socket.on("candidateReceiver", function (data) {
//     peerConnection.addIceCandidate(data.iceCandidateData);
//   });

//   msgSendBtn.addEventListener("click", function (event) {
//     sendData();
//   });

//   window.addEventListener("unload", function (event) {
//     socket.emit("remoteUserClosed", {
//       username: username,
//       remoteUser: remoteUser,
//     });
//     if (navigator.userAgent.indexOf("Chrome") != -1) {
//       $.ajax({
//         url: "/leaving-user-update/" + username + "",
//         type: "PUT",
//         success: function (response) {
//           console.log(response);
//         },
//       });
//       $.ajax({
//         url: "/update-on-otheruser-closing/" + remoteUser + "",
//         type: "PUT",
//         success: function (response) {
//           console.log(response);
//         },
//       });
//     } else if (navigator.userAgent.indexOf("Firefox") != -1) {
//       $.ajax({
//         url: "/leaving-user-update/" + username + "",
//         type: "PUT",
//         async: false,
//         success: function (response) {
//           console.log(response);
//         },
//       });

//       $.ajax({
//         url: "/update-on-otheruser-closing/" + remoteUser + "",
//         type: "PUT",
//         async: false,
//         success: function (response) {
//           console.log(response);
//         },
//       });
//     } else {
//       console.log("This is not Chrome or Firefox");
//     }
//   });
//   async function closeConnection() {
//     document.querySelector(".chat-text-area").innerHTML = "";
//     const remotStream = peerConnection.getRemoteStreams()[0];
//     remotStream.getTracks().forEach((track) => track.stop());

//     await peerConnection.close();
//     const remoteVid = document.getElementById("user-2");
//     if (remoteVid.srcObject) {
//       remoteVid.srcObject.getTracks().forEach((track) => track.stop());
//       remoteVid.srcObject = null;
//     }

//     await socket.emit("remoteUserClosed", {
//       username: username,
//       remoteUser: remoteUser,
//     });
//     $.ajax({
//       url: "/update-on-next/" + username + "",
//       type: "PUT",
//       success: function (response) {
//         fetchNextUser(remoteUser);
//       },
//     });
//   }
//   // document.querySelector(".next-chat").onClick = function () {
//   $(document).on("click", ".next-chat", function () {
//     document.querySelector(".chat-text-area").innerHTML = "";
//     console.log("From Next Chat button");
//     closeConnection();
//   });
// }
import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import io from "socket.io-client";

const VideoChat = () => {
  const user1VideoRef = useRef(null);
  const user2VideoRef = useRef(null);
  const chatTextAreaRef = useRef(null);
  const msgInputRef = useRef(null);
  const msgSendBtnRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [username, setUsername] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);

  let peerConnection = null;
  let remoteStream = null;
  let sendChannel = null;
  let receiveChannel = null;

  const socket = useRef(null);

  // Helper functions
  const fetchOrCreateUser = () => {
    const omeID = localStorage.getItem("omeID");
    if (omeID) {
      $.ajax({
        url: `/new-user-update/${omeID}`,
        type: "PUT",
        success: (data) => {
          const newOmeID = data.omeID;
          if (newOmeID) {
            localStorage.setItem("omeID", newOmeID);
            setUsername(newOmeID);
            runUser(newOmeID);
          } else {
            setUsername(omeID);
            runUser(omeID);
          }
        },
      });
    } else {
      $.ajax({
        type: "POST",
        url: "/api/users",
        data: { demoData: true },
        success: (response) => {
          localStorage.setItem("omeID", response);
          setUsername(response);
          runUser(response);
        },
        error: (error) => console.error(error),
      });
    }
  };

  const runUser = async (currentUsername) => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (user1VideoRef.current) {
        user1VideoRef.current.srcObject = stream;
      }

      $.post("/get-remote-users", { omeID: currentUsername })
        .done((data) => {
          if (data[0] && data[0]._id !== currentUsername) {
            setRemoteUser(data[0]._id);
            createOffer(data[0]._id);
          }
        })
        .fail((error) => console.error(error.responseText));
    };

    init();

    // Initialize Socket.IO connection
    if (!socket.current) {
      socket.current = io();

      socket.current.on("connect", () => {
        socket.current.emit("userconnect", {
          displayName: currentUsername,
        });
      });

      socket.current.on("ReceiveOffer", (data) => createAnswer(data));
      socket.current.on("ReceiveAnswer", (data) => addAnswer(data));
      socket.current.on("candidateReceiver", (data) =>
        peerConnection.addIceCandidate(data.iceCandidateData)
      );
      socket.current.on("closedRemoteUser", handleRemoteUserClose);
    }
  };

  const createPeerConnection = async () => {
    const servers = {
      iceServers: [
        {
          urls: [
            "stun:stun1.1.google.com:19302",
            "stun:stun2.1.google.com:19302",
          ],
        },
      ],
    };
    peerConnection = new RTCPeerConnection(servers);
    remoteStream = new MediaStream();

    if (user2VideoRef.current) {
      user2VideoRef.current.srcObject = remoteStream;
    }

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("candidateSentToUser", {
          username,
          remoteUser,
          iceCandidateData: event.candidate,
        });
      }
    };

    sendChannel = peerConnection.createDataChannel("sendDataChannel");
    sendChannel.onopen = () => console.log("Data channel is open");
    sendChannel.onmessage = (event) => onReceiveChannelMessage(event);
  };

  const createOffer = async (remoteU) => {
    await createPeerConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.current.emit("offerSentToRemote", {
      username,
      remoteUser: remoteU,
      offer: peerConnection.localDescription,
    });
  };

  const createAnswer = async (data) => {
    setRemoteUser(data.username);
    await createPeerConnection();
    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.current.emit("answerSentToUser1", {
      answer,
      sender: data.remoteUser,
      receiver: data.username,
    });

    enableNextChatButton();

    $.ajax({
      url: `/update-on-engagement/${username}`,
      type: "PUT",
      success: () => console.log("Engagement updated"),
    });
  };

  const addAnswer = async (data) => {
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(data.answer);
    }

    enableNextChatButton();

    $.ajax({
      url: `/update-on-engagement/${username}`,
      type: "PUT",
      success: () => console.log("Engagement updated"),
    });
  };

  const handleRemoteUserClose = () => {
    if (peerConnection) {
      peerConnection.close();
    }

    if (user2VideoRef.current) {
      user2VideoRef.current.srcObject = null;
    }

    chatTextAreaRef.current.innerHTML = "";

    $.ajax({
      url: `/update-on-next/${username}`,
      type: "PUT",
      success: () => fetchNextUser(remoteUser),
    });
  };

  const fetchNextUser = (currentRemoteUser) => {
    $.post(
      "/get-next-user",
      { omeID: username, remoteUser: currentRemoteUser },
      (data) => {
        if (data[0] && data[0]._id !== username) {
          setRemoteUser(data[0]._id);
          createOffer(data[0]._id);
        }
      }
    );
  };

  const closeConnection = async () => {
    chatTextAreaRef.current.innerHTML = "";

    if (peerConnection) {
      const remotStream = peerConnection.getRemoteStreams()[0];
      remotStream.getTracks().forEach((track) => track.stop());
      peerConnection.close();
    }

    if (user2VideoRef.current) {
      user2VideoRef.current.srcObject = null;
    }

    socket.current.emit("remoteUserClosed", {
      username,
      remoteUser,
    });

    $.ajax({
      url: `/update-on-next/${username}`,
      type: "PUT",
      success: () => fetchNextUser(remoteUser),
    });
  };

  const sendData = () => {
    const msgData = msgInputRef.current.value;
    if (sendChannel) {
      sendChannel.send(msgData);
      chatTextAreaRef.current.innerHTML += `<div><b>Me:</b> ${msgData}</div>`;
      msgInputRef.current.value = "";
    }
  };

  const enableNextChatButton = () => {
    const nextChatButton = document.querySelector(".next-chat");
    if (nextChatButton) {
      nextChatButton.style.pointerEvents = "auto";
    }
  };

  useEffect(() => {
    fetchOrCreateUser();

    const deleteButton = document.getElementById("deleteButton");
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        console.log("Delete button clicked!");
      });
    }

    window.addEventListener("unload", () => {
      socket.current.emit("remoteUserClosed", {
        username,
        remoteUser,
      });

      $.ajax({
        url: `/leaving-user-update/${username}`,
        type: "PUT",
        async: false,
        success: () => console.log("User leaving updated"),
      });

      $.ajax({
        url: `/update-on-otheruser-closing/${remoteUser}`,
        type: "PUT",
        async: false,
        success: () => console.log("Other user closing updated"),
      });
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <header>
        <nav>
          <div className="container">
            <img className="logo" src="/img/Logo.png" alt="" />
            <h2 className="headerText">Talk to stranger</h2>
            <div className="online-status">5000+ online now</div>
          </div>
        </nav>
      </header>
      <main className="video_chat_main_container">
        <div className="video_chat_container">
          <div className="video-tag-container">
            <div className="videos">
              <video
                ref={user1VideoRef}
                id="user-1"
                autoPlay
                playsInline
              ></video>
              <video
                ref={user2VideoRef}
                id="user-2"
                autoPlay
                playsInline
                style={{ borderTop: "2px solid white" }}
              ></video>
            </div>
          </div>
          <div className="chat-container">
            <div className="chat-text-container" ref={chatTextAreaRef}></div>
            <textarea
              ref={msgInputRef}
              id="msg-input"
              cols="25"
              rows="5"
            ></textarea>
            <div
              className="msg-send-button"
              onClick={sendData}
              ref={msgSendBtnRef}
            >
              <i className="material-icons" style={{ fontSize: "36px" }}>
                send
              </i>
            </div>
            <button id="deleteButton">Delete All Records</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoChat;
