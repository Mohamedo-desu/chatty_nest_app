import CustomTabBar from "@/components/tab/CustomTabBar";
import { Colors } from "@/constants/Colors";
import { DEVICE_WIDTH } from "@/utils/device";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  Cog8ToothIcon,
  HomeIcon,
  Squares2X2Icon,
} from "react-native-heroicons/solid";
import { useStyles } from "react-native-unistyles";

const TabsLayout = () => {
  const { theme } = useStyles();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: theme.Colors.gray[300],
        tabBarHideOnKeyboard: true,
        tabBarPosition: DEVICE_WIDTH > 768 ? "left" : "bottom",
      }}
      initialRouteName="home"
      backBehavior="initialRoute"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
          tabBarLabel: t("tabLayout.home"),
          tabBarBadge: 3,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Squares2X2Icon color={color} size={size} />
          ),
          tabBarLabel: t("tabLayout.explore"),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarIcon: ({ color, size }) => (
            <ChatBubbleOvalLeftEllipsisIcon color={color} size={size} />
          ),
          tabBarLabel: t("tabLayout.chats"),
          tabBarBadge: 5,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Cog8ToothIcon color={color} size={size} />
          ),
          tabBarLabel: t("tabLayout.settings"),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
