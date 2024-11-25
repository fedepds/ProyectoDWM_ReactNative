import React, { useState, useEffect } from "react";
import SearchCard from "@/components/SearchCard";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToken } from "@/context/TokenContext";
import { useRouter } from "expo-router";
import { getAllUsers } from "@/services/api";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { saveToken, saveUserData } = useToken();
  const router = useRouter();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const profiles = await getAllUsers();
        setUsers(profiles);
      } catch (error) {
        console.error("Error fetching all profiles:", error);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleClick = (userId) => {
    //implementar ruta para ver perfil
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search profiles"
        placeholderTextColor={"#000"}
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleClick(item._id)}>
            <SearchCard user={item} />
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={styles.noResults}>No profiles found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 40,
    marginBottom: 20,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  row: {
    justifyContent: "space-between",
  },
});

export default Search;
