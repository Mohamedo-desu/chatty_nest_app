import CustomText from "@/components/CustomText";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const index = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.page}>
      <CustomText style={styles.text}>index</CustomText>
    </View>
  );
};

export default index;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.Colors.background,
  },
  text: { color: theme.Colors.typography },
}));
