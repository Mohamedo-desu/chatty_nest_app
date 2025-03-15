import { Colors } from "@/constants/Colors";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";
const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);
const _layout = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();
  return (
    <MaterialTopTabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: theme.Colors.gray[300],
        indicatorStyle: styles.indicator,
        activeColor: Colors.primary,
        pressColor: "transparent",
        tabBarPressColor: "transparent",
        tabBarPressOpacity: 0,
        style: styles.tabBarStyle,
        tabBarStyle: styles.container,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        swipeEnabled: false,
      })}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{ title: t("home.index") }}
      />
      <MaterialTopTabs.Screen
        name="followings"
        options={{ title: t("home.followings") }}
      />
    </MaterialTopTabs>
  );
};

export default _layout;

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    marginTop: rt.insets.top,
    backgroundColor: theme.Colors.background,
    elevation: 0,
  },
  indicator: {
    backgroundColor: theme.Colors.primary,
    height: 2,
  },
  tabBarLabelStyle: {
    textTransform: "capitalize",
    fontFamily: theme.fonts.Medium,
    fontSize: RFValue(15),
  },
  tabBarStyle: {},
}));
