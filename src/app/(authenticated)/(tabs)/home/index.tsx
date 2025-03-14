import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import PostCard from "@/components/ui/PostCard";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import {
  fetchPosts,
  getPostComments,
  getPostLikes,
} from "@/services/postService";
import { getUserData } from "@/services/userService";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { DEVICE_HEIGHT } from "@/utils/device";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

var limit = 0;

const ForYou = () => {
  const { styles } = useStyles(stylesheet);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { currentUser } = useUserStore();
  // Use posts and actions from our store
  const { posts, setPosts, updateInPostScreen } = usePostStore();

  const isFocused = useIsFocused();

  // Update the inPostScreen flag based on focus
  useEffect(() => {
    updateInPostScreen(isFocused);
  }, [isFocused]);

  const getForYouPosts = async () => {
    try {
      if (!hasMore) return;
      limit += 10;

      const res = await fetchPosts(limit);
      if (res) {
        if (posts.length === res.length || res.length === 0) setHasMore(false);
        setPosts(res);
      }
    } catch (error: any) {
      console.error(error);
      showToast("error", "Error", error.message);
    }
  };

  const handlePostEvent = async (payload: any) => {
    if (payload.eventType === "INSERT" && payload.new.id) {
      let newPost = { ...payload.new };
      const userData = await getUserData(newPost.user_id, false);
      const likesData = await getPostLikes(newPost.id, currentUser.user_id);
      const commentsData = await getPostComments(
        newPost.id,
        currentUser.user_id
      );
      newPost.user = userData ?? {};
      newPost.post_likes = likesData ?? [];
      newPost.post_comments = commentsData ?? [];
      setPosts([newPost, ...usePostStore.getState().posts]);
    }
  };

  useEffect(() => {
    // Subscribe to realtime post events.
    const postChannel = client
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    return () => {
      client.removeChannel(postChannel);
    };
  }, []);

  return (
    <FlatList
      style={styles.page}
      data={posts}
      contentContainerStyle={styles.contentContainerStyle}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        getForYouPosts().finally(() => setRefreshing(false));
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            getForYouPosts().finally(() => setRefreshing(false));
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
              marginVertical: posts.length === 0 ? DEVICE_HEIGHT / 3 : 30,
            }}
          >
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>No posts!</CustomText>
          </View>
        )
      }
      onEndReached={getForYouPosts}
      onEndReachedThreshold={0}
    />
  );
};

export default ForYou;

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainerStyle: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 5,
    paddingVertical: rt.insets.top,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: theme.Colors.gray[200],
    textAlign: "center",
  },
}));
