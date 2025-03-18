// ChatDetailsScreen.tsx
import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { formatRelativeTime } from "@/utils/timeUtils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PaperAirplaneIcon } from "react-native-heroicons/solid";
// Import KeyboardAvoidingView from react-native-keyboard-controller (NOT from react-native)
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

dayjs.extend(relativeTime);
dayjs.locale("en");

const ChatDetailsScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { conversationId, name, photo, push_tokens, other_user_id } =
    useLocalSearchParams<{
      conversationId: string;
      photo: string;
      name: string;
    }>();

  const { fetchMessagesForConversation, sendMessage, error } = useChatStore();
  const { currentUser } = useUserStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  // Load messages and scroll to bottom when messages are loaded.
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    const msgs = await fetchMessagesForConversation(conversationId);
    if (msgs) {
      setMessages(msgs);
      // Ensure that after loading, the FlatList scrolls to the bottom.
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
    setLoading(false);
  }, [conversationId, fetchMessagesForConversation]);

  useEffect(() => {
    loadMessages();
  }, [conversationId, loadMessages]);

  // Subscribe for new messages; append them and scroll to bottom.
  useEffect(() => {
    if (!conversationId) return;
    const subscription = client
      .channel(`messages-${conversationId}-channel`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new]);
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(subscription);
    };
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId) return;
    setNewMessage("");
    await sendMessage(
      conversationId,
      newMessage,
      other_user_id,
      JSON.parse(push_tokens)
    );
    // New messages are appended via realtime subscription.
  };

  // Render each message bubble, applying different styles based on the sender.
  const renderMessage = ({ item }: { item: any }) => {
    const isSender = item.sender_id === currentUser?.user_id;
    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <Text style={[styles.messageText, isSender && styles.senderText]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>
          {formatRelativeTime(item.created_at)}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <CustomText variant="h7">{error}</CustomText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: name,
          headerRight: () => (
            <Image
              source={{ uri: photo }}
              contentFit="cover"
              style={{ width: 40, aspectRatio: 1, borderRadius: 20 }}
              transition={300}
            />
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // Adjust vertical offset for proper input visibility
        keyboardVerticalOffset={moderateScale(60)}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => `${item.created_at}-${index}`}
          renderItem={renderMessage}
          contentContainerStyle={[
            messages.length === 0 ? styles.centered : styles.messagesContainer,

            { paddingBottom: moderateScale(40) },
          ]}
          // When content size changes (new message added), scroll to bottom.
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>
                No messages in this conversation.
              </CustomText>
            </View>
          )}
        />
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={theme.Colors.gray[400]}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <PaperAirplaneIcon size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default ChatDetailsScreen;

const stylesheet = createStyleSheet((theme, rt) => ({
  flex: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    padding: moderateScale(10),
  },
  messageBubble: {
    marginVertical: moderateScale(4),
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    maxWidth: "80%",
  },
  senderBubble: {
    alignSelf: "flex-end",
    backgroundColor: theme.Colors.primary,
  },
  receiverBubble: {
    alignSelf: "flex-start",
    backgroundColor: theme.Colors.gray[100],
  },
  messageText: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: theme.Colors.typography,
  },
  senderText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: RFValue(10),
    fontFamily: Fonts.Regular,
    color: theme.Colors.gray[300],
    marginTop: moderateScale(4),
    textAlign: "right",
  },
  inputWrapper: {
    backgroundColor: theme.Colors.background,
    paddingHorizontal: moderateScale(10),
    paddingBottom: rt.insets.bottom || moderateScale(10),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.Colors.gray[100],
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
  },
  textInput: {
    flex: 1,
    fontSize: RFValue(14),
    color: theme.Colors.typography,
    paddingHorizontal: moderateScale(8),
    maxHeight: moderateScale(100),
  },
  sendButton: {
    marginLeft: moderateScale(8),
    backgroundColor: theme.Colors.primary,
    borderRadius: moderateScale(20),
    padding: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: theme.Colors.gray[200],
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));
