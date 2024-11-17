// import React, { useEffect } from "react";
// import { io } from "socket.io-client";
// import Header from "./Components/Header";
// import Chat from "./Components/Chat";

// const SOCKET_SERVER_URL = "http://localhost:8000";

// function VideoChat() {
//   useEffect(() => {
//     // Initialize Socket.IO client
//     const socket = io(SOCKET_SERVER_URL);

//     socket.on("connect", () => {
//       console.log("Connected to the Socket.IO server with ID:", socket.id);
//     });

//     // Cleanup on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         const videoElement = document.getElementById("user-1");
//         if (videoElement) {
//           videoElement.srcObject = stream;
//         } else {
//           console.error("Video element with id 'user-1' not found.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error accessing media devices:", error);
//       });
//   }, []);

//   useEffect(() => {
//     const deleteButton = document.getElementById("deleteButton");

//     if (deleteButton) {
//       deleteButton.addEventListener("click", () => {
//         console.log("Delete button clicked!");
//         // Your delete logic
//       });
//     } else {
//       console.warn("Delete button not found in the DOM!");
//     }

//     return () => {
//       // Cleanup the event listener on component unmount
//       if (deleteButton) {
//         deleteButton.removeEventListener("click", () => {
//           console.log("Delete button clicked!");
//         });
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <Header />
//       <main className="video_chat_main_container">
//         <div className="video_chat_container">
//           <div className="video-tag-container">
//             <div className="videos">
//               <video
//                 className="video-player"
//                 id="user-1"
//                 autoPlay
//                 playsInline
//               ></video>
//               <video
//                 className="video-player"
//                 id="user-2"
//                 style={{ borderTop: "2px solid white" }}
//                 autoPlay
//                 playsInline
//               ></video>
//             </div>
//           </div>
//           <div>
//             <button id="deleteButton">Delete All Records</button>
//           </div>
//           <Chat />
//         </div>
//       </main>
//     </div>
//   );
// }

// export default VideoChat;
// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import $ from "jquery";

// const VideoChat = () => {
//   const [username, setUsername] = useState(
//     localStorage.getItem("omeID") || null
//   );
//   const [remoteUser, setRemoteUser] = useState(null);
//   const [peerConnection, setPeerConnection] = useState(null);
//   const userVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const msgInputRef = useRef(null);
//   const chatTextAreaRef = useRef(null);
//   const socketRef = useRef(null); // Use a ref to manage the socket instance

//   const servers = {
//     iceServers: [
//       {
//         urls: [
//           "stun:stun1.1.google.com:19302",
//           "stun:stun2.1.google.com:19302",
//         ],
//       },
//     ],
//   };

//   // Initialize the user (only once)
//   useEffect(() => {
//     const initUser = async () => {
//       if (!username) {
//         $.post("/api/users", "Demo Data", (response) => {
//           localStorage.setItem("omeID", response);
//           setUsername(response);
//         });
//       } else {
//         $.ajax({
//           url: `/new-user-update/${username}`,
//           type: "PUT",
//           success: (data) => {
//             const newOmeID = data.omeID;
//             if (newOmeID) {
//               localStorage.setItem("omeID", newOmeID);
//               setUsername(newOmeID);
//             }
//           },
//         });
//       }
//     };

//     initUser();
//   }, []); // Empty dependency array ensures this runs only once

//   // Initialize the socket connection (only once)
//   useEffect(() => {
//     if (!username) return;

//     const socket = io("http://localhost:8000"); // Ensure this matches your backend server URL
//     socketRef.current = socket;

//     socket.on("connect", () => {
//       socket.emit("userconnect", { displayName: username });
//     });

//     socket.on("ReceiveOffer", (data) => createAnswer(data));
//     socket.on("ReceiveAnswer", (data) => addAnswer(data));
//     socket.on("candidateReceiver", (data) =>
//       peerConnection?.addIceCandidate(data.iceCandidateData)
//     );
//     socket.on("closedRemoteUser", () => handleNextUser());

//     return () => {
//       socket.disconnect(); // Cleanup the socket connection on unmount
//       socketRef.current = null;
//     };
//   }, [username]); // Runs only when the username is set

//   const createPeerConnection = async () => {
//     const connection = new RTCPeerConnection(servers);
//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     if (userVideoRef.current) {
//       userVideoRef.current.srcObject = localStream;
//     }

//     localStream.getTracks().forEach((track) => {
//       connection.addTrack(track, localStream);
//     });

//     connection.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     connection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socketRef.current.emit("candidateSentToUser", {
//           username,
//           remoteUser,
//           iceCandidateData: event.candidate,
//         });
//       }
//     };

//     setPeerConnection(connection);
//     return connection;
//   };

//   const fetchRemoteUser = () => {
//     $.post("/get-remote-users", { omeID: username }, (data) => {
//       if (data[0] && data[0]._id !== username) {
//         setRemoteUser(data[0]._id);
//         createOffer(data[0]._id);
//       }
//     });
//   };

//   const createOffer = async (remoteU) => {
//     const connection = await createPeerConnection();
//     const offer = await connection.createOffer();
//     await connection.setLocalDescription(offer);
//     socketRef.current.emit("offerSentToRemote", {
//       username,
//       remoteUser: remoteU,
//       offer: connection.localDescription,
//     });
//   };

//   const createAnswer = async (data) => {
//     const connection = await createPeerConnection();
//     await connection.setRemoteDescription(data.offer);
//     const answer = await connection.createAnswer();
//     await connection.setLocalDescription(answer);
//     socketRef.current.emit("answerSentToUser1", {
//       answer,
//       sender: data.remoteUser,
//       receiver: data.username,
//     });
//   };

//   const addAnswer = async (data) => {
//     if (peerConnection && !peerConnection.currentRemoteDescription) {
//       await peerConnection.setRemoteDescription(data.answer);
//     }
//   };

//   const handleNextUser = () => {
//     closeConnection();
//     fetchRemoteUser();
//   };

//   const closeConnection = () => {
//     if (peerConnection) {
//       peerConnection.close();
//       setPeerConnection(null);
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }
//     socketRef.current.emit("remoteUserClosed", { username, remoteUser });
//   };

//   const handleSendMessage = () => {
//     const message = msgInputRef.current.value;
//     chatTextAreaRef.current.innerHTML += `<div><b>Me: </b>${message}</div>`;
//     if (peerConnection && peerConnection.sendChannel) {
//       peerConnection.sendChannel.send(message);
//     }
//     msgInputRef.current.value = "";
//   };

//   return (
//     <div className="video_chat_main_container">
//       <header>
//         <nav>
//           <div className="container">
//             <img className="logo" src="/img/Logo.png" alt="Logo" />
//             <h2 className="headerText">Talk to stranger</h2>
//             <div className="online-status">5000+ online now</div>
//           </div>
//         </nav>
//       </header>
//       <main className="video_chat_container">
//         <div className="video-tag-container">
//           <div className="videos">
//             <video
//               ref={userVideoRef}
//               id="user-1"
//               autoPlay
//               playsInline
//               muted
//             ></video>
//             <video
//               ref={remoteVideoRef}
//               id="user-2"
//               autoPlay
//               playsInline
//             ></video>
//           </div>
//         </div>
//         <div className="chat-container">
//           <div className="chat-text-container">
//             <p>You are now chatting with a random stranger</p>
//             <p>You both speak the same language - English</p>
//             <hr className="horizontal-divider" />
//             <div ref={chatTextAreaRef} className="chat-text-area"></div>
//           </div>
//           <div className="next-chat-container">
//             <div className="next-chat" onClick={handleNextUser}>
//               Next
//             </div>
//             <div className="type-message">
//               <textarea ref={msgInputRef} cols="25" rows="5"></textarea>
//             </div>
//             <div className="msg-send-button" onClick={handleSendMessage}>
//               <i className="material-icons" style={{ fontSize: "36px" }}>
//                 send
//               </i>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default VideoChat;
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import $ from "jquery";

const VideoChat = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [sendChannel, setSendChannel] = useState(null);
  const [receiveChannel, setReceiveChannel] = useState(null);
  const [username, setUsername] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const msgInput = useRef(null);
  const chatTextArea = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    let omeID = localStorage.getItem("omeID");
    if (omeID) {
      $.ajax({
        url: `http://localhost:8000/new-user-update/${omeID}`,
        type: "PUT",
        success: (data) => {
          const newOmeID = data.omeID;
          if (newOmeID) {
            localStorage.setItem("omeID", newOmeID);
            setUsername(newOmeID);
          } else {
            setUsername(omeID);
          }
          runUser();
        },
        error: (err) => console.error("Failed to update user:", err),
      });
    } else {
      // $.ajax({
      //   type: "POST",
      //   url: "http://localhost:8000/api/users",
      //   data: "Demo Data",
      //   success: (response) => {
      //     localStorage.setItem("omeID", response);
      //     setUsername(response);
      //     runUser();
      //   },
      //   error: (error) => console.error("Error creating user:", error),
      // });
      $.ajax({
        url: "http://localhost:8000/api/users",
        type: "POST",
        data: JSON.stringify({ key: "value" }),
        contentType: "application/json",
        success: (response) => {
          localStorage.setItem("omeID", response.omeID);
          setUsername(response.omeID);
          runUser();
        },
        error: (error) => console.error("Error creating user:", error),
      });
    }

    // Event Listener for Delete Button
    const deleteButton = document.getElementById("deleteButton");
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        console.log("Delete button clicked!");
        // Handle delete logic if needed
      });
    }

    // Cleanup
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const runUser = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    $.post("http://localhost:8000/get-remote-users", { omeID: username })
      .done((data) => {
        if (data[0] && data[0]._id !== remoteUser && data[0]._id !== username) {
          setRemoteUser(data[0]._id);
          createOffer(data[0]._id);
        }
      })
      .fail((xhr) =>
        console.error("Failed to get remote users:", xhr.responseText)
      );

    socket.current = io("http://localhost:8000");
    socket.current.on("connect", () => {
      if (socket.current.connected) {
        socket.current.emit("userconnect", {
          displayName: username,
        });
      }
    });

    socket.current.on("ReceiveOffer", createAnswer);
    socket.current.on("ReceiveAnswer", addAnswer);
    socket.current.on("closedRemoteUser", handleRemoteUserClosure);
    socket.current.on("candidateReceiver", handleIceCandidate);
  };

  const createPeerConnection = async () => {
    const servers = {
      // iceServers: [
      //   {
      //     urls: [
      //       "stun:stun1.1.google.com:19302",
      //       "stun:stun2.1.google.com:19302",
      //     ],
      //   },
      // ],
      iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "d0f91f860e31a9ad9af9dc91",
          credential: "enB0j3i5Mn61ugaJ",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "d0f91f860e31a9ad9af9dc91",
          credential: "enB0j3i5Mn61ugaJ",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "d0f91f860e31a9ad9af9dc91",
          credential: "enB0j3i5Mn61ugaJ",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "d0f91f860e31a9ad9af9dc91",
          credential: "enB0j3i5Mn61ugaJ",
        },
      ],
    };

    const peer = new RTCPeerConnection(servers);
    setPeerConnection(peer);

    const remoteStream = new MediaStream();
    setRemoteStream(remoteStream);

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });

    peer.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("candidateSentToUser", {
          username,
          remoteUser,
          iceCandidateData: event.candidate,
        });
      }
    };

    const sendChannel = peer.createDataChannel("sendDataChannel");
    setSendChannel(sendChannel);

    sendChannel.onopen = () => console.log("Data channel is open");
    peer.ondatachannel = receiveChannelCallback;

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "closed") {
        handleConnectionClose();
      }
    };
  };

  const sendData = () => {
    const msgData = msgInput.current.value;
    chatTextArea.current.innerHTML += `<div><b>Me: </b>${msgData}</div>`;
    if (sendChannel) {
      sendChannel.send(msgData);
    }
    msgInput.current.value = "";
  };

  const receiveChannelCallback = (event) => {
    const receiveChannel = event.channel;
    setReceiveChannel(receiveChannel);

    receiveChannel.onmessage = onReceiveChannelMessageCallback;
  };

  const onReceiveChannelMessageCallback = (event) => {
    chatTextArea.current.innerHTML += `<div><b>Stranger: </b>${event.data}</div>`;
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
  // const createOffer = async (remoteU) => {
  //   if (!peerConnection) {
  //     await createPeerConnection();
  //   }
  //   try {
  //     const offer = await peerConnection.createOffer();
  //     await peerConnection.setLocalDescription(offer);
  //     socket.current.emit("offerSentToRemote", {
  //       username,
  //       remoteUser: remoteU,
  //       offer: peerConnection.localDescription,
  //     });
  //   } catch (error) {
  //     console.error("Error creating offer:", error);
  //   }
  // };

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
  };

  const addAnswer = async (data) => {
    if (!peerConnection.currentRemoteDescription) {
      await peerConnection.setRemoteDescription(data.answer);
    }
  };

  const handleRemoteUserClosure = () => {
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    setRemoteStream(null);
  };

  const handleConnectionClose = () => {
    socket.current.emit("remoteUserClosed", {
      username,
      remoteUser,
    });
  };

  const handleIceCandidate = (data) => {
    if (peerConnection) {
      peerConnection.addIceCandidate(data.iceCandidateData).catch((error) => {
        console.error("Error adding ICE candidate:", error);
      });
    } else {
      console.warn(
        "PeerConnection is not initialized when adding ICE candidate"
      );
    }
  };

  const handleNextChat = () => {
    handleConnectionClose();
    $.post(
      "http://localhost:8000/get-next-user",
      { omeID: username, remoteUser },
      (data) => {
        if (data[0] && data[0]._id !== remoteUser && data[0]._id !== username) {
          setRemoteUser(data[0]._id);
          createOffer(data[0]._id);
        }
      }
    );
  };

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
                id="user-1"
                className="video-player"
                ref={localVideoRef}
                autoPlay
                playsInline
              ></video>
              <video
                id="user-2"
                className="video-player"
                ref={remoteVideoRef}
                style={{ borderTop: "2px solid white" }}
                autoPlay
                playsInline
              ></video>
            </div>
          </div>
          <div className="chat-container">
            <div className="chat-text-container">
              <p>You are now chatting with a random stranger</p>
              <p>You both speak the same language - English</p>
              <hr className="horizontal-divider" />
              <div ref={chatTextArea} className="chat-text-area"></div>
            </div>
            <button id="deleteButton" style={{ cursor: "pointer" }}>
              Delete All Records [Remove the button in production version]
            </button>
            <div className="next-chat-container">
              <div className="next-chat" onClick={handleNextChat}>
                Next
              </div>
              <div className="type-message">
                <textarea
                  ref={msgInput}
                  id="msg-input"
                  cols="25"
                  rows="5"
                ></textarea>
              </div>
              <div className="msg-send-button" onClick={sendData}>
                <i className="material-icons" style={{ fontSize: "36px" }}>
                  send
                </i>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoChat;
