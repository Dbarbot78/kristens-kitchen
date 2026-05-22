import { useRouter } from "expo-router";
import { useState } from "react";

import * as ImagePicker from "expo-image-picker";

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export default function HomeScreen() {
  const router = useRouter();

  const [image, setImage] =
    useState<string | null>(null);

  const [recipe, setRecipe] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function openCamera() {

    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {

      Alert.alert(
        "Camera permission required"
      );

      return;

    }

    const result =
      await ImagePicker.launchCameraAsync({

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        quality: 1,

      });

    if (!result.canceled) {

      const imageUri =
        result.assets[0].uri;

      setImage(imageUri);

      setLoading(true);

      try {

        const formData =
          new FormData();

        formData.append("image", {

          uri: imageUri,
          name: "photo.jpg",
          type: "image/jpeg",

        } as any);

        const response =
          await fetch(

            "https://kristens-kitchen.onrender.com/analyze-image",

            {
              method: "POST",

              body: formData,

              headers: {
                "Content-Type":
                  "multipart/form-data",
              },

            }

          );

        const data =
          await response.json();
         Alert.alert(
  "DEBUG",
  JSON.stringify(data)
); 

        setRecipe(data.recipe || data.ingredients);
router.push({
  pathname: "/recipe",
  params: {
    recipe:
      data.recipe || data.ingredients,
  },
});
      } catch (error) {

       console.log(error);

Alert.alert(
  "AI scan failed",
  JSON.stringify(error)
);

      }

      setLoading(false);

    }

  }

  return (

    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.title}>
        Kristen’s Kitchen 🍳
      </Text>

      <Text style={styles.subtitle}>
        Make meals from what you already have.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={openCamera}
      >

        <Text style={styles.buttonText}>
          Scan Ingredients
        </Text>

      </TouchableOpacity>

      {loading && (

        <ActivityIndicator
          size="large"
          color="#4D7C5A"
        />

      )}

      {image && (

        <Image
          source={{ uri: image }}
          style={styles.previewImage}
        />

      )}

      {recipe !== "" && (

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            🍳 AI Recipe
          </Text>

          <Text style={styles.cardText}>
            {recipe}
          </Text>

        </View>

      )}

      <TouchableOpacity
  style={styles.card}
  onPress={() =>
    Alert.alert(
      "🍝 Quick Dinner",
      "20 Minute Garlic Butter Pasta recipe coming soon!"
    )
  }
>

  <Text style={styles.cardTitle}>
    Quick Dinner
  </Text>

  <Text style={styles.cardText}>
    20 Minute Garlic Butter Pasta
  </Text>

</TouchableOpacity>

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Healthy Option
        </Text>

        <Text style={styles.cardText}>
          Grilled Chicken Rice Bowl
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Beginner Friendly
        </Text>

        <Text style={styles.cardText}>
          Easy Homemade Tacos
        </Text>

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8F2",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#5F6F65",
    textAlign: "center",
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#4D7C5A",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 40,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginBottom: 5,
  },

  cardText: {
    fontSize: 16,
    color: "#5F6F65",
  },

});