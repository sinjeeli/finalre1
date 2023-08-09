import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the UserContext
const UserContext = createContext();

const LoadingSpinner = () => <div>Loading...</div>;

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Initialize credentials with default values
  const [credentials, setCredentials] = useState({ emailAddress: '', password: '' });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedCredentials = localStorage.getItem('credentials');
    if (storedUser && storedCredentials) {
      setUser(JSON.parse(storedUser));
      
      // Decode and split credentials from local storage
      const [emailAddress, password] = atob(storedCredentials).split(':');
      setCredentials({ emailAddress, password });
    }
    setIsLoading(false);
  }, []);

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
        setCredentials({ emailAddress, password });
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('credentials', btoa(`${emailAddress}:${password}`));
        return true;
      } else {
        setCredentials({ emailAddress: '', password: '' });
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setCredentials({ emailAddress: '', password: '' });
      setUser(null);
      return false;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const signOut = () => {
    setUser(null);
    setCredentials({ emailAddress: '', password: '' });
    localStorage.removeItem('user');
    localStorage.removeItem('credentials');
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, credentials, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
