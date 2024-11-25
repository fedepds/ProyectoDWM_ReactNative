import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const CARD_MARGIN = 10; // Margen entre tarjetas
const CARD_WIDTH = (width - 10 * CARD_MARGIN) / 2; // Calcula el ancho de cada tarjeta
const CARD_HEIGHT = CARD_WIDTH * 1.2; // Relación de aspecto (ancho x altura)

const SearchCard = ({ user }) => {
  return (
    <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      <Image
        source={{
          uri: user.profilePicture || "https://i.pinimg.com/736x/79/8f/bf/798fbf62ba74a844ceeef90b83c76e59.jpg",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.username}>{user.username}</Text>
      </View>
    </View>
  );
};

export default SearchCard;

const styles = StyleSheet.create({
    card: {
      margin: CARD_MARGIN,
      backgroundColor: "#d0cece",
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
      width: "65%", 
      height: "55%",
      borderRadius: 100,
      marginBottom: 10,
    },
    username: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        marginTop: 5,
    },
  });