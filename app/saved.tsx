import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    useFocusEffect,
} from "expo-router";

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

export default function SavedScreen() {

  const [savedRecipes, setSavedRecipes] =
    useState<string[]>([]);

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

      <Text style={styles.title}>
        ❤️ Saved Recipes
      </Text>

      {savedRecipes.map(
        (recipe, index) => (

          <View
            key={index}
            style={styles.recipeCard}
          >

            <Text style={styles.recipeText}>
              {recipe}
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

});