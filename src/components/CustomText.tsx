import { Fonts } from "@/constants/Fonts";
import React, { FC } from "react";
import { Platform, Text, TextProps, TextStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7";
type PlatformType = "ios" | "android";

// Extend TextProps so that any valid text prop is allowed
interface CustomTextProps extends TextProps {
  variant?: Variant;
  fontFamily?: Fonts;
  fontSize?: number;
}

const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
  h1: { android: 24, ios: 22 },
  h2: { android: 22, ios: 20 },
  h3: { android: 20, ios: 18 },
  h4: { android: 18, ios: 16 },
  h5: { android: 16, ios: 14 },
  h6: { android: 12, ios: 10 },
  h7: { android: 10, ios: 9 },
};

const CustomText: FC<CustomTextProps> = ({
  variant,
  fontFamily = Fonts.Regular,
  fontSize,
  style,
  children,
  ...props
}) => {
  const { styles } = useStyles(stylesheet);

  let computedFontSize: number =
    Platform.OS === "android"
      ? RFValue(fontSize || 12)
      : RFValue(fontSize || 10);

  if (variant && fontSizeMap[variant]) {
    const defaultSize = fontSizeMap[variant][Platform.OS as PlatformType];
    computedFontSize = RFValue(fontSize || defaultSize);
  }

  const fontFamilyStyle: TextStyle = { fontFamily };

  return (
    <Text
      style={[
        styles.text,
        { fontSize: computedFontSize },
        fontFamilyStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;

const stylesheet = createStyleSheet((theme) => ({
  text: {
    color: theme.Colors.typography,
  },
}));
