import { Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const UserPosts = () => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={[styles.page, { backgroundColor: theme.Colors.background }]}>
      <Text style={[styles.text, { color: theme.Colors.typography }]}>
        UserPosts
      </Text>
    </View>
  );
};

export default UserPosts;

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
