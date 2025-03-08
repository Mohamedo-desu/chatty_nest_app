import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";

const AuthenticatedLayout = () => {
  const { user } = useUser();

  if (!user) return <Redirect href={"/(public)"} />;

  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

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
          headerTitle: "Edit Profile",
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
