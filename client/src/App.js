
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Diary from './components/Diary';
import LoveNudge from './components/LoveNudge';
import MoodBoard from './components/MoodBoard';
import Checklist from './components/Checklist';
import Goals from './components/Goals';
import Chat from './components/Chat';
import LoveNavbar from './components/LoveNavbar';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <AuthForm onAuth={setUser} />;
  }

  return (
    <Router>
      <LoveNavbar />
      <div className="App" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #ffe4ec 100%)', minHeight: '100vh', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/diary" />} />
          <Route path="/diary" element={<Diary token={user.token} />} />
          <Route path="/love-nudge" element={<LoveNudge token={user.token} />} />
          <Route path="/mood-board" element={<MoodBoard token={user.token} />} />
          <Route path="/checklists" element={<Checklist token={user.token} />} />
          <Route path="/goals" element={<Goals token={user.token} />} />
          <Route path="/chat" element={<Chat token={user.token} userId={user.user.id} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
