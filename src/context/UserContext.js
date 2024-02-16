import React, { createContext, useState, useContext, useEffect } from 'react'; 

const UserContext = createContext();

export function UserProvider({children}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser.user);
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{user, updateUser}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext);