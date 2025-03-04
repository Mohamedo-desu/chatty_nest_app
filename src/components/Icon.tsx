import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { FC } from "react";

interface IconProps {
  color?: string;
  size: number;
  name:
    | keyof typeof Ionicons.glyphMap &
        keyof typeof MaterialCommunityIcons.glyphMap &
        keyof typeof MaterialIcons.glyphMap;

  iconFamily: "Ionicons" | "MaterialCommunityIcons" | "MaterialIcons";
}

const Icon: FC<IconProps> = ({ color, size, name, iconFamily }) => {
  return (
    <>
      {iconFamily === "Ionicons" && (
        <Ionicons name={name} size={size} color={color} />
      )}
      {iconFamily === "MaterialIcons" && (
        <MaterialIcons name={name} size={size} color={color} />
      )}
      {iconFamily === "MaterialCommunityIcons" && (
        <MaterialCommunityIcons name={name} size={size} color={color} />
      )}
    </>
  );
};

export default Icon;
