import React from "react";

import {
  Text,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";

export default function BackButton() {

  return (

    <TouchableOpacity

      onPress={() => router.back()}

      style={{
        backgroundColor: "#2E4A3D",

        paddingVertical: 14,

        paddingHorizontal: 20,

        borderRadius: 14,

        marginBottom: 24,

        alignSelf: "flex-start",
      }}
    >

      <Text
        style={{
          color: "white",

          fontSize: 16,

          fontWeight: "700",
        }}
      >
        ← Back
      </Text>

    </TouchableOpacity>

  );

}