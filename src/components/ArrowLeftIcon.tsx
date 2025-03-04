import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useStyles } from "react-native-unistyles";

const ArrowLeftIcon = () => {
  const { theme } = useStyles();

  return (
    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
      <FontAwesome6
        name="chevron-left"
        size={RFValue(24)}
        color={theme.Colors.typography}
      />
    </TouchableOpacity>
  );
};

export default ArrowLeftIcon;
