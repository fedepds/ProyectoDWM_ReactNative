import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import PostCard from "@/components/PostCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFeed, likePost, removeLike, getAllUsers } from "@/services/postServices";
import { useToken } from "@/context/TokenContext";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const {userData} = useToken();
  const [user, setUsers] = useState([]);
  const userId = userData._id;

  const fetchAllUsers = async () => {
    console.log(userData);
    try {
      const profiles = await getAllUsers();
      setUsers(profiles);
      console.log(profiles);
    } catch (error) {
      console.error("Error fetching all profiles:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getFeed();
        setPosts(data);
      } catch (error) {
        console.error("Error al obtener el feed:", error);
      }
    };
    fetchPosts();
    fetchAllUsers();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(post) => post._id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            setPosts={setPosts}
          />
        )}
        contentContainerStyle={styles.postsContainer}
        ListEmptyComponent={() => <Text>No hay publicaciones disponibles</Text>}
      />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  postsContainer: {
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
