import CustomText from "@/components/CustomText";
import ChatCard from "@/components/ui/ChatCard";
import { Colors } from "@/constants/Colors";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const ChatsScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { chatItems, fetchChats, error } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useUserStore();

  useEffect(() => {
    onRefresh();
  }, []);

  const handleNewChatEvent = (payload: any) => {
    const newConversation = payload.new;

    console.log("New conversation:", newConversation);

    if (newConversation.participants.includes(currentUser.user_id)) {
      fetchChats();
    }
  };

  // Set up realtime listener for new chats
  useEffect(() => {
    const subscription = client
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
          filter: "chat_type=eq.one_to_one",
        },
        handleNewChatEvent
      )
      .subscribe();
    return () => {
      client.removeChannel(subscription);
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <ChatCard item={item} currentUser={currentUser} />
  );

  return (
    <FlatList
      style={styles.page}
      contentContainerStyle={styles.contentContainerStyle}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.white]}
          progressBackgroundColor={Colors.primary}
        />
      }
      data={chatItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.conversation_id}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <CustomText variant="h7" style={styles.emptyText}>
            {error ? error : "You have no chats yet"}
          </CustomText>
        </View>
      )}
    />
  );
};

export default ChatsScreen;

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainerStyle: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 15,
    paddingTop: rt.insets.top,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: RFValue(14),
    fontFamily: "Medium",
    color: theme.Colors.gray[200],
  },
}));
