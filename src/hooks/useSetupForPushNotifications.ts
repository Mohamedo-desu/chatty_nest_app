import { Colors } from "@/constants/Colors";
import { getStoredValues, saveSecurely } from "@/store/storage";
import { client } from "@/supabase/config";
import { IS_ANDROID } from "@/utils/device";
import { debounce } from "@/utils/functions";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect } from "react";

const useSetupForPushNotifications = (userId: string) => {
  const registerForPushNotificationsAsync = useCallback(async () => {
    if (!userId) {
      console.warn(
        "User ID is undefined. Cannot register for push notifications."
      );
      return;
    }

    if (!Device.isDevice) {
      console.log("Push notifications are only supported on physical devices.");
      return;
    }

    try {
      let { pushTokenString } = await getStoredValues(["pushTokenString"]);
      if (pushTokenString) return;

      if (IS_ANDROID) {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: Colors.primary,
        });
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.warn("Notification permissions not granted.");
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        console.warn("Project ID is not defined. Cannot get push token.");
        return;
      }

      pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      const { error } = await client.rpc("add_push_token", {
        push_token: pushTokenString,
        p_user_id: userId,
      });

      saveSecurely([{ key: "pushTokenString", value: pushTokenString }]);

      if (error) {
        console.error("Error storing push token in Supabase:", error);
        return;
      }
    } catch (e: unknown) {
      console.error("An error occurred during push notification setup:", e);
    }
  }, [userId]);

  const debouncedFunction = useCallback(
    debounce(registerForPushNotificationsAsync, 1000),
    [registerForPushNotificationsAsync]
  );

  useEffect(() => {
    debouncedFunction();
  }, [debouncedFunction]);
};

export default useSetupForPushNotifications;
