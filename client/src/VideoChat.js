import React, { useEffect } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import Header from "./Components/Header";
import Chat from "./Components/Chat";

const SOCKET_SERVER_URL = "http://localhost:8000"; // Replace with your backend server's URL

function VideoChat() {
  useEffect(() => {
    // Initialize Socket.IO client
    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to the Socket.IO server with ID:", socket.id);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoElement = document.getElementById("user-1");
        if (videoElement) {
          videoElement.srcObject = stream;
        } else {
          console.error("Video element with id 'user-1' not found.");
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="video_chat_main_container">
        <div className="video_chat_container">
          <div className="video-tag-container">
            <div className="videos">
              <video
                className="video-player"
                id="user-1"
                autoPlay
                playsInline
              ></video>
              <video
                className="video-player"
                id="user-2"
                style={{ borderTop: "2px solid white" }}
                autoPlay
                playsInline
              ></video>
            </div>
          </div>
          <Chat />
        </div>
      </main>
    </div>
  );
}

export default VideoChat;
