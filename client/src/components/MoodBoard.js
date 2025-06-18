import React, { useState, useEffect } from 'react';

const MoodBoard = ({ token }) => {
  const [mood, setMood] = useState('');
  const [moods, setMoods] = useState([]);
  const [error, setError] = useState('');

  // Fetch moods
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await fetch('/api/mood', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch moods');
        setMoods(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMoods();
  }, [token]);

  // Post mood
  const handlePost = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post mood');
      setMoods([data, ...moods]);
      setMood('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mood-board">
      <h2>Mood Board</h2>
      <form onSubmit={handlePost}>
        <input
          type="text"
          placeholder="How are you feeling? (text or emoji)"
          value={mood}
          onChange={e => setMood(e.target.value)}
          required
        />
        <button type="submit">Post Mood</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {moods.map(m => (
          <li key={m._id}>
            <strong>{m.user?.displayName || m.user?.email || 'User'}:</strong> {m.mood}
            <br />
            <small>{new Date(m.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodBoard;
