import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React from "react";

const AuthenticatedLayout = () => {
  const { user } = useUser();

  if (!user) return <Redirect href={"/(public)"} />;

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="edit_profile"
        options={{
          headerTitle: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="change_password"
        options={{
          headerTitle: "Change Password",
        }}
      />
      <Stack.Screen
        name="privacy_settings"
        options={{
          headerTitle: "Privacy Settings",
        }}
      />
      <Stack.Screen
        name="message_filtering"
        options={{
          headerTitle: "Message Filtering",
        }}
      />
      <Stack.Screen
        name="notifications_settings"
        options={{
          headerTitle: "Notifications Settings",
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
