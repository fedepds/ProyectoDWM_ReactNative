import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToken } from "@/context/TokenContext";
import { useRouter } from "expo-router";
import { likePost, removeLike, createComment,removeComment } from "@/services/api";

const localhost = `10.166.0.136`;

const PostCard = ({ post, setPosts }) => {
  const {userData} = useToken();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

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
      console.error('Error al dar o quitar like:', error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const comment = await createComment(post._id, newComment);
      if (comment) {
        // Actualizamos el comentario para incluir el usuario actual
        const updatedComment = {
          ...comment,
          user: {
            _id: userData._id,
            username: userData.username,
          },
        };
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id
              ? { ...p, comments: [...p.comments, updatedComment] }
              : p
          )
        );
        setNewComment('');
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleRemoveComment = async (commentId) => {
    try {
      await removeComment(post._id, commentId);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === post._id
            ? { ...p, comments: p.comments.filter((c) => c._id !== commentId) }
            : p
        )
      );
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  return (
    <View style={styles.postCardContainer}>
      <View style={styles.postCardHeader}>
        <Image
          source={{
            uri:
              post.user.profilePicture ||
              'https://i.pinimg.com/736x/79/8f/bf/798fbf62ba74a844ceeef90b83c76e59.jpg',
          }}
          style={styles.postCardProfilePic}
        />
        <Text style={styles.postCardUsername}>{post.user.username}</Text>
      </View>

      <Image
        source={{ uri: `http://${localhost}:3001/${post.imageUrl.replace(/\\/g,"/")}` }}
        style={styles.postCardImage}
      />

      <View style={styles.postCardDetails}>
        <Text style={styles.postCardLikes}>
          <Text style={styles.boldText}>{post.likes.length} Me gusta</Text>
        </Text>

        <TouchableOpacity style={styles.postCardLikeIcon} onPress={handleLikePost}>
          <Text style={styles.likeButtonText}>
            {post.likes.includes(userData._id) ? 'Dislike' : 'Like'}
            
          </Text>
        </TouchableOpacity>

        <Text style={styles.postCardDescription}>
          <Text style={styles.boldText}>{post.user.username}</Text> {post.caption}
        </Text>

        <TouchableOpacity
          style={styles.postCardViewComments}
          onPress={() => setShowComments(!showComments)}
        >
          <Text style={styles.viewCommentsText}>
            {showComments
              ? `Ocultar comentarios`
              : `Ver los ${post.comments.length} comentarios`}
          </Text>
        </TouchableOpacity>

        <Text style={styles.postCardTime}>
          {new Date(post.createdAt).toLocaleTimeString()}
        </Text>
      </View>

      {showComments && (
        <View style={styles.postCardCommentsSection}>
          <FlatList
            data={post.comments}
            renderItem={({ item }) => (
              <View style={styles.postCardComment}>
                <Text style={styles.boldText}>{item.user.username}:</Text>
                <Text>{item.content}</Text>
                {item.user?._id === userData._id && (
                  <TouchableOpacity onPress={() => handleRemoveComment(item._id)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            keyExtractor={(item) => item._id}
          />

          <View style={styles.postCardAddComment}>
            <TextInput
              style={styles.postCardCommentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Escribe un comentario..."
            />
            <TouchableOpacity onPress={handleAddComment} style={styles.postCardAddBtn}>
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postCardContainer: {
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    margin: 16,
    overflow: 'hidden',
  },
  postCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  postCardProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postCardUsername: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  postCardImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  postCardDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postCardLikes: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  postCardLikeIcon: {
    backgroundColor: '#f1f1f1',
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    fontWeight: 'bold',
    color: '#b678dd',
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
  },
  likeButtonText: {
    fontWeight: 'bold',
    color: '#b678dd',
  },
  postCardDescription: {
    marginVertical: 8,
    lineHeight: 20,
  },
  postCardViewComments: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: '#b678dd',
    cursor: 'pointer',
    marginVertical: 8,
  },
  viewCommentsText: {
    color: '#b678dd',
    fontWeight: 'bold',
  },
  postCardTime: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
  },
  postCardCommentsSection: {
    marginTop: 16,
  },
  postCardComment: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  postCardAddComment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  postCardCommentInput: {
    flex: 1,
    padding: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
  },
  postCardAddBtn: {
    backgroundColor: '#b678dd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PostCard;
