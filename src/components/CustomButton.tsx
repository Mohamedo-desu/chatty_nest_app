import { Fonts } from "@/constants/Fonts";
import React, { FC } from "react";
import {
  ActivityIndicator,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "./CustomText";

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: FC<CustomButtonProps> = ({
  text,
  onPress,
  loading,
  style,
  textStyle = {},
}) => {
  const { styles } = useStyles(stylesheet);
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size={"small"} color="#fff" />
      ) : (
        <CustomText
          variant="h5"
          fontFamily={Fonts.Medium}
          style={[styles.buttonText, textStyle]}
        >
          {text}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const stylesheet = createStyleSheet(({ Colors, margins, border }) => ({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: border.xs,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: moderateScale(50),
  },
  buttonText: { textAlign: "center", color: "white" },
}));
