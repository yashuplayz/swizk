import React, { useState, useEffect } from 'react';

const Checklist = ({ token }) => {
  const [title, setTitle] = useState('');
  const [itemText, setItemText] = useState('');
  const [items, setItems] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [error, setError] = useState('');

  // Fetch checklists
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const res = await fetch('/api/checklist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch checklists');
        setChecklists(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChecklists();
  }, [token]);

  // Add checklist
  const handleAddChecklist = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, items, users: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add checklist');
      setChecklists([data, ...checklists]);
      setTitle('');
      setItems([]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add item to local checklist before submit
  const handleAddItem = (e) => {
    e.preventDefault();
    if (itemText.trim()) {
      setItems([...items, { text: itemText, checked: false }]);
      setItemText('');
    }
  };

  // Toggle checklist item
  const handleToggle = async (checklistId, idx) => {
    const checklist = checklists.find(c => c._id === checklistId);
    if (!checklist) return;
    const updatedItems = checklist.items.map((item, i) =>
      i === idx ? { ...item, checked: !item.checked } : item
    );
    try {
      const res = await fetch(`/api/checklist/${checklistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: updatedItems }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update checklist');
      setChecklists(checklists.map(c => c._id === checklistId ? data : c));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="checklist">
      <h2>Shared Checklists</h2>
      <form onSubmit={handleAddChecklist}>
        <input
          type="text"
          placeholder="Checklist Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <div>
          <input
            type="text"
            placeholder="Add item"
            value={itemText}
            onChange={e => setItemText(e.target.value)}
          />
          <button onClick={handleAddItem}>Add Item</button>
        </div>
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>{item.text}</li>
          ))}
        </ul>
        <button type="submit">Create Checklist</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {checklists.map(list => (
          <div key={list._id} style={{ margin: '1em 0', border: '1px solid #ccc', padding: '1em' }}>
            <h4>{list.title}</h4>
            <ul>
              {list.items.map((item, idx) => (
                <li key={idx}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggle(list._id, idx)}
                  />{' '}
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;
