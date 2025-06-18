import React, { useState, useEffect } from 'react';

const Chat = ({ token, userId }) => {
  const [partnerId, setPartnerId] = useState('');
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Fetch messages
  useEffect(() => {
    if (!partnerId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${partnerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch messages');
        setMessages(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMessages();
  }, [token, partnerId]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver: partnerId, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setMessages([...messages, data]);
      setContent('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="chat">
      <h2>Private Chat</h2>
      <input
        type="text"
        placeholder="Partner's User ID"
        value={partnerId}
        onChange={e => setPartnerId(e.target.value)}
        required
      />
      <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', margin: '1em 0', padding: '1em' }}>
        {messages.map(msg => (
          <div key={msg._id} style={{ textAlign: msg.sender === userId ? 'right' : 'left' }}>
            <span style={{ fontWeight: msg.sender === userId ? 'bold' : 'normal' }}>
              {msg.sender === userId ? 'You' : 'Partner'}:
            </span> {msg.content}
            <br />
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Chat;
