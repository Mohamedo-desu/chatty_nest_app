import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React from "react";

const PublicLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href={"/(authenticated)/(tabs)/home"} />;

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="sign_in"
        options={{
          headerTitle: "Sign In",
        }}
      />
      <Stack.Screen
        name="sign_up"
        options={{
          headerTitle: "Sign Up",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot_password"
        options={{
          headerTitle: "Forgot Password",
        }}
      />
      <Stack.Screen
        name="reset_password"
        options={{
          headerTitle: "Reset Password",
        }}
      />
    </Stack>
  );
};

export default PublicLayout;
