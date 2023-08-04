import React, { createContext, useState, useContext } from 'react';

// Create the UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};

// Create the UserProvider to wrap your application with
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async (emailAddress, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${emailAddress}:${password}`)}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setUser(null);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
