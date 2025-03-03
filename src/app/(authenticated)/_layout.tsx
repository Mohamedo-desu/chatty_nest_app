import { useUser } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React from "react";

const AuthenticatedLayout = () => {
  const { user } = useUser();

  // if (!user) return <Redirect href={"/(public)"} />;

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="edit_profile"
        options={{
          headerTitle: "Edit Profile",
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
