import { Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const Notifications = () => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={[styles.page, { backgroundColor: theme.Colors.background }]}>
      <Text style={[styles.text, { color: theme.Colors.typography }]}>
        Notifications
      </Text>
    </View>
  );
};

export default Notifications;

const stylesheet = createStyleSheet({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: moderateScale(24),
    fontFamily: "Medium",
  },
});
