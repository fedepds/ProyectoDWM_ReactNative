import AsyncStorage from "@react-native-async-storage/async-storage";

const localhost = `10.13.164.202`;

export const postLogin = async (email, password) => {
  const request = await fetch(`http://${localhost}:3001/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!request.ok) {
    throw new Error("Credenciales Incorrectass");
  }
  const data = await request.json();
  AsyncStorage.setItem("token", data.token);
  return data;
};

export const postSingin = async (username, email, password) => {
  const request = await fetch(`http://${localhost}:3001/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await request.json();
  return data;
};

//Al hacer la request hay que mandarle el Token JWT en los headers para que te autorice y te envíe la información

export const getProfileId = async (id) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(
      `http://${localhost}:3001/api/user/profile/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getFeed = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const request = await fetch(`http://${localhost}:3001/api/posts/feed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // Si la solicitud no es exitosa, lanzamos un error
    if (!request.ok) {
      throw new Error("Error al obtener el feed");
    }
    // Parseamos la respuesta como JSON
    const data = await request.json();
    // Devolvemos los datos para que puedan ser utilizados en el frontend
    return data;
  } catch (error) {
    console.error("Error en getFeed:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en la llamada
  }
};
export const likePost = async (postId) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(
      `http://${localhost}:3001/api/posts/${postId}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al dar like al post");
    }

    const data = await response.json();
    return data; // Devuelve el post actualizado con el nuevo like
  } catch (error) {
    console.error("Error en likePost:", error);
    throw error;
  }
};
export const removeLike = async (postId) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(
      `http://${localhost}:3001/api/posts/${postId}/like`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al remover el like del post");
    }

    const data = await response.json();
    return data; // Devuelve el post actualizado sin el like
  } catch (error) {
    console.error("Error en removeLike:", error);
    throw error;
  }
};

// Crear un nuevo comentario
export const createComment = async (postId, content) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(
      `http://${localhost}:3001/api/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el comentario");
    }

    const newComment = await response.json();
    return newComment;
  } catch (error) {
    console.error("Error en createComment:", error);
  }
};

// Obtener un comentario específico
export const getComment = async (commentId) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(
      `http://${localhost}:3001/api/posts/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el comentario");
    }

    const comment = await response.json();
    return comment;
  } catch (error) {
    console.error("Error en getComment:", error);
  }
};

// Eliminar un comentario
export const removeComment = async (postId, commentId) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(
      `http://${localhost}:3001/api/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el comentario");
    }

    const deletedComment = await response.json();
    return deletedComment;
  } catch (error) {
    console.error("Error en removeComment:", error);
  }
};

export const getAllUsers = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`http://${localhost}:3001/api/user/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};
