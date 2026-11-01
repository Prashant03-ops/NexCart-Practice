import React, {
  createContext,
  useEffect,
  useMemo,
  useState
} from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('userInfo') || 'null'
      );
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        'userInfo',
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  const value = useMemo(() => ({
    user,

    login: (userData) => setUser(userData),

    logout: () => setUser(null)

  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
