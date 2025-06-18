import React, { useState, useEffect } from 'react';

const LoveNudge = ({ token }) => {
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('Thinking of you!');
  const [nudges, setNudges] = useState([]);
  const [error, setError] = useState('');

  // Fetch nudges
  useEffect(() => {
    const fetchNudges = async () => {
      try {
        const res = await fetch('/api/love-nudge', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch nudges');
        setNudges(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchNudges();
  }, [token]);

  // Send nudge
  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/love-nudge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send nudge');
      setNudges([data, ...nudges]);
      setMessage('Thinking of you!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="love-nudge">
      <h2>Love Nudge</h2>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Partner's User ID"
          value={receiver}
          onChange={e => setReceiver(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">Send Nudge</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {nudges.map(nudge => (
          <li key={nudge._id}>
            <strong>From:</strong> {nudge.sender} <strong>Message:</strong> {nudge.message}
            <br />
            <small>{new Date(nudge.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoveNudge;
