import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadTokenAndUserData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUserData = await AsyncStorage.getItem("userData");

      setToken(storedToken);
      setUserData(storedUserData ? JSON.parse(storedUserData) : null);
    };

    loadTokenAndUserData();
  }, []);

  const saveToken = async (newToken) => {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const saveUserData = async (newUserData) => {
    await AsyncStorage.setItem("userData", JSON.stringify(newUserData));
    setUserData(newUserData);
  };

  return (
    <TokenContext.Provider value={{ token, saveToken, userData, saveUserData }}>
      {children}
    </TokenContext.Provider>
  );
};