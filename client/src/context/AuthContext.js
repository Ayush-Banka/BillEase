import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Create the AuthContext with default values.
export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loginUser: () => {},
  logoutUser: () => {},
});

export const AuthProvider = ({ children }) => {
  // Auth state contains both user and token
  const [auth, setAuth] = useState({ user: null, token: null });

  // Load auth state from localStorage when the provider mounts.
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  // Memoized function to log in a user.
  // It accepts both userData and token and saves them in localStorage.
  const loginUser = useCallback((userData, token) => {
    const newAuth = { user: userData, token };
    localStorage.setItem("auth", JSON.stringify(newAuth));
    setAuth(newAuth);
  }, []);

  // Memoized function to log out the user.
  const logoutUser = useCallback(() => {
    localStorage.removeItem("auth");
    setAuth({ user: null, token: null });
  }, []);

  // Memoize the context value to optimize performance.
  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: !!auth.token,
      loginUser,
      logoutUser,
    }),
    [auth, loginUser, logoutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
