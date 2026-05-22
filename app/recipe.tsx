import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    useLocalSearchParams,
} from "expo-router";

export default function RecipeScreen() {

  const { recipe } =
    useLocalSearchParams();

  return (

    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.title}>
        🍳 AI Recipe
      </Text>

      <View style={styles.recipeCard}>

        <Text style={styles.recipeText}>
  {JSON.stringify(recipe)}
</Text>

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8F2",
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginBottom: 30,
    textAlign: "center",
  },

  recipeCard: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
  },

  recipeText: {
    fontSize: 18,
    color: "#4B5B52",
    lineHeight: 30,
  },

});