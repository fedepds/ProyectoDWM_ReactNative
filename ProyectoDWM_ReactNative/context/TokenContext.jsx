import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const loadTokenAndUserData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedUsername = await AsyncStorage.getItem("username");

      setToken(storedToken);
      setUserId(storedUserId);
      setUsername(storedUsername);
    };

    loadTokenAndUserData();
  }, []);

  const saveToken = async (newToken) => {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const saveUserData = async (newUserId, newUsername) => {
    await AsyncStorage.setItem("userId", newUserId);
    await AsyncStorage.setItem("username", newUsername);
    setUserId(newUserId);
    setUsername(newUsername);
  };

  return (
    <TokenContext.Provider value={{ token, userId, username, saveToken, saveUserData }}>
      {children}
    </TokenContext.Provider>
  );
};
