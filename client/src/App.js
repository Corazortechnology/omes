// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import TextChat from "./TextChat";
import VideoChat from "./VideoChat";
// import logo from "./logo.svg";
// import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Navigation Links */}
          <nav>
            <Link to="/" className="App-link">
              Home
            </Link>{" "}
            |
            <Link to="/text_chat" className="App-link">
              Text Chat
            </Link>{" "}
            |
            <Link to="/video_chat" className="App-link">
              Video Chat
            </Link>
          </nav>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text_chat" element={<TextChat />} />
          <Route path="/video_chat" element={<VideoChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
