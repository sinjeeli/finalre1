import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};

// Create the UserProvider to wrap your application with
export const UserProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(null);

  //
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedCredentials = localStorage.getItem('credentials');
    if (storedUser && storedCredentials) {
      setUser(JSON.parse(storedUser));
      setCredentials(atob(storedCredentials));
    }
  }, []);

  //

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
        console.log("User set in context:", user);  // <-- Correct placement here
        setCredentials({ emailAddress, password });
        // Store user and credentials in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('credentials', btoa(`${emailAddress}:${password}`));
        return true;
      } else {
        setCredentials(null);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setCredentials(null);
      setUser(null);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    setCredentials(null);

  // Clear user and credentials from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('credentials');
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, credentials }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
