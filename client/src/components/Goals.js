import React, { useState, useEffect } from 'react';

const Goals = ({ token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');

  // Fetch goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch('/api/goal', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch goals');
        setGoals(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchGoals();
  }, [token]);

  // Add goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, dueDate, users: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add goal');
      setGoals([data, ...goals]);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Mark goal as completed
  const handleComplete = async (goalId) => {
    try {
      const res = await fetch(`/api/goal/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update goal');
      setGoals(goals.map(g => g._id === goalId ? data : g));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="goals">
      <h2>Goals & Reminders</h2>
      <form onSubmit={handleAddGoal}>
        <input
          type="text"
          placeholder="Goal Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <button type="submit">Add Goal</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {goals.map(goal => (
          <li key={goal._id} style={{ margin: '1em 0' }}>
            <strong>{goal.title}</strong> {goal.completed && <span style={{color:'green'}}>(Completed)</span>}
            <br />{goal.description}
            <br />Due: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'No date'}
            <br />
            {!goal.completed && (
              <button onClick={() => handleComplete(goal._id)}>Mark as Completed</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Goals;
