import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useLocalSearchParams,
} from "expo-router";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RecipeScreen() {

  const { recipe } =
    useLocalSearchParams();
    const parsedRecipe =
  recipe
    ? JSON.parse(recipe.toString())
    : null;
  async function saveRecipe() {

  try {

    const existingRecipes =
      await AsyncStorage.getItem(
        "savedRecipes"
      );

    const parsedRecipes =
      existingRecipes
        ? JSON.parse(existingRecipes)
        : [];

    parsedRecipes.push(parsedRecipe);

    await AsyncStorage.setItem(
      "savedRecipes",
      JSON.stringify(parsedRecipes)
    );

    Alert.alert(
      "❤️ Recipe Saved"
    );

  } catch (error) {

    console.log(error);

  }

}  

  return (

    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.title}>
        🥐 AI Recipe
      </Text>
      <View style={styles.badgeRow}>

  <View style={styles.badge}>
    <Text style={styles.badgeText}>
    ⏱ 20-30 mins
    </Text>
  </View>

  <View style={styles.badge}>
    <Text style={styles.badgeText}>
     🔥 Easy Recipe
    </Text>
  </View>

  <View style={styles.badge}>
    <Text style={styles.badgeText}>
      🥐 Bakery Style
    </Text>
  </View>

</View>
<TouchableOpacity
  style={styles.saveButton}
  onPress={saveRecipe}
>

  <Text style={styles.saveButtonText}>
    ❤️ Save Recipe
  </Text>

</TouchableOpacity>
  <View style={styles.recipeCard}>

  <Text style={styles.sectionTitle}>
    🥘 Recipe
  </Text>

  <Text style={styles.recipeText}>
    {recipe
      ?.toString()
      .replace(/\\n/g, "\n")
      .replace(/###/g, "")
      .replace(/\*\*/g, "")
    }
  </Text>

</View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
  flexGrow: 1,
  backgroundColor: "#FAF7F2",
  paddingTop: 80,
  paddingHorizontal: 20,
  paddingBottom: 120,
},

  title: {
  fontSize: 38,
  fontWeight: "800",
  color: "#2E4A3D",
  marginBottom: 30,
  textAlign: "center",
},

  recipeCard: {
  backgroundColor: "white",
  padding: 28,
  borderRadius: 30,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 5,
  },

  shadowOpacity: 0.08,
  shadowRadius: 10,

  elevation: 5,
},
sectionTitle: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#2E4A3D",
  marginBottom: 20,
},
  recipeText: {
  fontSize: 18,
  color: "#4B5B52",
  lineHeight: 34,
},
  saveButton: {
    backgroundColor: "#E07A7A",
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
   badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 25,
    justifyContent: "center",
  },

  badge: {
    backgroundColor: "#E7EFE7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  badgeText: {
    color: "#2E4A3D",
    fontWeight: "600",
    fontSize: 14,
  }, 
});