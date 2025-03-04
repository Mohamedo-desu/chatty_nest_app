import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import React, { FC, useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";

import { createStyleSheet, useStyles } from "react-native-unistyles";
import Icon from "./Icon";

const SocialLogin: FC = () => {
  // Generate a redirect URL based on the app's scheme
  const redirectUrl = Linking.createURL("/");

  // Google OAuth flow
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
    redirectUrl,
  });

  // Apple OAuth flow
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
    redirectUrl,
  });

  const { styles, theme } = useStyles(stylesheet);

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Google OAuth Error:", error);
    }
  };

  // Handle Apple OAuth
  const handleAppleAuth = async () => {
    try {
      const { createdSessionId, setActive } = await startAppleOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Apple OAuth Error:", error);
    }
  };

  // Listen for incoming deep links
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.socialContainer}>
      {/* Google OAuth Button */}
      <TouchableOpacity
        style={styles.iconContainer}
        activeOpacity={0.8}
        onPress={handleGoogleAuth}
      >
        <Image
          source={require("@/assets/images/google.png")}
          style={styles.gImg}
        />
      </TouchableOpacity>

      {/* Apple OAuth Button */}
      <TouchableOpacity
        style={styles.iconContainer}
        activeOpacity={0.8}
        onPress={handleAppleAuth}
      >
        <Icon
          iconFamily="Ionicons"
          name="logo-apple"
          size={RFValue(18)}
          color={theme.Colors.typography}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SocialLogin;

const stylesheet = createStyleSheet((theme) => ({
  gImg: {
    width: 20,
    height: 20,
    contentFit: "contain",
  },
  iconContainer: {
    flex: 1,
    height: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.Colors.gray[50],
    borderRadius: theme.border.xs,
    borderColor: theme.Colors.gray[200],
    borderWidth: 1,
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 60,
    marginVertical: 20,
    justifyContent: "center",
  },
}));
