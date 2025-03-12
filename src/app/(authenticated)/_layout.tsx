import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const AuthenticatedLayout = () => {
  const { user } = useUser();

  if (!user) return <Redirect href={"/(public)"} />;

  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const { data, error } = await client
          .from("users")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          throw error;
        }
        if (data) {
          setCurrentUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="edit_profile"
        options={{
          headerTitle: t("authenticated.edit_profile"),
        }}
      />

      <Stack.Screen
        name="privacy_settings"
        options={{
          headerTitle: t("authenticated.privacy_settings"),
        }}
      />
      <Stack.Screen
        name="message_filtering"
        options={{
          headerTitle: t("authenticated.message_filtering"),
        }}
      />
      <Stack.Screen
        name="notifications_settings"
        options={{
          headerTitle: t("authenticated.notifications_settings"),
        }}
      />
      <Stack.Screen
        name="add_post"
        options={{
          headerTitle: t("authenticated.add_post"),
        }}
      />
      <Stack.Screen
        name="add_chat"
        options={{
          headerTitle: t("authenticated.add_chat"),
        }}
      />
      <Stack.Screen
        name="blocked_accounts"
        options={{
          headerTitle: t("authenticated.blocked_accounts"),
        }}
      />
      <Stack.Screen
        name="chat_details"
        options={{
          headerTitle: t("authenticated.chat_details"),
        }}
      />
      <Stack.Screen
        name="data_usage"
        options={{
          headerTitle: t("authenticated.data_usage"),
        }}
      />
      <Stack.Screen
        name="group_details"
        options={{
          headerTitle: t("authenticated.group_details"),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: t("authenticated.profile"),
        }}
      />
      <Stack.Screen
        name="restricted_accounts"
        options={{
          headerTitle: t("authenticated.restricted_accounts"),
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AuthenticatedLayout;
