import React, { createContext, useState } from "react";

// Create context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <AuthContext.Provider
      value={{ user, setUser, walletAddress, setWalletAddress }}
    >
      {children}
    </AuthContext.Provider>
  );
};
