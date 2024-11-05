import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';

const VideoChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef();
  const userVideoRef = useRef();
  const peerVideoRef = useRef();
  const peerConnectionRef = useRef();
  const chatTextAreaRef = useRef();

  // WebRTC configuration
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302'
        ],
      },
    ],
  };

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io('http://localhost:3000');

    // Get user's video stream
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    .then(stream => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }

      // Initialize peer connection
      peerConnectionRef.current = new RTCPeerConnection(servers);

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Handle incoming tracks
      peerConnectionRef.current.ontrack = (event) => {
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('candidate', event.candidate);
        }
      };
    });

    // Socket event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('offer', async (offer) => {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', answer);
    });

    socketRef.current.on('answer', async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(answer);
    });

    socketRef.current.on('candidate', async (candidate) => {
      await peerConnectionRef.current.addIceCandidate(candidate);
    });

    return () => {
      // Cleanup
      if (userVideoRef.current?.srcObject) {
        userVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      peerConnectionRef.current?.close();
      socketRef.current.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      socketRef.current.emit('message', inputMessage);
      setInputMessage('');
    }
  };

  const handleNext = async () => {
    // Reset the current connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setMessages([]);
    
    // Create new offer for next peer
    peerConnectionRef.current = new RTCPeerConnection(servers);
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socketRef.current.emit('findNewChat', offer);
  };

  const handleDeleteRecords = () => {
    setMessages([]);
    socketRef.current.emit('deleteRecords');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <img 
              className="h-12 w-auto"
              src="/img/Logo.png" 
              alt="Omegle Logo" 
            />
            <h2 className="text-xl font-semibold">Talk to stranger</h2>
            <div className="text-green-600">5000+ online now</div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4 h-[calc(100vh-5rem)]">
          {/* Video Container */}
          <div className="w-full lg:w-2/3 bg-black rounded-lg overflow-hidden">
            <div className="grid grid-rows-2 h-full">
              <video 
                ref={userVideoRef}
                className="w-full h-full object-cover"
                autoPlay 
                playsInline 
                muted
              />
              <video 
                ref={peerVideoRef}
                className="w-full h-full object-cover border-t-2 border-white"
                autoPlay 
                playsInline
              />
            </div>
          </div>

          {/* Chat Container */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <div className="flex-grow overflow-auto mb-4">
              <div className="mb-4">
                <p className="text-gray-700">You are now chatting with a random stranger</p>
                <p className="text-gray-700">You both speak the same language - English</p>
                <hr className="my-2 border-gray-300" />
              </div>
              
              <div ref={chatTextAreaRef} className="space-y-2">
                {messages.map((msg, index) => (
                  <p key={index} className="text-gray-800">{msg}</p>
                ))}
              </div>
            </div>

            {/* Development only button */}
            <button 
              onClick={handleDeleteRecords}
              className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Delete All Records [Remove in production]
            </button>

            <div className="mt-auto">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleNext}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
                
                <div className="flex gap-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-grow p-2 border rounded-lg resize-none"
                    rows="4"
                    placeholder="Type your message..."
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <Send size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoChat;