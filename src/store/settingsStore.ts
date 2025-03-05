// src/store/settingsStore.ts
import { UnistylesThemes } from "react-native-unistyles";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";

export interface NotificationSettings {
  push_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  likes_notifications: boolean;
  comments_notifications: boolean;
  mentions_notifications: boolean;
  friend_requests_notifications: boolean;
  direct_messages_notifications: boolean;
  group_notifications: boolean;
  notification_sound: boolean;
  vibrate_on_notification: boolean;
}

export interface PrivacySettings {
  private_account: boolean;
  activity_status: boolean;
  read_receipts: boolean;
}

export interface MessageFilteringSettings {
  filterUnknown: boolean;
  filterExplicit: boolean;
  blockedKeywords: string[]; // stored as an array of strings
}

export interface SettingsState {
  theme: keyof UnistylesThemes | "system";
  setTheme: (theme: SettingsState["theme"]) => void;
  notificationSettings: NotificationSettings;
  setNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  privacySettings: PrivacySettings;
  setPrivacySettings: (settings: Partial<PrivacySettings>) => void;
  messageFilteringSettings: MessageFilteringSettings;
  setMessageFilteringSettings: (
    settings: Partial<MessageFilteringSettings>
  ) => void;
}

const defaultNotificationSettings: NotificationSettings = {
  push_notifications: true,
  email_notifications: false,
  sms_notifications: false,
  likes_notifications: true,
  comments_notifications: true,
  mentions_notifications: true,
  friend_requests_notifications: true,
  direct_messages_notifications: true,
  group_notifications: true,
  notification_sound: true,
  vibrate_on_notification: false,
};

const defaultPrivacySettings: PrivacySettings = {
  private_account: false,
  activity_status: true,
  read_receipts: true,
};

const defaultMessageFilteringSettings: MessageFilteringSettings = {
  filterUnknown: false,
  filterExplicit: false,
  blockedKeywords: [],
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme: SettingsState["theme"]) => set({ theme }),
      notificationSettings: defaultNotificationSettings,
      setNotificationSettings: (settings: Partial<NotificationSettings>) =>
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        })),
      privacySettings: defaultPrivacySettings,
      setPrivacySettings: (settings: Partial<PrivacySettings>) =>
        set((state) => ({
          privacySettings: { ...state.privacySettings, ...settings },
        })),
      messageFilteringSettings: defaultMessageFilteringSettings,
      setMessageFilteringSettings: (
        settings: Partial<MessageFilteringSettings>
      ) =>
        set((state) => ({
          messageFilteringSettings: {
            ...state.messageFilteringSettings,
            ...settings,
          },
        })),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
