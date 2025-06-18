import React, { useState } from 'react';

import './LoveNavbar.css';

const AuthForm = ({ onAuth }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister ? { email, password, displayName } : { email, password };
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');
      onAuth(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form" style={{
      maxWidth: 400,
      margin: '4rem auto',
      background: 'linear-gradient(135deg, #fff0f6 0%, #ffe4ec 100%)',
      borderRadius: 24,
      boxShadow: '0 4px 32px rgba(255, 105, 180, 0.08)',
      padding: '2.5rem 2rem',
      textAlign: 'center',
      border: '2px solid #ffb6c1',
    }}>
      <div className="love-logo" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ff69b4', textShadow: '1px 1px 8px #ffb6c1' }}>💖 Swizk</div>
      <h2 style={{ color: '#ff69b4', fontFamily: 'Segoe Script, cursive, sans-serif', marginBottom: '1.5rem' }}>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%' }}
        />
        <button type="submit" style={{ width: '100%', marginTop: '1rem', fontSize: '1.1rem' }}>{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button
        onClick={() => setIsRegister(r => !r)}
        style={{
          background: 'none',
          color: '#ff69b4',
          border: 'none',
          marginTop: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        {isRegister ? 'Already have an account? Login' : 'No account? Register'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default AuthForm;
