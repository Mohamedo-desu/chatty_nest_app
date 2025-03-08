import CustomText from "@/components/CustomText";
import ChatCard from "@/components/ui/ChatCard";
import { Colors } from "@/constants/Colors";
import dayjs from "dayjs";
import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Placeholder chat items array
const chatItems = [
  {
    photo: "https://i.pravatar.cc/200?img=1",
    name: "Alice",
    lastMessageTime: dayjs().subtract(10, "days").toISOString(),
    lastMessage: {
      user: { name: "Alice" },
      text: "Hey, how are you?",
      seen: false,
      received: true,
    },
  },
  {
    photo: "https://i.pravatar.cc/200?img=2",
    name: "Bob",
    lastMessageTime: dayjs().subtract(1, "hour").toISOString(),
    lastMessage: {
      user: { name: "Isra" }, // current user's name is "Isra"
      text: "I'm doing well, thanks!",
      seen: false,
      received: false,
    },
  },
  {
    photo: "https://i.pravatar.cc/200?img=3",
    name: "Charlie",
    lastMessageTime: dayjs().subtract(9, "hour").toISOString(),
    lastMessage: {
      user: { name: "Charlie" },
      text: "Let's catch up later.",
      seen: false,
      received: false,
    },
  },
  {
    photo: "https://i.pravatar.cc/200?img=4",
    name: "Dave",
    lastMessageTime: dayjs().subtract(10, "days").toISOString(),
    lastMessage: {
      user: { name: "Dave" },
      text: "Sorry, message failed to send.",
      // No flag provided—will fall back to the error icon.
    },
  },
];

const ChatsScreen = () => {
  const { styles } = useStyles(stylesheet);

  const [refreshing, setRefreshing] = useState(false);

  const renderItem = ({ item }: { item: (typeof chatItems)[0] }) => (
    <ChatCard item={item} />
  );

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
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <CustomText variant="h7" style={styles.emptyText}>
            You have no chats yet
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
