// src/pages/TextChat.js
import React, { useEffect } from "react";
import io from "socket.io-client";

const TextChat = () => {
  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io(); // Connects to the backend server

    // Set up Socket.io event handlers (adjust as necessary based on server events)
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Example of a delete button click handler
    window.$("#deleteButton").click(() => {
      alert("Delete All Records functionality [Remove in production version]");
    });

    return () => {
      socket.disconnect(); // Clean up on component unmount
    };
  }, []);

  return (
    <div>
      <header>
        <nav style={{ backgroundColor: "#f5f5f5", padding: "10px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <img
              style={{ width: "50px", height: "50px" }}
              src="/img/Logo.png"
              alt="Logo"
            />
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
              Talk to stranger
            </h2>
            <div style={{ fontSize: "16px", color: "#777" }}>
              5000+ online now
            </div>
          </div>
        </nav>
      </header>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "lightblue",
          height: "calc(100vh - 80px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <div style={{ display: "none" }}>
            <div className="videos">
              <video
                className="video-player"
                id="user-1"
                autoPlay
                playsInline
                style={{ width: "100%" }}
              ></video>
              <video
                className="video-player"
                id="user-2"
                autoPlay
                playsInline
                style={{ width: "100%", borderTop: "2px solid white" }}
              ></video>
            </div>
          </div>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <p>You are now chatting with a random stranger</p>
            <p>You both speak the same language - English</p>
            <hr style={{ margin: "10px 0" }} />
            <p className="chat-text-area"></p>
          </div>

          <button
            style={{
              cursor: "pointer",
              backgroundColor: "#e74c3c",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              margin: "10px 0",
            }}
            id="deleteButton"
          >
            Delete All Records [Remove in production version]
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                flex: "1",
                textAlign: "center",
              }}
            >
              Next
            </div>
            <textarea
              id="msg-input"
              cols="25"
              rows="5"
              style={{
                flex: "3",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            ></textarea>
            <div
              style={{
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              Send
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextChat;
