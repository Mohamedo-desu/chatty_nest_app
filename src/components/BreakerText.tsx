import { Fonts } from "@/constants/Fonts";
import React, { FC } from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "./CustomText";

const BreakerText: FC<{ text: string }> = ({ text }) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.breakerContainer}>
      <View style={styles.horizontalLine} />
      <CustomText fontFamily={Fonts.Medium} style={styles.breakerText}>
        {text}
      </CustomText>
      <View style={styles.horizontalLine} />
    </View>
  );
};

export default BreakerText;

const stylesheet = createStyleSheet((theme) => ({
  breakerContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    overflow: "hidden",
    width: "100%",
    marginVertical: 20,
  },
  horizontalLine: {
    height: 1,
    width: "100%",
    position: "absolute",
    backgroundColor: theme.Colors.gray[200],
    zIndex: -1,
  },
  breakerText: {
    opacity: 0.8,
    backgroundColor: theme.Colors.background,
    paddingHorizontal: 15,
  },
}));
