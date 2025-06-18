import React, { useState, useEffect } from 'react';

const Diary = ({ token }) => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [partner, setPartner] = useState('');
  const [error, setError] = useState('');

  // Fetch diary entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/diary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch entries');
        setEntries(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEntries();
  }, [token]);

  // Add new diary entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partner, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add entry');
      setEntries([data, ...entries]);
      setContent('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="diary">
      <h2>Shared Diary</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Partner's User ID"
          value={partner}
          onChange={e => setPartner(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your thoughts..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Entry</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {entries.map(entry => (
          <li key={entry._id}>
            <strong>{entry.author === entry.partner ? 'You' : 'Partner'}:</strong> {entry.content}
            <br />
            <small>{new Date(entry.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Diary;
