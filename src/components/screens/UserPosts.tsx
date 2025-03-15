import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import PostCard from "@/components/ui/PostCard";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { fetchUserPosts } from "@/services/postService";
import { useUserStore } from "@/store/userStore";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

var limit = 0;

const UserPosts = () => {
  const { styles } = useStyles(stylesheet);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const { currentUser } = useUserStore();

  const getUserPosts = async () => {
    try {
      if (!hasMore) return;
      limit += 10;

      const res = await fetchUserPosts(limit, currentUser.user_id);
      if (res) {
        if (posts.length === res.length || res.length === 0) setHasMore(false);
        setPosts(res);
      }
    } catch (error: any) {
      console.error(error);
      showToast("error", "Error", error.message);
    }
  };

  return (
    <Tabs.FlatList
      style={styles.page}
      data={posts}
      contentContainerStyle={styles.contentContainerStyle}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            getUserPosts().finally(() => setRefreshing(false));
          }}
          colors={[Colors.white]}
          progressBackgroundColor={Colors.primary}
        />
      }
      renderItem={({ item }) => (
        <PostCard item={item} currentUser={currentUser} router={router} />
      )}
      keyExtractor={(item) => item.id.toString()}
      ListFooterComponent={
        hasMore ? (
          <View
            style={{
              marginVertical: posts.length === 0 ? 100 : 30,
            }}
          >
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>You have no posts!</CustomText>
          </View>
        )
      }
      onEndReached={getUserPosts}
      onEndReachedThreshold={0}
    />
  );
};

export default UserPosts;

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
    paddingVertical: rt.insets.top,
  },
  contentContainerStyle: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 5,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: theme.Colors.gray[200],
    textAlign: "center",
  },
}));
