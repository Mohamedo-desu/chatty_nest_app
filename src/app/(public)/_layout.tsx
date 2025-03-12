import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

const PublicLayout = () => {
  // Call all hooks unconditionally at the top
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href={"/(authenticated)/(tabs)/home"} />;

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="sign_in"
        options={{
          headerTitle: t("public.sign_in"),
        }}
      />
      <Stack.Screen
        name="sign_up"
        options={{
          headerTitle: t("public.sign_up"),
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
          headerTitle: t("public.forgot_password"),
        }}
      />
      <Stack.Screen
        name="reset_password"
        options={{
          headerTitle: t("public.reset_password"),
        }}
      />
    </Stack>
  );
};

export default PublicLayout;
