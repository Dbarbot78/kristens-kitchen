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

  const [preference, setPreference] =
    useState("Healthy");

  const [chefPersonality, setChefPersonality] =
    useState("Cozy Bakery Chef");

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

        formData.append(
          "preference",
          preference
        );

        formData.append(
          "chefPersonality",
          chefPersonality
        );

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

        setRecipe(
          data.recipe || data.ingredients
        );

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
        Kristen’s Kitchen 🥐
      </Text>

      <Text style={styles.subtitle}>
        <TouchableOpacity
  style={styles.savedButton}
  onPress={() =>
    router.push("/saved")
  }
>

  <Text style={styles.savedButtonText}>
    ❤️ View Saved Recipes
  </Text>

</TouchableOpacity>
        Make meals from what you already have.
      </Text>

      <View style={styles.filterRow}>

        <TouchableOpacity
          style={[
            styles.filterButton,
            chefPersonality ===
              "Cozy Bakery Chef" &&
              styles.activeFilterButton
          ]}
          onPress={() =>
            setChefPersonality(
              "Cozy Bakery Chef"
            )
          }
        >
          <Text
            style={[
              styles.filterText,
              chefPersonality ===
                "Cozy Bakery Chef" &&
                { color: "white" }
            ]}
          >
            🥐 Bakery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            chefPersonality ===
              "Cajun Grandma" &&
              styles.activeFilterButton
          ]}
          onPress={() =>
            setChefPersonality(
              "Cajun Grandma"
            )
          }
        >
          <Text
            style={[
              styles.filterText,
              chefPersonality ===
                "Cajun Grandma" &&
                { color: "white" }
            ]}
          >
            🔥 Cajun
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            chefPersonality ===
              "Gym Bro Chef" &&
              styles.activeFilterButton
          ]}
          onPress={() =>
            setChefPersonality(
              "Gym Bro Chef"
            )
          }
        >
          <Text
            style={[
              styles.filterText,
              chefPersonality ===
                "Gym Bro Chef" &&
                { color: "white" }
            ]}
          >
            💪 Gym
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.filterRow}>

        <TouchableOpacity
          style={[
            styles.filterButton,
            preference === "Healthy" &&
              styles.activeFilterButton
          ]}
          onPress={() =>
            setPreference("Healthy")
          }
        >
          <Text
            style={[
              styles.filterText,
              preference === "Healthy" &&
                { color: "white" }
            ]}
          >
            Healthy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            preference === "High Protein" &&
              styles.activeFilterButton
          ]}
          onPress={() =>
            setPreference("High Protein")
          }
        >
          <Text
            style={[
              styles.filterText,
              preference === "High Protein" &&
                { color: "white" }
            ]}
          >
            Protein
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            preference === "Quick Meals" &&
              styles.activeFilterButton
          ]}
          onPress={() =>
            setPreference("Quick Meals")
          }
        >
          <Text
            style={[
              styles.filterText,
              preference === "Quick Meals" &&
                { color: "white" }
            ]}
          >
            Quick
          </Text>
        </TouchableOpacity>

      </View>

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
            🥐 AI Recipe
          </Text>

          <Text style={styles.cardText}>
            {recipe}
          </Text>

        </View>

      )}

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
  flexGrow: 1,
  backgroundColor: "#FAF7F2",
  alignItems: "center",
  paddingTop: 90,
  paddingHorizontal: 20,
  paddingBottom: 120,
},

  title: {
  fontSize: 42,
  fontWeight: "800",
  color: "#2E4A3D",
  marginBottom: 12,
  textAlign: "center",
},

  subtitle: {
  fontSize: 18,
  color: "#6D7C73",
  textAlign: "center",
  marginBottom: 30,
  lineHeight: 28,
},

  filterRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  filterButton: {
    backgroundColor: "#DDEBDD",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  activeFilterButton: {
    backgroundColor: "#4D7C5A",
  },

  filterText: {
    color: "#2E4A3D",
    fontWeight: "600",
  },

  button: {
  backgroundColor: "#4D7C5A",
  paddingVertical: 18,
  paddingHorizontal: 36,
  borderRadius: 30,
  marginBottom: 45,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.15,
  shadowRadius: 10,

  elevation: 8,
},

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  previewImage: {
  width: "100%",
  height: 260,
  borderRadius: 30,
  marginBottom: 24,
},

  card: {
  width: "100%",
  backgroundColor: "white",
  padding: 24,
  borderRadius: 28,
  marginBottom: 24,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.08,
  shadowRadius: 10,

  elevation: 5,
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
  savedButton: {
    backgroundColor: "#E07A7A",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 25,
  },

  savedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});