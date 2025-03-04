import { Colors } from "@/constants/Colors";
import { useSettingsStore } from "@/store/settingsStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useQuickActionRouting } from "expo-quick-actions/router";
import { StatusBar } from "expo-status-bar";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { UnistylesRuntime } from "react-native-unistyles";

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.black,
    card: Colors.darkGray[100],
    text: Colors.white,
    border: Colors.darkGray[200],
    notification: Colors.secondary,
    gray: {
      500: "#B0B0B0",
      400: "#8A8A8A",
      300: "#545454",
      200: "#333333",
      100: "#1B1B1B",
      50: "#1b1a1a",
    },
  },
};

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.white,
    card: Colors.lightGray[100],
    text: Colors.black,
    border: Colors.lightGray[200],
    notification: Colors.secondary,
    gray: {
      500: "#9E9E9E",
      400: "#BDBDBD",
      300: "#E0E0E0",
      200: "#EEEEEE",
      100: "#F5F5F5",
      50: "#fafafa",
    },
  },
};

const CustomThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useSettingsStore((state) => state.theme);
  const colorScheme = useColorScheme();

  const selectedTheme: any = useMemo(() => {
    const useSystemTheme = theme === "system";
    const appliedTheme = useSystemTheme ? colorScheme : theme;

    UnistylesRuntime.setAdaptiveThemes(useSystemTheme);
    return appliedTheme;
  }, [theme, colorScheme]);

  useEffect(() => {
    const isDarkTheme = selectedTheme === "dark";

    const navBarColor = isDarkTheme ? Colors.black : Colors.white;

    UnistylesRuntime.setTheme(selectedTheme);
    UnistylesRuntime.navigationBar.setColor(navBarColor);
    UnistylesRuntime.setRootViewBackgroundColor(navBarColor);
  }, [selectedTheme]);

  const currentNavigationTheme = useMemo(
    () => (selectedTheme === "dark" ? customDarkTheme : customLightTheme),
    [selectedTheme]
  );
  useQuickActionRouting();

  return (
    <NavigationThemeProvider value={currentNavigationTheme}>
      {children}
      <StatusBar
        style={selectedTheme === "dark" ? "light" : "dark"}
        backgroundColor={selectedTheme === "dark" ? Colors.black : Colors.white}
      />
    </NavigationThemeProvider>
  );
};

export default CustomThemeProvider;
