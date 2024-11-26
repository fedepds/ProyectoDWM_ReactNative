import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useToken } from "@/context/TokenContext";
import { useRouter } from "expo-router";
import { postSingin } from "@/services/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { saveToken, saveUserData } = useToken();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const data = await postSingin(username, email, password);
      saveUserData(data);
      saveToken(data.token);
      router.push("/(tabs)");
      Alert.alert("Registro exitoso", "Usuario creado correctamente");
    } catch (error) {
      setErrorMessage("Error al crear el usuario, Intente nuevamente");
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Fakestagram</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.inputField}
            placeholder="Username"
            placeholderTextColor="#000"
            value={username}
            onChangeText={(text) => setUsername(text)}
            required
          />
          <TextInput
            style={styles.inputField}
            placeholder="Email"
            placeholderTextColor="#000"
            value={email}
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            required
          />
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            placeholderTextColor="#000"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
            required
          />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSubmit}
          >
            <Text style={styles.registerButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.loginText}>
          ¿Ya tienes una cuenta?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => router.back()}
          >
            Ingresa aquí
          </Text>
        </Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    width: "90%",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    background: "linear-gradient(to right, #ba73ff, #94d8d3)",
    color: "#ba73ff",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  inputField: {
    width: "100%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    fontSize: 14,
  },
  registerButton: {
    padding: 12,
    backgroundColor: "#b678dd",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  error: {
    color: "red",
    marginTop: 10,
  },
});
