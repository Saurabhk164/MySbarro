import React from 'react';
import { useUser } from '../contexts/UserContext';

const UserSwitcher: React.FC = () => {
  const { currentUser, setCurrentUser } = useUser();

  return (
    <div className="user-switcher">
      <label htmlFor="user-select" className="user-select-label">Current User:</label>
      <select 
        id="user-select"
        value={currentUser}
        onChange={(e) => setCurrentUser(e.target.value as 'Saurabh' | 'Nirupa')}
        className="user-select"
      >
        <option value="Saurabh">Saurabh</option>
        <option value="Nirupa">Nirupa</option>
      </select>
    </div>
  );
};

export default UserSwitcher; 