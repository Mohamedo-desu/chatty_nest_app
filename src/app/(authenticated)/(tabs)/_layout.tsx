import CustomTabBar from "@/components/tab/CustomTabBar";
import { Colors } from "@/constants/Colors";
import { DEVICE_WIDTH } from "@/utils/device";
import { Tabs } from "expo-router";
import React from "react";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  Cog8ToothIcon,
  HomeIcon,
  UserCircleIcon,
} from "react-native-heroicons/solid";
import { useStyles } from "react-native-unistyles";

const TabsLayout = () => {
  const { theme } = useStyles();
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
          tabBarBadge: 10,
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarIcon: ({ color, size }) => (
            <ChatBubbleOvalLeftEllipsisIcon color={color} size={size} />
          ),
          tabBarBadge: 99,
          tabBarLabel: "Chats",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserCircleIcon color={color} size={size} />
          ),
          tabBarLabel: "Profile",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Cog8ToothIcon color={color} size={size} />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
