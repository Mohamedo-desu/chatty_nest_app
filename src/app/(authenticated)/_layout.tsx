import { useUser } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React from "react";

const AuthenticatedLayout = () => {
  const { user } = useUser();

  // if (!user) return <Redirect href={"/(public)"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthenticatedLayout;
