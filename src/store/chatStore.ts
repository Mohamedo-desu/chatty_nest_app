import { client } from "@/supabase/config";
import { create } from "zustand";
import { useUserStore } from "./userStore";

export interface Message {
  content: string;
  created_at: string;
  sender_id: string;
  seen_by?: string[];
  received?: boolean;
}

export interface ChatItem {
  conversation_id: string;
  name?: string | null;
  photo?: string | null;
  lastMessageTime?: string;
  lastMessage?: {
    text: string;
    user: { id: string };
    seen?: boolean;
    received?: boolean;
  } | null;
  unseenCount?: number;
}

export interface SearchedUser {
  user_id: string;
  display_name: string;
  email_address: string;
  photo_url: string;
  conversation_id?: string | null;
}

interface ChatState {
  chatItems: ChatItem[];
  error: string | null;
  searchedUsers: SearchedUser[];
  fetchChats: () => Promise<void>;
  fetchMessagesForConversation: (
    conversationId: string
  ) => Promise<Message[] | undefined>;
  searchForUsers: (searchPhrase: string) => Promise<void>;
  createOneToOneChat: (otherUser: SearchedUser) => Promise<string | null>;
  sendMessage: (conversationId: string, message: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  chatItems: [],
  error: null,
  searchedUsers: [],

  // Fetch all conversations where the current user is a participant.
  fetchChats: async () => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser?.user_id) {
      set({ error: "No authenticated user" });
      return;
    }
    const uid = currentUser.user_id;
    const { data: convs, error: cerr } = await client
      .from("conversations")
      .select(
        "conversation_id, participants, updated_at, chat_type, conversation_name"
      )
      .contains("participants", [uid]);
    if (cerr) {
      set({ error: cerr.message });
      return;
    }
    if (!convs || convs.length === 0) {
      set({ chatItems: [] });
      return;
    }
    const chats = await Promise.all(
      convs.map(async (conv: any) => {
        let otherUserId: string | null = null;
        let name = conv.conversation_name || null;
        let photo: string | null = null;

        let pushTokens: string[] | null = null;
        if (
          conv.chat_type === "one_to_one" &&
          Array.isArray(conv.participants)
        ) {
          // Determine the other participant in a one-to-one chat
          otherUserId = conv.participants.find((p: string) => p !== uid);
          if (otherUserId) {
            const { data: userData, error: userError } = await client
              .from("users")
              .select("display_name, photo_url,push_tokens")
              .eq("user_id", otherUserId)
              .single();
            if (!userError && userData) {
              name = userData.display_name;
              otherUserId;
              photo = userData.photo_url;
              pushTokens = userData.push_tokens;
            }
          }
        }
        // Fetch the last message in the conversation.
        const { data: msgData, error: msgError } = await client
          .from("messages")
          .select("content, created_at, sender_id, seen_by, received")
          .eq("conversation_id", conv.conversation_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (msgError) {
          console.error("Error fetching last message:", msgError.message);
        }
        // Count messages not yet seen by the current user.
        // const { count: unseenCount } = await client
        //   .from("messages")
        //   .select("message_id", { count: "exact", head: true })
        //   .eq("conversation_id", conv.conversation_id)
        //   .or(`seen_by.is.null,seen_by.not.cs.{${uid}}`);

        return {
          conversation_id: conv.conversation_id,
          name,
          photo,
          otherUserId,
          push_tokens: pushTokens,
          lastMessageTime: msgData?.created_at || conv.updated_at,
          lastMessage: msgData
            ? {
                text: msgData.content,
                user: { id: msgData.sender_id },
                seen: msgData.seen_by ? msgData.seen_by.includes(uid) : false,
                received: msgData.received,
              }
            : null,
          unseenCount: 0,
        };
      })
    );
    set({ chatItems: chats, error: null });
  },

  // Fetch messages for a given conversation.
  fetchMessagesForConversation: async (conversationId: string) => {
    const { data: messages, error: msgError } = await client
      .from("messages")
      .select("content, created_at, sender_id, seen_by, received")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (msgError) {
      set({ error: msgError.message });
      return;
    }
    return messages as Message[];
  },

  // Search for users, and check if a one-to-one conversation already exists with them.
  searchForUsers: async (searchPhrase: string) => {
    if (!searchPhrase || searchPhrase.trim().length === 0) {
      set({ searchedUsers: [] });
      return;
    }
    const { currentUser } = useUserStore.getState();
    if (!currentUser || !currentUser.user_id) {
      set({ error: "No authenticated user", searchedUsers: [] });
      return;
    }
    const currentUserId = currentUser.user_id;
    const { data, error } = await client
      .from("users")
      .select("user_id, display_name, email_address, photo_url,push_tokens")
      .or(
        `display_name.ilike.%${searchPhrase}%,user_name.ilike.%${searchPhrase}%`
      )
      .neq("user_id", currentUserId);
    if (error) {
      set({ error: error.message, searchedUsers: [] });
      return;
    }
    const users = data as SearchedUser[];
    const updatedUsers: SearchedUser[] = await Promise.all(
      users.map(async (user) => {
        const { data: convData, error: convError } = await client
          .from("conversations")
          .select("conversation_id")
          .eq("chat_type", "one_to_one")
          .contains("participants", [currentUserId, user.user_id])
          .limit(1)
          .maybeSingle();
        user.conversation_id =
          !convError && convData ? convData.conversation_id : null;
        return user;
      })
    );
    set({ searchedUsers: updatedUsers, error: null });
  },

  // Create a new one-to-one conversation and add an initial message.
  createOneToOneChat: async (otherUser: SearchedUser) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser || !currentUser.user_id) {
      set({ error: "No authenticated user" });
      return null;
    }
    const { data: convData, error: convError } = await client
      .from("conversations")
      .insert({
        chat_type: "one_to_one",
        participants: [currentUser.user_id, otherUser.user_id],
      })
      .select("conversation_id")
      .single();
    if (convError || !convData) {
      set({ error: convError?.message || "Failed to create conversation" });
      return null;
    }
    const conversationId = convData.conversation_id;
    const initialMessage = `New chat from ${
      currentUser.display_name || "Unknown"
    }`;
    const { error: msgError } = await client.from("messages").insert({
      conversation_id: conversationId,
      content: initialMessage,
      sender_id: currentUser.user_id,
      created_at: new Date().toISOString(),
    });
    if (msgError) {
      set({ error: msgError.message });
      return null;
    }
    return conversationId;
  },

  // Send a message to a conversation.
  sendMessage: async (
    conversationId: string,
    message: string,
    other_user_id: string,
    push_tokens: string[]
  ) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser || !currentUser.user_id) {
      set({ error: "No authenticated user" });
      return;
    }

    console.log({ push_tokens });

    // Insert the message into the "messages" table.
    const { data, error } = await client
      .from("messages")
      .insert({
        conversation_id: conversationId,
        content: message,
        sender_id: currentUser.user_id,
        created_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      set({ error: error.message });
      console.error("Send message error:", error);
      return;
    } else {
      set({ error: null });
    }

    // If the sender and receiver are the same, don't send a notification.
    if (other_user_id === currentUser.user_id) {
      return data;
    }

    // Check notification settings for the recipient.
    const { data: settings, error: settingsError } = await client
      .from("notification_settings")
      .select("direct_messages_notifications")
      .eq("user_id", other_user_id)
      .maybeSingle();

    if (settingsError) {
      console.error("Notification settings error:", settingsError.message);
      return data;
    }

    // If settings don't exist or direct_messages is false, do not send a notification.
    if (!settings || !settings.direct_messages_notifications) {
      return data;
    }

    // Send a push notification if push tokens are available.
    if (Array.isArray(push_tokens) && push_tokens.length > 0) {
      const messageBody = `${
        currentUser.display_name || "Someone"
      } sent you a new message.`;
      const notificationPromises = push_tokens.map((token) => {
        const notificationMessage = {
          to: token,
          sound: "default",
          title: "New Message!",
          body: messageBody,
          data: {
            url: `/(authenticated)/chat_details?conversationId=${conversationId}`,
          },
        };

        return fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationMessage),
        });
      });

      await Promise.all(notificationPromises);
    }

    return data;
  },
}));
