import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0F172A] flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/v_id=:videoId" element={<VideoPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;