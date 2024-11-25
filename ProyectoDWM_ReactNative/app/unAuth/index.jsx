import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useToken } from "@/context/TokenContext";
import { router } from "expo-router";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { saveToken, saveUserData } = useToken();

  const postLogin = async () => {
    const request = await fetch("http://10.166.0.136:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!request.ok) {
      throw new Error("Credenciales Incorrectas");
    }

    const data = await request.json();
    saveToken(data.token);
    saveUserData(data);
    router.push("/(tabs)");
  };

//   const handleSubmit = async () => {
//     try {
//       const data = await postLogin(email, password);
//       saveToken(data.token);
//       saveUserData(data.userData);
//     //   navigation.navigate("Feed");
//     } catch (error) {
//       setErrorMessage("Credenciales Incorrectas, Intente nuevamente");
//     }
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fakestagram</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={postLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f1f1f1",
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#b678dd",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default Login;