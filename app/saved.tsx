import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useCallback,
  useState,
} from "react";
import BackButton from "./components/BackButton";

export default function SavedScreen() {

  const [savedRecipes, setSavedRecipes] =
    useState<any[]>([]);

  useFocusEffect(

    useCallback(() => {

      async function loadRecipes() {

        const recipes =
          await AsyncStorage.getItem(
            "savedRecipes"
          );

        if (recipes) {

          setSavedRecipes(
            JSON.parse(recipes)
          );

        }

      }

      loadRecipes();

    }, [])

  );

  return (

    <ScrollView
  contentContainerStyle={styles.container}
>

 <View
  style={{
    width: "100%",
    marginBottom: 20,
  }}
>
  <BackButton />
</View>
  <Text style={styles.title}>
    ❤️ Saved Recipes
  </Text>

     {savedRecipes.map(
  (recipe, index) => (

    <View
      key={index}
      style={styles.recipeCard}
    >

      <Text style={styles.recipeTitle}>
        {recipe.title}
      </Text>

      <Text style={styles.recipeText}>
        {recipe.description}
      </Text>

      <Text style={styles.recipeMeta}>
        ⏱ {recipe.time}
      </Text>

      <Text style={styles.recipeMeta}>
        🔥 {recipe.difficulty}
      </Text>

    </View>

  )
)} 

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8F2",
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginBottom: 30,
    textAlign: "center",
  },

  recipeCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  recipeText: {
    fontSize: 16,
    color: "#4B5B52",
    lineHeight: 28,
  },
  recipeTitle: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#2E4A3D",
  marginBottom: 8,
},

recipeMeta: {
  fontSize: 14,
  color: "#666",
  marginTop: 4,
},

});