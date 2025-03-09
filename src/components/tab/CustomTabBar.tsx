import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { DEVICE_WIDTH } from "@/utils/device";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
} from "react-native-heroicons/solid";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const CustomTabBar: FC<BottomTabBarProps> = ({
  state,
  navigation,
  descriptors,
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const { routes, index: activeIndex } = state;
  const currentRoute = routes[activeIndex];

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = DEVICE_WIDTH / routes.length;
    return {
      width: tabWidth,
      left: withTiming(activeIndex * tabWidth, {
        duration: 300,
        easing: Easing.elastic(1),
      }),
    };
  });

  const showFab = currentRoute.name === "home" || currentRoute.name === "chats";

  return (
    <Animated.View>
      {showFab && (
        <Animated.View
          entering={ZoomIn}
          exiting={ZoomOut}
          style={styles.fabContainer}
        >
          {currentRoute.name === "chats" ? (
            <Animated.View
              entering={ZoomIn.duration(500).delay(80)}
              exiting={ZoomOut}
            >
              <TouchableOpacity
                onPress={() => router.navigate("/(authenticated)/add_chat")}
              >
                <ChatBubbleLeftRightIcon
                  strokeWidth={1.2}
                  color={Colors.white}
                  size={RFValue(20)}
                />
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View
              entering={ZoomIn.duration(500).delay(80)}
              exiting={ZoomOut.duration(500)}
            >
              <TouchableOpacity
                onPress={() => router.navigate("/(authenticated)/add_post")}
              >
                <PlusIcon color={Colors.white} size={RFValue(20)} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      )}
      <View>
        <View style={styles.tabBarStyle}>
          {routes.map((route, routeIndex) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = activeIndex === routeIndex;
            const activeColor = options.tabBarActiveTintColor || Colors.primary;
            const inactiveColor =
              options.tabBarInactiveTintColor || theme.Colors.gray[300];
            const color = isFocused ? activeColor : inactiveColor;
            const size = 24;

            const icon = options.tabBarIcon?.({
              focused: isFocused,
              color,
              size,
            });

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <View
                key={route.key}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onPress}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  style={styles.tabBarItemStyle}
                  hitSlop={10}
                >
                  {icon}
                  <CustomText
                    style={{ color, fontSize: 12 }}
                    variant="h7"
                    fontFamily={Fonts.Regular}
                  >
                    {typeof label === "string" ? label : ""}
                  </CustomText>
                  {options.tabBarBadge && (
                    <View style={styles.tabBarBadgeStyle}>
                      <CustomText variant="h7" style={{ color: "#fff" }}>
                        {options.tabBarBadge}
                      </CustomText>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <Animated.View style={[styles.slidingIndicator, indicatorStyle]} />
      </View>
    </Animated.View>
  );
};

export default CustomTabBar;

const stylesheet = createStyleSheet((theme, rt) => ({
  tabBarStyle: {
    height: 60,
    flexDirection: "row",
    backgroundColor: theme.Colors.background,
    borderTopWidth: 1,
    borderColor: theme.Colors.gray[200],
    elevation: 1,
  },
  tabBarItemStyle: {
    marginVertical: 0,
    alignItems: "center",
  },
  tabBarBadgeStyle: {
    backgroundColor: Colors.error,
    position: "absolute",
    top: -3,
    right: -3,
    width: 20,
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  slidingIndicator: {
    backgroundColor: theme.Colors.primary,
    position: "absolute",
    top: 0,
    height: 2,
  },
  fabContainer: {
    backgroundColor: theme.Colors.primary,
    height: 50,
    aspectRatio: 1,
    bottom: rt.insets.bottom + 45,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    right: 20,
    position: "absolute",
    elevation: 1,
  },
}));
