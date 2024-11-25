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
import { getFeed, likePost, removeLike } from "@/services/postServices";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData.ok) {
        setUserId(userData._id);
      }
    };
    fetchUserData();
  }, []);

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

  const handleLikePost = async () => {
    console.log(post);
    try {
      let updatedPost;
      if (post.likes.includes(userData._id)) {
        updatedPost = await removeLike(post._id);
      } else {
        updatedPost = await likePost(post._id);
      }

      updatedPost.comments = post.comments; // Mantener los comentarios intactos

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === updatedPost._id ? { ...p, likes: updatedPost.likes } : p
        )
      );
    } catch (error) {
      console.error("Error al dar o quitar like:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(post) => post._id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            setPosts={setPosts}
            //handleLikePost={handleLikePost}
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
