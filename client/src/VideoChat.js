// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";

// const VideoChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [userCount, setUserCount] = useState("5000+ online now");
//   const videoRef1 = useRef(null); // Local video
//   const videoRef2 = useRef(null); // Remote video (for later use with WebRTC)
//   const msgInputRef = useRef(null);
//   const socketRef = useRef(null);

//   useEffect(() => {
//     // Initialize Socket.io connection
//     const socket = io("http://localhost:8000"); // Replace with your server URL if different
//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log("Socket connected with ID:", socket.id);

//       // Emit userconnect event immediately upon connection
//       socket.emit("userconnect", { displayName: "User_" + socket.id });
//     });

//     socket.on("ReceiveMessage", (data) => {
//       console.log("Message received:", data);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "Stranger", text: data.message },
//       ]);
//     });

//     socket.on("onlineUsers", (count) => {
//       setUserCount(`${count} online now`);
//     });

//     // Request access to camera and microphone
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         // Set the local video stream to videoRef1
//         videoRef1.current.srcObject = stream;
//       })
//       .catch((error) => {
//         console.error("Error accessing media devices:", error);
//       });

//     // Clean up on component unmount
//     window.addEventListener("unload", handleUnload);
//     return () => {
//       window.removeEventListener("unload", handleUnload);
//       socket.disconnect();
//     };
//   }, []);

//   const handleUnload = () => {
//     // Emit disconnect event when unloading
//     socketRef.current.emit("remoteUserClosed", {
//       username: "user1", // Replace with actual username if needed
//     });
//   };

//   const sendMessage = () => {
//     const message = msgInputRef.current.value;
//     if (message) {
//       setMessages((prev) => [...prev, { sender: "Me", text: message }]);
//       msgInputRef.current.value = "";

//       // Emit the message to the server
//       socketRef.current.emit("sendMessage", { message });
//     }
//   };

//   const handleDeleteRecords = () => {
//     fetch("/deleteAllRecords", { method: "DELETE" })
//       .then((response) => response.text())
//       .then((message) => {
//         console.log("Records deleted:", message);
//       })
//       .catch((error) => console.error("Error deleting records:", error));
//   };

//   return (
//     <div>
//       <header style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//         <nav
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <img
//               src="/img/Logo.png"
//               alt=""
//               style={{ width: "50px", marginRight: "10px" }}
//             />
//             <h2 style={{ margin: 0 }}>Talk to stranger</h2>
//           </div>
//           <div style={{ color: "#87cefa" }}>{userCount}</div>
//         </nav>
//       </header>
//       <main
//         style={{ display: "flex", justifyContent: "center", padding: "20px" }}
//       >
//         <div style={{ display: "flex", gap: "10px", maxWidth: "80%" }}>
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <div
//               style={{ display: "flex", flexDirection: "column", gap: "10px" }}
//             >
//               {/* Local video (user's own camera) */}
//               <video
//                 style={{
//                   width: "100%",
//                   height: "auto",
//                   backgroundColor: "#444",
//                 }}
//                 id="user-1"
//                 autoPlay
//                 playsInline
//                 ref={videoRef1}
//               ></video>
//               {/* Placeholder for remote video */}
//               <video
//                 style={{
//                   width: "100%",
//                   height: "auto",
//                   backgroundColor: "#444",
//                   borderTop: "2px solid white",
//                 }}
//                 id="user-2"
//                 autoPlay
//                 playsInline
//                 ref={videoRef2}
//               ></video>
//             </div>
//           </div>
//           <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//             <div
//               style={{
//                 flex: 1,
//                 padding: "10px",
//                 border: "1px solid #ddd",
//                 borderRadius: "4px",
//                 backgroundColor: "#f9f9f9",
//               }}
//             >
//               <p>You are now chatting with a random stranger</p>
//               <p>You both speak the same language - English</p>
//               <hr style={{ border: "0.5px solid #ddd" }} />
//               <div
//                 style={{
//                   maxHeight: "200px",
//                   overflowY: "auto",
//                   padding: "5px",
//                 }}
//               >
//                 {messages.map((msg, index) => (
//                   <p key={index} style={{ margin: "4px 0" }}>
//                     <b>{msg.sender}:</b> {msg.text}
//                   </p>
//                 ))}
//               </div>
//             </div>
//             <button
//               style={{
//                 cursor: "pointer",
//                 marginTop: "10px",
//                 padding: "8px",
//                 backgroundColor: "#f0f0f0",
//                 border: "1px solid #ddd",
//                 borderRadius: "4px",
//               }}
//               onClick={handleDeleteRecords}
//             >
//               Delete All Records [Remove this button in production]
//             </button>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginTop: "10px",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "10px",
//                   border: "1px solid #000",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                   backgroundColor: "#f0f0f0",
//                   textAlign: "center",
//                   flex: 1,
//                   marginRight: "10px",
//                 }}
//                 onClick={() => console.log("Next chat clicked")}
//               >
//                 Next
//               </div>
//               <div style={{ flex: 3 }}>
//                 <textarea
//                   id="msg-input"
//                   cols="25"
//                   rows="5"
//                   ref={msgInputRef}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     resize: "none",
//                     padding: "5px",
//                     border: "1px solid #ddd",
//                     borderRadius: "4px",
//                   }}
//                 ></textarea>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                   padding: "0 10px",
//                   fontSize: "24px",
//                 }}
//                 onClick={sendMessage}
//               >
//                 <i className="material-icons" style={{ fontSize: "36px" }}>
//                   send
//                 </i>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default VideoChat;
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const VideoChat = () => {
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState("5000+ online now");
  const videoRef1 = useRef(null); // Local video
  const videoRef2 = useRef(null); // Remote video
  const msgInputRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [remoteUser, setRemoteUser] = useState(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io("http://localhost:8000"); // Replace with your server URL if different
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
      socket.emit("userconnect", { displayName: "User_" + socket.id });
    });

    socket.on("onlineUsers", (count) => {
      setUserCount(`${count} online now`);
    });

    socket.on("ReceiveOffer", handleReceiveOffer);
    socket.on("ReceiveAnswer", handleReceiveAnswer);
    socket.on("candidateReceiver", handleNewICECandidateMsg);

    // Request access to camera and microphone
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Set the local video stream to videoRef1
        videoRef1.current.srcObject = stream;
        initializePeerConnection(stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const initializePeerConnection = (stream) => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = peerConnection;

    // Add local tracks to the peer connection
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (videoRef2.current) {
        videoRef2.current.srcObject = event.streams[0];
      }
    };

    // Send ICE candidates to the other peer
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("candidateSentToUser", {
          iceCandidateData: event.candidate,
          remoteUser,
        });
      }
    };

    // If there is no remote user, initiate the offer
    if (!remoteUser) {
      createOffer();
    }
  };

  const createOffer = async () => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    // Send offer to the remote user
    socketRef.current.emit("offerSentToRemote", {
      offer,
      username: socketRef.current.id,
      remoteUser,
    });
  };

  const handleReceiveOffer = async (data) => {
    setRemoteUser(data.username);

    if (!peerConnectionRef.current) {
      // If there's no peer connection, initialize it
      const stream = videoRef1.current.srcObject;
      initializePeerConnection(stream);
    }

    await peerConnectionRef.current.setRemoteDescription(data.offer);
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socketRef.current.emit("answerSentToUser1", {
      answer,
      receiver: data.username,
      sender: socketRef.current.id,
    });
  };

  const handleReceiveAnswer = async (data) => {
    await peerConnectionRef.current.setRemoteDescription(data.answer);
  };

  const handleNewICECandidateMsg = async (data) => {
    try {
      await peerConnectionRef.current.addIceCandidate(data.iceCandidateData);
    } catch (error) {
      console.error("Error adding received ICE candidate", error);
    }
  };

  return (
    <div>
      <header style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/img/Logo.png"
              alt=""
              style={{ width: "50px", marginRight: "10px" }}
            />
            <h2 style={{ margin: 0 }}>Talk to stranger</h2>
          </div>
          <div style={{ color: "#87cefa" }}>{userCount}</div>
        </nav>
      </header>
      <main
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <div style={{ display: "flex", gap: "10px", maxWidth: "80%" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <video
                style={{
                  width: "100%",
                  height: "auto",
                  backgroundColor: "#444",
                }}
                id="user-1"
                autoPlay
                playsInline
                ref={videoRef1}
              ></video>
              <video
                style={{
                  width: "100%",
                  height: "auto",
                  backgroundColor: "#444",
                  borderTop: "2px solid white",
                }}
                id="user-2"
                autoPlay
                playsInline
                ref={videoRef2}
              ></video>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoChat;
