import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LoveNavbar.css';

const LoveNavbar = () => {
  const location = useLocation();
  return (
    <nav className="love-navbar">
      <div className="love-logo">💖 Swizk</div>
      <ul>
        <li className={location.pathname === "/diary" ? "active" : ""}><Link to="/diary">Diary</Link></li>
        <li className={location.pathname === "/love-nudge" ? "active" : ""}><Link to="/love-nudge">Love Nudge</Link></li>
        <li className={location.pathname === "/mood-board" ? "active" : ""}><Link to="/mood-board">Mood Board</Link></li>
        <li className={location.pathname === "/checklists" ? "active" : ""}><Link to="/checklists">Checklists</Link></li>
        <li className={location.pathname === "/goals" ? "active" : ""}><Link to="/goals">Goals</Link></li>
        <li className={location.pathname === "/chat" ? "active" : ""}><Link to="/chat">Chat</Link></li>
      </ul>
    </nav>
  );
};

export default LoveNavbar;
