import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

type RecipeCardProps = {
  recipe: any;
  currentTheme: any;
  fadeAnim: any;
};

export default function RecipeCard({
  recipe,
  currentTheme,
  fadeAnim,
}: RecipeCardProps) {

  return (

    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor:
            currentTheme.card,

          borderColor:
            currentTheme.primary,

          opacity: 1,

transform: [
  {
    translateY: 0,
  },
],
        },
      ]}
    >

      <Image
  source={{
    uri:
      recipe.image ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  }}
        style={styles.recipeImage}
      />

      <Text
        style={[
          styles.recipeMainTitle,
          {
            color:
              currentTheme.text,
          },
        ]}
      >
        {recipe.title}
      </Text>

      <Text style={styles.recipeDescription}>
        {recipe.description}
      </Text>

      <View style={styles.infoRow}>

        <Text style={styles.infoBadge}>
          ⏱ {recipe.time || "25 min"}
        </Text>

        <Text style={styles.infoBadge}>
          🔥 {recipe.difficulty || "Easy"}
        </Text>

        <Text style={styles.infoBadge}>
          🍽 {recipe.servings || "4 Servings"}
        </Text>

        <Text style={styles.infoBadge}>
          💸 {recipe.cost || "$12"}
        </Text>

        <Text style={styles.infoBadge}>
          ⚡ {recipe.calories || "420 cal"}
        </Text>

      </View>

      <Text
        style={[
          styles.sectionTitle,
          {
            color:
              currentTheme.text,
          },
        ]}
      >
        Ingredients
      </Text>

      {recipe.ingredients?.map(
        (
          item: string,
          index: number
        ) => (

          <Text
            key={index}
            style={styles.listItem}
          >
            • {item}
          </Text>

        )
      )}

      <Text style={styles.sectionTitle}>
        Instructions
      </Text>

      {recipe.instructions?.map(
        (
          step: string,
          index: number
        ) => (

          <Text
            key={index}
            style={styles.listItem}
          >
            {index + 1}. {step}
          </Text>

        )
      )}

      {recipe.missingIngredients
        ?.length > 0 && (

        <>

          <Text style={styles.sectionTitle}>
            Missing Ingredients
          </Text>

          <View style={styles.chipContainer}>

            {recipe.missingIngredients.map(
              (
                item: string,
                index: number
              ) => (

                <View
                  key={index}
                  style={styles.ingredientChip}
                >

                  <Text
                    style={styles.chipText}
                  >
                    {item}
                  </Text>

                </View>

              )
            )}

          </View>

        </>

      )}

    </Animated.View>

  );

}

const styles = StyleSheet.create({

  recipeImage: {
    width: "100%",
    height: 240,

    borderRadius: 26,

    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    width: "100%",

    backgroundColor:
      "rgba(255,255,255,0.10)",

    padding: 24,

    borderRadius: 32,

    marginBottom: 24,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.25,

    shadowRadius: 20,

    elevation: 12,

    borderColor:
      "rgba(255,255,255,0.15)",
  },

  recipeMainTitle: {
    fontSize: 32,
    fontWeight: "bold",

    color: "#2E4A3D",

    marginBottom: 10,
  },

  recipeDescription: {
    fontSize: 16,

    color: "#6E7B74",

    marginBottom: 20,

    lineHeight: 24,
  },

  infoRow: {
    flexDirection: "row",

    marginBottom: 20,

    flexWrap: "wrap",

    gap: 10,
  },

  infoBadge: {
    backgroundColor: "#E8EFE8",

    color: "#2E4A3D",

    paddingVertical: 8,

    paddingHorizontal: 14,

    borderRadius: 20,

    overflow: "hidden",

    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 22,

    fontWeight: "bold",

    color: "#2E4A3D",

    marginTop: 20,

    marginBottom: 12,
  },

  listItem: {
    fontSize: 16,

    color: "#4F5F56",

    marginBottom: 10,

    lineHeight: 24,
  },

  chipContainer: {
    flexDirection: "row",

    flexWrap: "wrap",

    marginTop: 10,

    gap: 10,
  },

  ingredientChip: {
    backgroundColor: "#C9A86A",

    paddingVertical: 10,

    paddingHorizontal: 16,

    borderRadius: 20,
  },

  chipText: {
    color: "white",

    fontWeight: "600",
  },

});