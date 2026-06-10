import React, { useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {

  const [selectedLevel, setSelectedLevel] =
    useState("");

  const [mealMode, setMealMode] =
    useState("");

  const [ingredient, setIngredient] =
    useState("");

  const [pantry, setPantry] =
    useState<string[]>([]);

  const recipeDetails = {

    "Easy Tacos 🌮": {
      ingredients: [
        "Tortillas",
        "Ground Beef",
        "Cheese",
      ],
      time: "15 Minutes",
      cost: "$8",
      difficulty: "Easy",
      instructions:
        "Cook beef and assemble tacos.",
    },

    "Grilled Cheese 🥪": {
      ingredients: [
        "Bread",
        "Butter",
        "Cheese",
      ],
      time: "10 Minutes",
      cost: "$5",
      difficulty: "Easy",
      instructions:
        "Butter bread and grill with cheese.",
    },

    "Chicken Rice Bowl 🍗": {
      ingredients: [
        "Chicken",
        "Rice",
      ],
      time: "25 Minutes",
      cost: "$12",
      difficulty: "Medium",
      instructions:
        "Cook chicken and rice together.",
    },

    "Seafood Risotto 🦞": {
      ingredients: [
        "Seafood",
        "Rice",
      ],
      time: "40 Minutes",
      cost: "$24",
      difficulty: "Hard",
      instructions:
        "Slow cook rice and seafood together.",
    },

    "Filet Mignon 🥩": {
      ingredients: [
        "Steak",
        "Butter",
      ],
      time: "35 Minutes",
      cost: "$30",
      difficulty: "Hard",
      instructions:
        "Sear steak and finish with butter.",
    },

  };

  const recipes = {

    Beginner: [
      {
        name: "Easy Tacos 🌮",
        ingredients: ["beef", "cheese"],
      },

      {
        name: "Grilled Cheese 🥪",
        ingredients: ["bread", "cheese"],
      },
    ],

    Intermediate: [
      {
        name: "Chicken Rice Bowl 🍗",
        ingredients: ["chicken", "rice"],
      },
    ],

    Expert: [
      {
        name: "Filet Mignon 🥩",
        ingredients: ["steak", "butter"],
      },

      {
        name: "Seafood Risotto 🦞",
        ingredients: ["seafood", "rice"],
      },
    ],

  };

  function addIngredient() {

    if (ingredient.trim() === "") {
      return;
    }

    setPantry([
      ...pantry,
      ingredient.toLowerCase(),
    ]);

    setIngredient("");

  }

  function removeIngredient(
    indexToRemove: number
  ) {

    setPantry(
      pantry.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );

  }

  const suggestedIngredients = [

    "chicken",
    "rice",
    "cheese",
    "butter",
    "bread",
    "beef",
    "seafood",

  ].filter(
    (item) => !pantry.includes(item)
  );

  const filteredRecipes =
    selectedLevel === ""
      ? []
      : recipes[
          selectedLevel as keyof typeof recipes
        ]

          .filter((recipe) =>
            recipe.ingredients.some(
              (ingredient) =>
                pantry.includes(ingredient)
            )
          )

          .filter((recipe) => {

            if (mealMode === "Quick") {

              return (
                recipe.name.includes("Tacos") ||
                recipe.name.includes("Grilled")
              );

            }

            if (mealMode === "Protein") {

              return (
                recipe.ingredients.includes(
                  "chicken"
                ) ||

                recipe.ingredients.includes(
                  "steak"
                ) ||

                recipe.ingredients.includes(
                  "seafood"
                )
              );

            }

            if (mealMode === "Healthy") {

              return (
                recipe.ingredients.includes(
                  "rice"
                )
              );

            }

            return true;

          });
const breakfastRecipe =
  filteredRecipes[0];

const lunchRecipe =
  filteredRecipes[1];

const dinnerRecipe =
  filteredRecipes[2];

const totalCost = [

  breakfastRecipe,
  lunchRecipe,
  dinnerRecipe,

]

  .filter(Boolean)

  .reduce((total, recipe) => {

    const details =
      recipeDetails[
        recipe?.name as keyof typeof recipeDetails
      ];

    const numericCost =
      Number(
        details?.cost.replace("$", "")
      );

    return total + numericCost;

  }, 0);
  function generateShoppingList() {

    const missingItems =
      filteredRecipes.flatMap(
        (recipe) =>

          recipe.ingredients.filter(
            (ingredient) =>
              !pantry.includes(ingredient)
          )
      );

    const uniqueItems =
      [...new Set(missingItems)];

    Alert.alert(

      "🛒 Grocery List",

      uniqueItems.length > 0
        ? uniqueItems.join("\n")
        : "You already have everything 🎉"

    );

  }

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.logo}>
        Kristen’s Kitchen 🍳
      </Text>

      <Text style={styles.subtitle}>
        Smart Recipe Testing App
      </Text>

      <View style={styles.instructionsCard}>

        <Text style={styles.instructionsTitle}>
          📱 Tester Instructions
        </Text>

        <Text style={styles.instructionsText}>
          1. Add ingredients
          {"\n"}
          2. Select meal mode
          {"\n"}
          3. Select cooking level
          {"\n"}
          4. Tap recipes for details
        </Text>

      </View>

      <Text style={styles.sectionTitle}>
        Add Ingredients
      </Text>

      <Text style={styles.recipeText}>
        Pantry Items: {pantry.length}
      </Text>

      <View style={styles.quickAddContainer}>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() =>
            setPantry([...pantry, "chicken"])
          }
        >

          <Text style={styles.quickButtonText}>
            + Chicken
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() =>
            setPantry([...pantry, "rice"])
          }
        >

          <Text style={styles.quickButtonText}>
            + Rice
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() =>
            setPantry([...pantry, "cheese"])
          }
        >

          <Text style={styles.quickButtonText}>
            + Cheese
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() =>
            setPantry([...pantry, "butter"])
          }
        >

          <Text style={styles.quickButtonText}>
            + Butter
          </Text>

        </TouchableOpacity>

      </View>

      <TextInput
        style={styles.input}
        placeholder="Type ingredient..."
        value={ingredient}
        onChangeText={setIngredient}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={addIngredient}
      >

        <Text style={styles.addButtonText}>
          Add Ingredient
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setPantry([])}
      >

        <Text style={styles.clearButtonText}>
          Clear Pantry
        </Text>

      </TouchableOpacity>

      {pantry.map((item, index) => (

        <View
          style={styles.ingredientRow}
          key={index}
        >

          <View style={styles.ingredientCard}>

            <Text style={styles.ingredientText}>
              🥬 {item}
            </Text>

          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() =>
              removeIngredient(index)
            }
          >

            <Text style={styles.removeButtonText}>
              ✕
            </Text>

          </TouchableOpacity>

        </View>

      ))}

      <Text style={styles.sectionTitle}>
        Suggested Additions
      </Text>

      <View style={styles.quickAddContainer}>

        {suggestedIngredients.map(
          (item, index) => (

            <TouchableOpacity
              key={index}
              style={styles.quickButton}
              onPress={() =>
                setPantry([...pantry, item])
              }
            >

              <Text style={styles.quickButtonText}>
                + {item}
              </Text>

            </TouchableOpacity>

          )
        )}

      </View>

      <Text style={styles.sectionTitle}>
        Meal Mode
      </Text>

      <View style={styles.levelContainer}>

        <TouchableOpacity
          style={[
            styles.levelButton,
            mealMode === "Quick" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setMealMode("Quick")
          }
        >

          <Text style={styles.levelText}>
            🔥 Quick
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelButton,
            mealMode === "Protein" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setMealMode("Protein")
          }
        >

          <Text style={styles.levelText}>
            💪 Protein
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelButton,
            mealMode === "Healthy" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setMealMode("Healthy")
          }
        >

          <Text style={styles.levelText}>
            🥗 Healthy
          </Text>

        </TouchableOpacity>

      </View>

      <Text style={styles.sectionTitle}>
        Cooking Level
      </Text>

      <View style={styles.levelContainer}>

        <TouchableOpacity
          style={[
            styles.levelButton,
            selectedLevel === "Beginner" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setSelectedLevel("Beginner")
          }
        >

          <Text style={styles.levelText}>
            Beginner
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelButton,
            selectedLevel === "Intermediate" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setSelectedLevel("Intermediate")
          }
        >

          <Text style={styles.levelText}>
            Intermediate
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelButton,
            selectedLevel === "Expert" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setSelectedLevel("Expert")
          }
        >

          <Text style={styles.levelText}>
            Expert
          </Text>

        </TouchableOpacity>

      </View>
<Text style={styles.sectionTitle}>
  📅 Smart Daily Meal Plan
</Text>

<View style={styles.dashboardCard}>

  <Text style={styles.dashboardText}>
    🍳 Breakfast:
    {" "}
    {breakfastRecipe?.name || "No Match"}
  </Text>

  <Text style={styles.dashboardText}>
    🍗 Lunch:
    {" "}
    {lunchRecipe?.name || "No Match"}
  </Text>

  <Text style={styles.dashboardText}>
    🥩 Dinner:
    {" "}
    {dinnerRecipe?.name || "No Match"}
  </Text>

  <Text style={styles.dashboardCost}>
    💰 Estimated Total:
    {" "}
    ${totalCost}
  </Text>

</View>
      <Text style={styles.sectionTitle}>
        Recipe Ideas
      </Text>

      <TouchableOpacity
        style={styles.groceryButton}
        onPress={generateShoppingList}
      >

        <Text style={styles.groceryButtonText}>
          🛒 Generate Grocery List
        </Text>

      </TouchableOpacity>

      <Text style={styles.recipeText}>
        Matching Recipes:
        {" "}
        {filteredRecipes.length}
      </Text>

      <View style={styles.recipeCard}>

        {selectedLevel === "" ? (

          <Text style={styles.recipeText}>
            Select a cooking level 👆
          </Text>

        ) : (

          filteredRecipes.map(
            (recipe, index) => {

              const details =
                recipeDetails[
                  recipe.name as keyof typeof recipeDetails
                ];

              return (

                <TouchableOpacity
                  key={index}
                  onPress={() => {

                    if (details) {

                      Alert.alert(
                        recipe.name,

                        `Ingredients:
${details.ingredients.join(", ")}

Cook Time:
${details.time}

Cost:
${details.cost}

Difficulty:
${details.difficulty}

Instructions:
${details.instructions}`
                      );

                    }

                  }}
                >

                  <View style={styles.recipeItem}>

                    <Text style={styles.recipeTitle}>
                      {recipe.name}
                    </Text>

                    <Text style={styles.recipeTime}>
                      🍳 Tap For Details
                    </Text>

                    <Text style={styles.recipeText}>
                      ⏱ {details?.time}
                    </Text>

                    <Text style={styles.recipeText}>
                      💵 {details?.cost}
                    </Text>

                    <Text style={styles.recipeText}>
                      ⭐ {details?.difficulty}
                    </Text>

                    <Text style={styles.recipeText}>

                      ✅ You Have:
                      {"\n"}

                      {
                        recipe.ingredients
                          .filter((ingredient) =>
                            pantry.includes(ingredient)
                          )
                          .join(", ")
                      }

                    </Text>

                    <Text style={styles.recipeText}>

                      ❌ Missing:
                      {"\n"}

                      {
                        recipe.ingredients
                          .filter((ingredient) =>
                            !pantry.includes(ingredient)
                          )
                          .join(", ")
                      }

                    </Text>

                  </View>

                </TouchableOpacity>

              );

            }
          )

        )}

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F8F2",
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#5F6F65",
    marginBottom: 20,
  },

  instructionsCard: {
    backgroundColor: "#E8F1EB",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },

  instructionsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginBottom: 10,
  },

  instructionsText: {
    fontSize: 16,
    color: "#4F5D56",
    lineHeight: 24,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginBottom: 15,
    marginTop: 10,
  },

  quickAddContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  quickButton: {
    backgroundColor: "#DCEBDD",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  quickButtonText: {
    color: "#2E4A3D",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },

  addButton: {
    backgroundColor: "#4D7C5A",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },

  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  clearButton: {
    backgroundColor: "#B0413E",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  ingredientCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
  },

  ingredientText: {
    fontSize: 16,
    color: "#2E4A3D",
  },

  removeButton: {
    backgroundColor: "#D9534F",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  levelContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },

  levelButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
  },

  activeButton: {
    backgroundColor: "#4D7C5A",
  },

  levelText: {
    color: "#2E4A3D",
    fontWeight: "bold",
  },
dashboardCard: {
  backgroundColor: "#E8F1EB",
  padding: 20,
  borderRadius: 20,
  marginBottom: 25,
},

dashboardText: {
  fontSize: 18,
  color: "#2E4A3D",
  marginBottom: 10,
},

dashboardCost: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#4D7C5A",
  marginTop: 10,
},
  groceryButton: {
    backgroundColor: "#F0B429",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  groceryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  recipeCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  recipeItem: {
    marginBottom: 20,
  },

  recipeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginBottom: 8,
  },

  recipeText: {
    fontSize: 18,
    color: "#5F6F65",
    marginBottom: 10,
  },

  recipeTime: {
    fontSize: 16,
    color: "#7A8B7E",
  },

});