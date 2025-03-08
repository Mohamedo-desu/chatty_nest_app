import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const FollowingsScreen = () => {
  const { styles, theme } = useStyles(stylesheet);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getFollowingsScreenPosts = async () => {
      try {
      } catch (error) {
      } finally {
      }
    };
  }, []);

  return (
    <FlatList
      style={styles.page}
      contentContainerStyle={styles.contentContainerStyle}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
          colors={[Colors.white]}
          progressBackgroundColor={Colors.primary}
        />
      }
      data={[]}
      renderItem={() => <View />}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <CustomText variant="h7" style={styles.emptyText}>
            No posts from your followings
          </CustomText>
        </View>
      )}
    />
  );
};

export default FollowingsScreen;

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainerStyle: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 15,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: moderateScale(14),
    fontFamily: "Medium",
    color: theme.Colors.gray[200],
  },
}));
