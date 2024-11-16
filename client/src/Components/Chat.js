import React from "react";

function Chat() {
  return (
    <div className="chat-container">
      <div className="chat-text-container">
        <p>You are now chatting with a random stranger</p>
        <p>You both speak the same language - English</p>
        <hr className="horizontal-divider" />
        <p className="chat-text-area"></p>
      </div>

      {/* This button is only for development purposes */}
      <button style={{ cursor: "pointer" }} id="deleteButton">
        Delete All Records [Remove this button in production version]
      </button>

      <div className="next-chat-container">
        <div className="next-chat">
          <div>Next</div>
        </div>
        <div className="type-message">
          <textarea id="msg-input" cols="25" rows="5"></textarea>
        </div>

        <div className="msg-send-button">
          <i className="material-icons" style={{ fontSize: "36px" }}>
            send
          </i>
        </div>
      </div>
    </div>
  );
}

export default Chat;
