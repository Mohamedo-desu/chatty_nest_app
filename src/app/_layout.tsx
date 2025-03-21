import ToastConfig from "@/components/toast/ToastConfig";
import { Colors } from "@/constants/Colors";
import { tokenCache } from "@/utils/cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as Sentry from "@sentry/react-native";
import CustomThemeProvider from "CustomThemeProvider";
import * as Notifications from "expo-notifications";
import * as QuickActions from "expo-quick-actions";
import {
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, LogBox, Platform, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { vexo } from "vexo-analytics";
import "../translations/i18n";
import "../unistyle/unistyles";

LogBox.ignoreLogs([
  "Clerk: Clerk has been loaded with development keys",
  "Warning: TNodeChildrenRenderer:",
  "Warning: MemoizedTNodeRenderer:",
  "Warning: TRenderEngineProvider:",
  "Warning: bound renderChildren:",
]);

const manifest = Updates.manifest;
const metadata = "metadata" in manifest ? manifest.metadata : undefined;
const extra = "extra" in manifest ? manifest.extra : undefined;
const updateGroup =
  metadata && "updateGroup" in metadata ? metadata.updateGroup : undefined;

vexo(process.env.EXPO_PUBLIC_VEXO_KEY!);

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

const CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
    }),
    Sentry.spotlightIntegration(),
    navigationIntegration,
  ],
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  debug: false,
  enableAutoSessionTracking: true,
  attachScreenshot: true,
  attachStacktrace: true,
  enableAutoPerformanceTracing: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const scope = Sentry.getGlobalScope();

scope.setTag("expo-update-id", Updates.updateId);
scope.setTag("expo-is-embedded-update", Updates.isEmbeddedLaunch);

if (typeof updateGroup === "string") {
  scope.setTag("expo-update-group-id", updateGroup);

  const owner = extra?.expoClient?.owner ?? "[account]";
  const slug = extra?.expoClient?.slug ?? "[project]";
  scope.setTag(
    "expo-update-debug-url",
    `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
  );
} else if (Updates.isEmbeddedLaunch) {
  // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
  scope.setTag("expo-update-debug-url", "not applicable for embedded updates");
}

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

const InitialLayout = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  const { styles } = useStyles(stylesheet);

  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(authenticated)";
    const inPublicGroup = segments[0] === "(public)";

    if (isSignedIn && !inAuthGroup) {
      router.replace("/(authenticated)/(tabs)/home");
    } else if (!isSignedIn && !inPublicGroup) {
      router.replace("/(public)");
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color={Colors.primary} />
      </View>
    );
  }

  return (
    <CustomThemeProvider>
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="(public)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(authenticated)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="theme_settings"
            options={{
              headerTitle: t("main.theme_settings"),
            }}
          />
          <Stack.Screen
            name="help_center"
            options={{
              headerTitle: t("main.help_center"),
            }}
          />
          <Stack.Screen
            name="help"
            options={{
              headerTitle: t("main.help"),
            }}
          />
          <Stack.Screen
            name="language_settings"
            options={{
              headerTitle: t("main.language_settings"),
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              headerTitle: t("main.about"),
            }}
          />
        </Stack>
      </ClerkLoaded>
    </CustomThemeProvider>
  );
};

const RootLayout = () => {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
    QuickActions.setItems([
      {
        title: "Wait! Don't delete me!",
        subtitle: "We're here to help",
        icon:
          Platform.OS === "ios"
            ? "symbol:person.crop.circle.badge.questionmark"
            : "help_icon",
        id: "0",
        params: { href: "/help" },
      },
    ]);
  }, [ref]);

  const { top } = useSafeAreaInsets();

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <KeyboardProvider>
        <InitialLayout />
      </KeyboardProvider>

      <Toast config={ToastConfig} position="top" topOffset={top + 15} />
    </ClerkProvider>
  );
};

export default Sentry.wrap(RootLayout);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
}));
