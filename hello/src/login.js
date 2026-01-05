import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [loremText, setLoremText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [lastLoginAt, setLastLoginAt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      let res;
      if (isRegister) {
        res = await axios.post('http://localhost:8080/api/auth/register', { username, password });
      } else {
        res = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      }
      if (res.data?.success) {
        setLoggedInUser(res.data.username);
        if (res.data.createdAt) setCreatedAt(res.data.createdAt);
        if (res.data.lastLoginAt) setLastLoginAt(res.data.lastLoginAt);
        setUsername('');
        setPassword('');
        setIsRegister(false);
      } else {
        setError(res.data?.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setError('');
    setSuccessMsg('');
    setLoremText('');
    setCreatedAt('');
    setLastLoginAt('');
  };

  const submitLorem = async () => {
    if (!loremText.trim()) return;
    setError('');
    setSuccessMsg('');
    try {
      const res = await axios.post('http://localhost:8080/api/posts', {
        username: loggedInUser,
        content: loremText,
      });
      if (res.data?.success) {
        setSuccessMsg('Your passage was saved.');
        setLoremText('');
      } else {
        setError(res.data?.message || 'Failed to save');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  if (loggedInUser) {
    return (
      <div style={{ maxWidth: 560, margin: '40px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Welcome, {loggedInUser}</h2>
          <button onClick={handleLogout} style={{ padding: '8px 16px' }}>Logout</button>
        </div>
        <div style={{ margin: '8px 0', fontSize: 14, color: '#555' }}>
          {createdAt && <div>Account created: {new Date(createdAt).toLocaleString()}</div>}
          {lastLoginAt && <div>Last login: {new Date(lastLoginAt).toLocaleString()}</div>}
        </div>
        <p>Write your lorem passage below:</p>
        <textarea
          rows={8}
          value={loremText}
          onChange={(e) => setLoremText(e.target.value)}
          placeholder="Type lorem ipsum..."
          style={{ width: '100%', padding: 8, fontFamily: 'inherit' }}
        />
        <div style={{ marginTop: 12 }}>
          <button onClick={submitLorem} style={{ padding: '8px 16px' }}>Save Passage</button>
        </div>
        {successMsg && <div style={{ color: 'green', marginTop: 12 }}>{successMsg}</div>}
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>{isRegister ? 'Create Account' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username">Username</label><br />
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label><br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? (isRegister ? 'Creating…' : 'Logging in…') : (isRegister ? 'Create Account' : 'Login')}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: '#007bff', cursor: 'pointer' }}
        >
          {isRegister ? 'Have an account? Login' : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
}

export default Login;
