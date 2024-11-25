import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useToken } from "@/context/TokenContext";
import { router } from "expo-router";
import { useRouter } from "expo-router";
import { postLogin } from "@/services/api";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { saveToken, saveUserData } = useToken();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const data = await postLogin(email, password);
      console.log(data);
      saveToken(data.token);
      saveUserData(data);
      router.push("/(tabs)");
    } catch (error) {
      setErrorMessage("Credenciales Incorrectas, Intente nuevamente");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fakestagram</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#000"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#000"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>
          <Text
            style={styles.loginLink}
            onPress={() => router.push(`/unAuth/register`)}
          >
            Crear cuenta
          </Text>
        </Text>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    background: "linear-gradient(to right, #ba73ff, #94d8d3)",
    color: "#ba73ff",
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
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  loginText: {
    marginTop: 15,
    fontSize: 14,
  },
  loginLink: {
    color: "#000",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Login;