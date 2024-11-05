import { Routes, Route } from "react-router-dom";
import VideoChat from "./VideoChat";
import HomePage from "./HomePage";
import TextChat from "./TextChat";

function App() {
  return (
    <Routes>
      <Route path="/video_chat" element={<VideoChat />} />
      <Route path="/text_chat" element={<TextChat />} />
      <Route path="/" element={<HomePage />} />

      {/* Other routes */}
    </Routes>
  );
}

export default App;
