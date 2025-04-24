import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = 'Saurabh' | 'Nirupa';

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>('Saurabh');

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 