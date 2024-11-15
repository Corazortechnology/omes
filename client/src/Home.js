// src/pages/Home.js

import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
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
      <main style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ marginBottom: "20px", color: "#333" }}>
            You don't need an app to use Omegle on your phone or tablet! The
            website works great on mobile.
          </p>
          <p style={{ marginBottom: "20px", color: "#333" }}>
            Omegle (oh·meg·ull) is a great way to meet new friends, even while
            practicing social distancing. When you use Omegle, you are paired
            randomly with another person to talk one-on-one. If you prefer, you
            can add your interests and you’ll be randomly paired with someone
            who selected some of the same interests.
          </p>
          <p style={{ marginBottom: "20px", color: "#333" }}>
            To help you stay safe, chats are anonymous unless you tell someone
            who you are (not recommended!), and you can stop a chat at any time.
            See our Terms of Service and Community Guidelines for more info
            about the do’s and don’ts in using Omegle. Omegle video chat is
            moderated but no moderation is perfect. Users are solely responsible
            for their behavior while using Omegle.
          </p>
          <p style={{ marginBottom: "20px", color: "#333" }}>
            YOU MUST BE 18 OR OLDER TO USE OMEGLE. See Omegle’s Terms of Service
            for more info. Parental control protections that may assist parents
            are commercially available and you can find more info at
            https://www.connectsafely.org/controls/ as well as other sites.
          </p>
          <p style={{ color: "#d9534f", fontWeight: "bold" }}>
            Please leave Omegle and visit an adult site instead if that's what
            you're looking for, and you are 18 or older.
          </p>

          <h2 style={{ color: "#d9534f", marginTop: "20px" }}>
            Video is monitored. Keep it clean
          </h2>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#555" }}>
              Start Chatting
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                <Link
                  to="/text_chat"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Text Chat
                </Link>
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                <Link
                  to="/video_chat"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Video Chat
                </Link>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
