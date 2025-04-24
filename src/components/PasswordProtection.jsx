import React, { useState, useEffect } from 'react';

const PasswordProtection = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Check if already authenticated from localStorage on component mount
  useEffect(() => {
    const authenticated = localStorage.getItem('sbarroSpaceAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Replace 'your-secret-password' with your desired password
    const correctPassword = 'love2025';
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
      // Store authentication state in localStorage to persist across refreshes
      localStorage.setItem('sbarroSpaceAuthenticated', 'true');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sbarroSpaceAuthenticated');
  };

  if (!isAuthenticated) {
    return (
      <div className="password-screen">
        <div className="password-container">
          <h1>SbarroSpace</h1>
          <p>Enter the password to access our space</p>
          
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
              />
            </div>
            
            {error && <div className="password-error">{error}</div>}
            
            <button type="submit" className="password-button">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {children}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default PasswordProtection; 