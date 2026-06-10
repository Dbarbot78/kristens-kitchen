import {
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import {
  useFonts,
} from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import OpenAI from "openai";

import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";


import {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import RecipeCard from "./components/RecipeCard";
import { themes } from "./theme/themes";
export default function HomeScreen(): import("react").JSX.Element {

  const router = useRouter();
  const openai = new OpenAI({
  apiKey:
    Constants.expoConfig?.extra?.OPENAI_API_KEY,
});
  const [fontsLoaded] = useFonts({

  PlayfairDisplay_700Bold,

  Poppins_400Regular,

  Poppins_600SemiBold,

});
  
  const [image, setImage] =
    useState<string | null>(null);

  const [recipe, setRecipe] =
  useState<any>(null);
  const [recipes, setRecipes] =
useState<any[]>([]);
const [favoriteCuisine,
setFavoriteCuisine] =
useState("");
const [craving, setCraving] =
  useState("");
console.log(
  "FAVORITE CUISINE:",
  favoriteCuisine
);
const [dietStyle,
setDietStyle] =
useState("Balanced");

const [cookingSkill,
setCookingSkill] =
useState("Intermediate");

const [preferredCookTime,
setPreferredCookTime] =
useState("30 minutes");
const [expandedRecipe, setExpandedRecipe] =
  useState<number | null>(null);
  const [
  detectedIngredients,
  setDetectedIngredients
] = useState<string[]>([]);
  const [loading, setLoading] =
  useState(false);

   const [isListening, setIsListening] =
  useState(false); 

  const [preference, setPreference] =
    useState("Healthy");
  
  const [chefPersonality, setChefPersonality] =
    useState("Cozy Bakery Chef");

  const [showSplash, setShowSplash] =
    useState(true);
    const [selectedTheme, setSelectedTheme] =
  useState("bellaKitchen");

const currentTheme =
  themes[
    selectedTheme as keyof typeof themes
  ];

const ambient =
  getAmbientColors();

const fadeAnim =
  useState(
    new Animated.Value(0)
  )[0];

const pulseAnim =
  useState(
    new Animated.Value(1)
  )[0];

const ambientFade =
  useState(
    new Animated.Value(0)
  )[0];
 const recipeFade =
  useState(
    new Animated.Value(0)
  )[0]; 

useEffect(() => {


  const timer = setTimeout(() => {

    setShowSplash(false);

  }, 5000);

  return () => clearTimeout(timer);
  }, []);
  useEffect(() => {

  loadPreferences();

}, []);

async function loadPreferences() {

  const savedCuisine =
    await AsyncStorage.getItem(
      "favoriteCuisine"
    );

  const savedDiet =
    await AsyncStorage.getItem(
      "dietStyle"
    );

  const savedSkill =
    await AsyncStorage.getItem(
      "cookingSkill"
    );

  const savedCookTime =
    await AsyncStorage.getItem(
      "preferredCookTime"
    );

  if (savedCuisine)
    setFavoriteCuisine(savedCuisine);

  if (savedDiet)
    setDietStyle(savedDiet);

  if (savedSkill)
    setCookingSkill(savedSkill);

  if (savedCookTime)
    setPreferredCookTime(
      savedCookTime
    );

}
if (!fontsLoaded) {

  return <View />;

}
function getAmbientColors() {

  switch (chefPersonality) {

    case "Cajun Grandma":
      return {
        glow: "rgba(255,120,60,0.22)",
        orb: "rgba(255,140,80,0.35)",
      };

    case "Gym Bro Chef":
      return {
        glow: "rgba(80,220,160,0.18)",
        orb: "rgba(100,255,180,0.32)",
      };

    default:
      return {
        glow: "rgba(201,168,106,0.18)",
        orb: "rgba(201,168,106,0.32)",
      };

  }

}

function getChefIntro() {

  switch (chefPersonality) {

    case "Cajun Grandma":
      return "Baby, this recipe is gonna warm your soul ⚜️";

    case "Gym Bro Chef":
      return "High protein. Big flavor. Serious gains 💪";

    case "Cozy Bakery Chef":
      return "Fresh baked comfort and cozy kitchen magic 🥐";

    default:
      return "Let's cook something amazing ✨";

  }
}
async function generateAIRecipes() {

  console.log(
    "Generating AI fallback recipes..."
  );
console.log(
  "CRAVING RECEIVED:",
  craving
);
  const ingredientText =
    detectedIngredients.join(", ");
console.log(
  "STEP 2 PASSED",
  ingredientText
);
  const completion =
    await openai.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [
     {
  role: "system",
  content:
`You are a professional chef.

Return JSON in exactly this format:

{
  "recipes": [
    {
      "title": "Recipe Name",
      "description": "Short description",
      "time": "30 min",
      "difficulty": "Easy",
      "servings": "4",
      "ingredients": [
        "ingredient1",
        "ingredient2"
      ],
      "instructions": [
        "Step 1",
        "Step 2"
      ]
    }
  ]
}

Create 10 recipes using the provided ingredients.

Each recipe must include:

- title
- description
- time
- difficulty
- servings
- ingredients
- instructions

Return only valid JSON.`
},   
  {
  role: "user",
  content:
`Ingredients: ${ingredientText}

Cuisine Preference:
${favoriteCuisine}

User Craving:
${craving}

Diet Style:
${dietStyle}

Cooking Skill:
${cookingSkill}

Preferred Cook Time:
${preferredCookTime}

Generate 10 recipes.

Recipes should match the cuisine, craving, diet, skill level, and cook time preferences.`
  }
      ],

      response_format: {
        type: "json_object"
      }
    });

  const content =
    completion.choices[0].message.content;

 const parsed =
  JSON.parse(content || "{}");

console.log(
  "AI RECIPES:",
  parsed
);
const formattedRecipes =
  (parsed.recipes || []).map(
    (recipe: any) => ({
      title:
        recipe.title || "Untitled Recipe",

      description:
        recipe.description ||
        "Chef-crafted recipe",

      time:
        recipe.time || "30 min",

      difficulty:
        recipe.difficulty ||
        "Medium",

      servings:
        recipe.servings || "4",

      image:
        recipe.image || null,

      ingredients:
        recipe.ingredients || [],

      instructions:
        recipe.instructions || [],
    })
  );
setRecipes(
  formattedRecipes
);
}


async function regenerateRecipes() {
  if (detectedIngredients.length === 0) {
    Alert.alert(
      "No Ingredients",
      "Add ingredients first."
    );
    return;
  }

  setLoading(true);
 
console.log(
  "REGENERATE STARTED"
);
console.log(
  "STEP 1 PASSED"
);
try {

  const ingredientText =
    detectedIngredients.join(",");

  console.log(
    "STEP 2 PASSED",
    ingredientText
  );

  const spoonacularResponse =
    await fetch(

      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
        ingredientText
      )}&number=5&apiKey=c88b0bfac6b64cc8a9348d51a7f5eb66`

    );

  const spoonacularData =
    await spoonacularResponse.json();

  console.log(
    "REGENERATE DATA:",
    spoonacularData
  );

  if (!Array.isArray(spoonacularData)) {

    throw new Error(
      "Spoonacular unavailable"
    );

  }

const recipeResults =
  await Promise.all(

    spoonacularData.map(
      async (item: any) => {

        const recipeInfoResponse =
          await fetch(

            `https://api.spoonacular.com/recipes/${item.id}/information?apiKey=c88b0bfac6b64cc8a9348d51a7f5eb66`

          );

        const recipeInfo =
          await recipeInfoResponse.json();

        return {

          title:
            recipeInfo.title,

          description:
            (
              chefPersonality ===
              "Cajun Grandma"

                ? "Soulful Louisiana comfort food with bold Southern flavor ⚜️"

                : chefPersonality ===
                  "Gym Bro Chef"

                ? "Protein-focused performance fuel built for energy and gains 💪"

                : "Warm elegant comfort cooking with cozy luxury vibes 🥐"
            ) +
            ` Perfect for a ${favoriteCuisine} lover with ${cookingSkill.toLowerCase()} cooking experience who prefers ${preferredCookTime.toLowerCase()} meals.`,

          time:
            `${recipeInfo.readyInMinutes} min`,

          difficulty:
            "AI Chef",

          servings:
            `${recipeInfo.servings} servings`,

          calories:
            "--",

          cost:
            `$${Math.round(
              recipeInfo.pricePerServing / 100
            )}`,

          ingredients:
            recipeInfo.extendedIngredients.map(
              (ingredient: any) =>
                ingredient.original
            ),

          instructions:
            recipeInfo.analyzedInstructions?.[0]
              ?.steps?.map(
                (step: any) =>
                  step.step
              ) || [
                "Follow recipe instructions."
              ],

          missingIngredients: [],

          image:
            recipeInfo.image,

        };

      }
    )

  );

setRecipes(recipeResults);

setRecipe(recipeResults[0]);

Alert.alert(
  "Recipe Refresh Complete 🍽️",
  "Recipes updated successfully."
);
}catch (error) {

  console.log(error);

  console.log(
    "Switching to AI recipe generation..."
  );

  await generateAIRecipes();

}

setLoading(false);
}
async function openGallery() {

  Alert.alert(
    "Gallery feature reconnect coming next step 📸"
  );

  setIsListening(false);

}

async function openCamera() {

  const permission =
    await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {

    Alert.alert(
      "Permission Needed",
      "Camera access is required."
    );

    return;
  }

  const result =
    await ImagePicker.launchCameraAsync({

      mediaTypes:
        ["images"],

      allowsEditing: true,

      quality: 1,
      base64: true,
    });

  if (
  result &&
  !result.canceled &&
  result.assets &&
  result.assets.length > 0
) {
console.log("CAMERA RESULT:", result);
    const imageUri =
      result.assets[0].uri;

    setImage(imageUri);

    setLoading(true);

    try {

  const base64Image =
  result.assets[0].base64;
  const visionResponse =
    await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "user",

          content: [

            {
              type: "text",

              text:
                "Identify the food ingredients in this image. Return ONLY a comma separated ingredient list.",
            },

              {
            type: "image_url",

            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },

        ],
      },
    ],

    max_tokens: 100,
  });       

  const ingredientText =
    visionResponse.choices[0]
      .message.content || "";
    const ingredientArray =
  ingredientText
    .split(",")
  .map((item: string) => item.trim()); 

setDetectedIngredients(
  ingredientArray
);

console.log(
  "INGREDIENTS DETECTED:",
  ingredientArray
);

setRecipes([]);

setTimeout(async () => {
  await generateAIRecipes();
}, 500);


} catch (error) {

  console.log(error);

  console.log(
    "Switching camera scan to AI recipes..."
  );

  await generateAIRecipes();

}
setLoading(false);

  }

}

if (showSplash) {

  return (

    <View style={styles.splashContainer}>

      <Image
        source={
          require("../assets/images/splash.png")
        }
        style={styles.splashImage}
        resizeMode="cover"
      />

    </View>

  );

}

return (

    <><LinearGradient

    colors={[
      currentTheme.background,
      currentTheme.accent,
    ]}

    start={{
      x: 0,
      y: 0,
    }}

    end={{
      x: 1,
      y: 1,
    }}

    style={{ flex: 1 }}

  >

    <Animated.View
      style={[
        styles.glowTop,
        {
          backgroundColor: ambient.glow,
        },
      ]} />

    <View
      style={styles.glowBottom} />
    <ScrollView
      contentContainerStyle={styles.container}
    >

      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: currentTheme.card,
          },
        ]}
      >
<View>

  <Text
    style={[

      styles.title,

      {

        position: "relative",

        color: "#C9A86A",

        opacity: 0.9,

        textShadowColor: "#7df9ff",

        textShadowOffset: {
          width: 0,
          height: 0,
        },

        textShadowRadius: 55,

      },

    ]}
  >
   ✨ Timbré ✨
  </Text>


</View>
        

        <Text
          style={[
            styles.subtitle,
            {
              color: currentTheme.text,
            },
          ]}
        >
          Your Pantry. Endless Possibilities.
              </Text>

      </View>
      
      <TouchableOpacity
        style={styles.savedButton}
        onPress={() => router.push("/saved")}
      >

        <Text style={styles.savedButtonText}>
          ❤️ View Saved Recipes
        </Text>

      </TouchableOpacity>
      {/*<View style={styles.themeRow}>
          {(Object.keys(themes) as Array<
            keyof typeof themes
          >
        ).map((themeKey) => (
          <TouchableOpacity
            key={String(themeKey)}

            style={[
              styles.themeButton,

              selectedTheme === themeKey && {
                backgroundColor: currentTheme.primary,
              },
            ]}

            onPress={() =>
  setSelectedTheme(String(themeKey))
}
          >

            <Text
              style={[
                styles.themeButtonText,

                selectedTheme === themeKey && {
                  color: "white",
                },
              ]}
            >

              {themes[themeKey].name}

            </Text>

          </TouchableOpacity>

        )
        )}

      </View>*/}

      {/*<View style={styles.filterRow}>

        <TouchableOpacity
          activeOpacity={0.82}

          style={[
            styles.filterButton,
          ]}
          onPress={() => setChefPersonality(
            "Cozy Bakery Chef"
          )}
        >

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >

            <MaterialCommunityIcons
              name="bread-slice"
              size={20}
              color={chefPersonality ===
                "Cozy Bakery Chef"
                ? "white"
                : "#C9A86A"} />

            <Text
              style={[
                styles.filterText,
                chefPersonality ===
                "Cozy Bakery Chef" && {
                  color: "white",
                },
              ]}
            >
              Bakery
            </Text>

          </View>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            chefPersonality ===
            "Cajun Grandma" &&
            styles.filterButton,
          ]}
          onPress={() => setChefPersonality(
            "Cajun Grandma"
          )}
        >

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >

            <MaterialCommunityIcons
  name="fleur-de-lis"
  size={22}
  color={
    chefPersonality ===
    "Cajun Grandma"
      ? "white"
      : "#C9A86A"
  }
/>
            <Text
              style={[
                styles.filterText,
                chefPersonality ===
                "Cajun Grandma" && {
                  color: "white",
                },
              ]}
            >
              Cajun
            </Text>

          </View>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            chefPersonality ===
            "Gym Bro Chef" &&
            styles.filterButton,
          ]}
          onPress={() => setChefPersonality(
            "Gym Bro Chef"
          )}
        >

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >

            <MaterialCommunityIcons
              name="dumbbell"
              size={20}
              color={chefPersonality ===
                "Gym Bro Chef"
                ? "white"
                : "#7ED957"} />

            <Text
              style={[
                styles.filterText,
                chefPersonality ===
                "Gym Bro Chef" && {
                  color: "white",
                },
              ]}
            >
              Performance
            </Text>

          </View>

        </TouchableOpacity>

      </View>*/}
      <Text style={styles.cravingTitle}>
  🍽 What Are You Craving?
</Text>

<Text style={styles.cravingDescription}>
  Discover recipes by cuisine,
  flavor, food type, or style.
</Text>

<TextInput
  style={styles.cravingInput}
  placeholder="Search food, cuisine, flavor, or style..."
  placeholderTextColor="#999"
  value={craving}
  onChangeText={setCraving}
/>

<Text style={styles.exampleText}>
  Italian • Seafood • Comfort Food • BBQ • Bakery • Thai
</Text>
          
        <Text style={styles.cravingDescription}>
        {loading
          ? "Analyzing ingredients and building your recipe... ✨"
          : isListening
            ? "I'm listening... tell me what you're craving 🎙"
            : getChefIntro()}
        </Text>
      {/*<View style={styles.filterRow}>

        <TouchableOpacity
  style={[
  styles.filterButton,
  favoriteCuisine === "Italian" &&
  styles.activeFilterButton
]}
  onPress={() => setFavoriteCuisine("Italian")}
>
  <Text
    style={[
      styles.filterText,
      favoriteCuisine === "Italian" &&
{ color: "white" },
    ]}
  >
    Italian
  </Text>
</TouchableOpacity>
<TouchableOpacity
  style={[
    styles.filterButton,
    favoriteCuisine === "Cajun" &&
    styles.activeFilterButton
  ]}
  onPress={() =>
    setFavoriteCuisine("Cajun")
  }
>
  <Text
    style={[
      styles.filterText,
      favoriteCuisine === "Cajun" &&
      { color: "white" }
    ]}
  >
    Cajun
  </Text>
</TouchableOpacity>
  <TouchableOpacity
          style={[
    styles.filterButton,
    favoriteCuisine === "Mexican" &&
    styles.activeFilterButton
  ]}
  onPress={() =>
    setFavoriteCuisine("Mexican")
  }
>
  <Text
    style={[
      styles.filterText,
      favoriteCuisine === "Mexican" &&
      { color: "white" }
    ]}
  >
    Mexican
  </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
    styles.filterButton,
    favoriteCuisine === "Chef's Choice" &&
    styles.activeFilterButton
  ]}
  onPress={() =>
    setFavoriteCuisine("Chef's Choice")
  }
>
  <Text
    style={[
      styles.filterText,
      favoriteCuisine === "Chef's Choice" &&
      { color: "white" }
    ]}
  >
    Chef&apos;s Choice
  </Text>
          
        </TouchableOpacity>

      </View>*/}

      <TouchableOpacity

        activeOpacity={0.82}

        style={[
          styles.button,
          {
            backgroundColor: currentTheme.primary,
          },
        ]}
        onPress={openCamera}
      >

        <Text style={styles.buttonText}>
          Scan Ingredients
        </Text>

      </TouchableOpacity>
      <TouchableOpacity

        style={[
          styles.secondaryButton,
          {
            backgroundColor: currentTheme.card,
          },
        ]}
        onPress={openGallery}
      >

        <Text
          style={[
            styles.secondaryButtonText,
            {
              color: currentTheme.text,
            },
          ]}
        >
          Upload From Gallery
        </Text>

      </TouchableOpacity>

      <TouchableOpacity

        activeOpacity={0.82}

        style={[
          styles.voiceButton,
          {
            backgroundColor: isListening
              ? "#C9A86A"
              : currentTheme.card,
          },
        ]}

        onPress={() => {

          if (isListening) {

            setIsListening(false);

            return;

          }

          setIsListening(true);

          setLoading(true);

          setTimeout(() => {

            setRecipe({
              title: "Chef's Smart Breakfast Bowl 🥑",

              description: "A healthy high-protein breakfast generated from your voice request.",

              time: "15 min",

              difficulty: "Easy",

              servings: "2",

              calories: "420 cal",

              cost: "$9",

              ingredients: [
                "Eggs",
                "Avocado",
                "Rice",
                "Spinach",
                "Hot Sauce",
              ],

              instructions: [
                "Cook rice.",

                "Prepare eggs.",

                "Slice avocado.",

                "Combine ingredients.",

                "Top with sauce.",
              ],

              missingIngredients: [
                "Spinach",
              ],
            });
            Animated.spring(
              recipeFade,
              {
                toValue: 1,

                friction: 7,

                tension: 40,

                useNativeDriver: true,
              }
            ).start();
            setLoading(false);

            setIsListening(false);

          }, 3200);

        } }
      >

        <Text
          style={[
            styles.voiceButtonText,
            {
              color: isListening
                ? "#050505"
                : currentTheme.text,
            },
          ]}
        >
          {isListening
            ? "🎙 Listening..."
            : "🎙 Talk To Chef"}
        </Text>

      </TouchableOpacity>
      {loading && (

        <View
          style={[
            styles.loadingCard,
            {
              backgroundColor: currentTheme.card,

              borderColor: currentTheme.primary,
            },
          ]}
        >

          <ActivityIndicator
            size="large"
            color="#C9A86A" />

          <Text style={styles.loadingTitle}>
            Timbré AI Crafting Your Experience...
          </Text>

          <Text style={styles.loadingText}>
            Building your custom recipe ✨
          </Text>

        </View>

      )}{detectedIngredients.length > 0 && (

  <View
    style={styles.detectedContainer}
  >

    <Text style={styles.detectedTitle}>
      🥬 Detected Ingredients
    </Text>

    <View style={styles.chipWrap}>

      {detectedIngredients.map(
        (ingredient, index) => (

          <TouchableOpacity
            key={index}

            style={styles.ingredientChip}

            onPress={() => {

              const updatedIngredients =
                detectedIngredients.filter(
                  (_, i) => i !== index
                );

              setDetectedIngredients(
                updatedIngredients
              );

            }}
          >

            <Text style={styles.chipText}>
              {ingredient} ✕
            </Text>

          </TouchableOpacity>

        )
      )}

           </View>

<TouchableOpacity
  style={{
    backgroundColor: "#C9A86A",
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: "center",
    marginTop: 15,
  }}
  onPress={regenerateRecipes}
>
  <Text
    style={{
      color: "#050505",
      fontWeight: "700",
      fontSize: 16,
    }}
  >
    ✨ Regenerate Recipes
  </Text>
</TouchableOpacity>

  </View>

)}
      {image && (

        <Image
         source={{ uri: image! }}
          style={styles.previewImage} />

      )}
      {recipes.length > 0 && (

  <View
    style={{
      width: "100%",
    }}
  >

          {recipes.map(
            (recipeItem, index) => (

              <View
                key={index}
                style={{
                  marginBottom: 30,
                }}
              >

                <TouchableOpacity

                  activeOpacity={0.9}

                  onPress={() => {

                    if (expandedRecipe === index) {

                      setExpandedRecipe(null);

                    } else {

                      setExpandedRecipe(index);

                    }

                  } }

                  style={{
                    backgroundColor: "#ffffff15",

                    borderRadius: 24,

                    padding: 18,
                  }}

                >

                  <View
                    style={{
                      width: "100%",
                      height: 240,

                      borderRadius: 28,

                      overflow: "hidden",

                      marginBottom: 18,

                      position: "relative",
                    }}
                  >

                    <Image
                      source={{
                        uri: recipeItem.image,
                      }}

                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                      }}

                      resizeMode="cover" />

                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(0,0,0,0.75)",
                      ]}

                      style={{
                        position: "absolute",

                        width: "100%",
                        height: "100%",
                      }} />

                    <View
                      style={{
                        position: "absolute",

                        bottom: 20,

                        left: 20,

                        right: 20,
                      }}
                    >

                      <Text
                        style={{
                          color: "white",

                          fontSize: 26,

                          fontFamily: "PlayfairDisplay_700Bold",

                          textShadowColor: "rgba(0,0,0,0.8)",

                          textShadowOffset: {
                            width: 0,
                            height: 2,
                          },

                          textShadowRadius: 12,
                        }}
                      >
                        {recipeItem.title}
                      </Text>

                    </View>

                  </View>



                  <Text
                    style={{
                      color: "white",

                      fontSize: 22,

                      fontWeight: "700",

                      marginBottom: 10,

                      textShadowColor: "#7df9ff",

                      textShadowOffset: {
                        width: 0,
                        height: 0,
                      },

                      textShadowRadius: 14,
                    }}
                  >
                    {recipeItem.title}
                  </Text>

                  <Text
                    style={{
                      color: "#dddddd",

                      marginBottom: 8,
                    }}
                  >
                    ⏱ {recipeItem.time}
                  </Text>
                  <Text
  style={{
    color: "#dddddd",
    marginBottom: 6,
  }}
>
  👨‍🍳 {recipeItem.difficulty}
</Text>

<Text
  style={{
    color: "#dddddd",
    marginBottom: 8,
  }}
>
  🍽️ {recipeItem.servings}
</Text>

                  <Text
                    style={{
                      color: "#cccccc",

                      lineHeight: 22,
                    }}
                  >
                    {recipeItem.description}
                  </Text>

                  {expandedRecipe === index && (

                    <View
                      style={{
                        marginTop: 20,
                      }}
                    >

                      <RecipeCard
                        recipe={recipeItem}
                        currentTheme={currentTheme}
                        fadeAnim={recipeFade} />

                    </View>

                  )}

                </TouchableOpacity>

                <TouchableOpacity

                  activeOpacity={0.82}

                  style={{
                    backgroundColor: "#E07A7A",

                    paddingVertical: 16,

                    borderRadius: 24,

                    alignItems: "center",

                    marginTop: 16,
                  }}

                  onPress={async () => {

                    try {

                      const existingRecipes = await AsyncStorage.getItem(
                        "savedRecipes"
                      );

                      let parsedRecipes = [];

                      if (existingRecipes) {

                        parsedRecipes =
                          JSON.parse(existingRecipes);

                      }

                      parsedRecipes.push(
                        recipeItem
                      );

                      await AsyncStorage.setItem(
                        "savedRecipes",
                        JSON.stringify(parsedRecipes)
                      );

                      Alert.alert(
                        "Recipe Saved ❤️",
                        `${recipeItem.title} added to favorites`
                      );

                    } catch (error) {

                      console.log(error);

                      Alert.alert(
                        "Save Failed",
                        "Could not save recipe."
                      );

                    }

                  } }

                >

                  <Text
                    style={{
                      color: "white",

                      fontWeight: "700",

                      fontSize: 16,
                    }}
                  >
                    ❤️ Save Recipe
                  </Text>

                </TouchableOpacity>

              </View>

            ))}

        </View>

)}

<View style={styles.bottomNav}>

            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.navButton}
            >

              <Text style={styles.navIcon}>
                🍴
              </Text>

              <Text style={styles.navText}>
                Home
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.navButton}
            >

              <Text style={styles.navIcon}>
                ❤️
              </Text>

              <Text style={styles.navText}>
                Saved
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.navButton}
            >

              <Text style={styles.navIcon}>
                🎙
              </Text>

              <Text style={styles.navText}>
                AI Chef
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.navButton}
            >

              <Text style={styles.navIcon}>
                ⚙️
              </Text>

              <Text style={styles.navText}>
                Settings
              </Text>

            </TouchableOpacity>

          </View>

</ScrollView>
  </LinearGradient>

</>

);

}

const styles = StyleSheet.create({
glowTop: {
  pointerEvents: "none",
  position: "absolute",

  width: 280,
  height: 280,

  borderRadius: 200,

  backgroundColor:
    "rgba(201,168,106,0.18)",

  top: -60,
  right: -80,

  zIndex: 0,
},

glowBottom: {
  pointerEvents: "none",
  position: "absolute",

  width: 320,
  height: 320,

  borderRadius: 220,

  backgroundColor:
    "rgba(77,124,90,0.18)",

  bottom: -120,
  left: -120,

  zIndex: 0,
},
  splashContainer: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
  },

  splashImage: {
    width: "100%",
    height: "100%",
  },

  container: {
    zIndex: 1,
    flexGrow: 1,
    alignItems: "center",
    gap: 10,
    paddingTop: 90,
    paddingHorizontal: 20,
    paddingBottom: 120,
  perspective: "1000",
   
  },
heroCard: {
  width: "100%",

  paddingVertical: 35,
  paddingHorizontal: 25,

  borderRadius: 34,

  marginBottom: 30,

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.12)",

  backgroundColor:
  "rgba(255,255,255,0.12)",

  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 14,
  },

  shadowOpacity: 0.38,
  shadowRadius: 32,

  elevation: 22,
},
  title: {
    fontSize: 42,
    fontFamily: "PlayfairDisplay_700Bold",
    color: "#2E4A3D",
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    color: "#6D7C73",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 28,
  },
themeRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
    marginBottom: 25,
},

themeButton: {
  backgroundColor: "#EAEAEA",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
},

themeButtonText: {
  color: "#333",
  fontWeight: "600",
},
  filterRow: {
    flexDirection: "row",
    marginBottom: 20,
        flexWrap: "wrap",
    justifyContent: "center",
  },
filterButton: {
  backgroundColor:
    "rgba(255,255,255,0.08)",

  paddingVertical: 14,
  paddingHorizontal: 20,

  borderRadius: 28,

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.12)",

  marginHorizontal: 6,
  marginVertical: 6,

  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 6,
  },

  shadowOpacity: 0.18,
  shadowRadius: 10,

  elevation: 6,
},

activeFilterButton: {
  backgroundColor: "#4D7C5A",

  shadowColor: "#C9A86A",

  shadowOffset: {
    width: 0,
    height: 10,
  },

  shadowOpacity: 0.45,
  shadowRadius: 18,

  elevation: 12,

  borderColor:
    "rgba(255,255,255,0.25)",
},
  filterText: {
  color: "#2E4A3D",
  fontWeight: "600",
},
aiOrb: {
  width: 90,
  height: 90,

  borderRadius: 999,

  marginBottom: 24,

  justifyContent: "center",
  alignItems: "center",

  backgroundColor:
    "rgba(201,168,106,0.22)",

  borderWidth: 1.5,

  borderColor:
    "rgba(255,255,255,0.18)",

  shadowColor: "#C9A86A",

  shadowOffset: {
    width: 0,
    height: 0,
  },

  shadowOpacity: 0.85,

  shadowRadius: 28,

  elevation: 16,
},

orbCore: {
  position: "absolute",

  width: 42,
  height: 42,

  borderRadius: 999,

  backgroundColor:
    "rgba(255,255,255,0.75)",

  shadowColor: "#FFF",

  shadowOffset: {
    width: 0,
    height: 0,
  },

  shadowOpacity: 0.8,

  shadowRadius: 18,
},

orbRing: {
  position: "absolute",

  width: 120,
  height: 120,

  borderRadius: 999,

  borderWidth: 1.5,

  borderColor:
    "rgba(255,255,255,0.16)",
},
chefIntro: {
  fontSize: 16,
  fontStyle: "italic",
  textAlign: "center",

  marginBottom: 24,

  paddingHorizontal: 20,

  lineHeight: 24,
},

  button: {
  backgroundColor: "#4D7C5A",

  paddingVertical: 20,
  paddingHorizontal: 40,

  borderRadius: 40,

  marginBottom: 45,

  shadowColor: "#C9A86A",

  shadowOffset: {
    width: 0,
    height: 12,
  },

  shadowOpacity: 0.45,
  shadowRadius: 20,

  elevation: 14,

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.15)",
},

 buttonText: {
  color: "white",
  fontSize: 18,
  fontFamily: "Poppins_600SemiBold",
},

loadingCard: {
  borderWidth: 1,
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.08)",

  padding: 30,
  borderRadius: 32,
  alignItems: "center",
  marginBottom: 30,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 10,

  },

  shadowOpacity: 0.25,
  shadowRadius: 20,

  elevation: 12,

  borderColor: "rgba(255,255,255,0.15)",
},

  loadingTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E4A3D",
    marginTop: 20,
    marginBottom: 10,
  },

  loadingText: {
    fontSize: 16,
    color: "#7B8B82",
    textAlign: "center",
  },

  previewImage: {
    width: "100%",
    height: 260,
    borderRadius: 30,
    marginBottom: 24,
  },
  card: {
  borderWidth: 1,
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.10)",
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

  borderColor: "rgba(255,255,255,0.15)",
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

secondaryButton: {
  width: "100%",

  paddingVertical: 18,

  borderRadius: 28,

  alignItems: "center",

  marginBottom: 25,

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.12)",
},

secondaryButtonText: {
  fontSize: 17,
  fontWeight: "600",
},

voiceButton: {
  width: "100%",

  paddingVertical: 18,

  borderRadius: 28,

  alignItems: "center",

  marginBottom: 25,

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.12)",

  shadowColor: "#C9A86A",

  shadowOffset: {
    width: 0,
    height: 8,
  },

  shadowOpacity: 0.35,

  shadowRadius: 18,

  elevation: 10,
},

voiceButtonText: {
  fontSize: 17,

  fontWeight: "700",
},

bottomNav: {
  width: "100%",

  flexDirection: "row",

  justifyContent: "space-around",

  alignItems: "center",

  paddingVertical: 18,

  borderRadius: 32,

  marginTop: 20,

  backgroundColor:
    "rgba(255,255,255,0.08)",

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.12)",

  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 10,
  },

  shadowOpacity: 0.25,

  shadowRadius: 20,

  elevation: 12,
},

navButton: {
  alignItems: "center",

  gap: 6,
},

navIcon: {
  fontSize: 22,
},

navText: {
  color: "white",

  fontSize: 13,

  fontWeight: "600",
},
detectedContainer: {
  width: "100%",
  marginBottom: 20,
},

detectedTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "white",
  marginBottom: 14,
},

chipWrap: {
  flexDirection: "row",
  flexWrap: "wrap",
},
cravingTitle: {
  fontSize: 26,
  fontWeight: "bold",
  color: "white",
  textAlign: "center",

  textShadowColor: "#C9A86A",
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 6,

  marginTop: 20,
  marginBottom: 8,
},
cravingDescription: {
  fontSize: 15,
  color: "white",
  textAlign: "center",

  textShadowColor: "rgba(201,168,106,0.8)",
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 3,

  marginBottom: 15,
  paddingHorizontal: 25,
},

cravingInput: {
  backgroundColor: "white",
  borderRadius: 18,
  paddingHorizontal: 18,
  paddingVertical: 14,
  fontSize: 16,
  marginBottom: 12,
},

exampleText: {
  color: "rgba(255,255,255,0.85)",
  textAlign: "center",
  fontSize: 14,

  textShadowColor: "rgba(201,168,106,0.6)",
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 2,

  marginBottom: 20,
  paddingHorizontal: 20,
},
});








