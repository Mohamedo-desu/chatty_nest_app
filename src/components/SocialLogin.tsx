import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { FC } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SocialLogin: FC = () => {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  const { styles } = useStyles(stylesheet);

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Google OAuth Error:", error);
    }
  };

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
