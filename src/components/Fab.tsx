import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";

const Fab = () => {
  // Shared values for icon positions
  const firstValue = useSharedValue(10);
  const secondValue = useSharedValue(10);
  const thirdValue = useSharedValue(10);
  const isOpen = useSharedValue(false);

  // Derive a progress value to animate the rotation of the plus icon
  const progress = useDerivedValue(() => withTiming(isOpen.value ? 1 : 0));

  // Helper: returns an animated style based on the shared value and its open target
  const getIconStyle = (animatedValue, openTarget) =>
    useAnimatedStyle(() => ({
      bottom: animatedValue.value,
      transform: [
        {
          scale: interpolate(
            animatedValue.value,
            [30, openTarget],
            [0, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    }));

  const firstIcon = getIconStyle(firstValue, 130);
  const secondIcon = getIconStyle(secondValue, 210);
  const thirdIcon = getIconStyle(thirdValue, 290);

  const plusIcon = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 45}deg` }],
  }));

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };

    if (isOpen.value) {
      // Close the FAB: animate icons back to a hidden state
      firstValue.value = withTiming(10, config);
      secondValue.value = withDelay(50, withTiming(10, config));
      thirdValue.value = withDelay(100, withTiming(10, config));
    } else {
      // Open the FAB: animate icons to their respective target positions
      firstValue.value = withDelay(200, withSpring(130));
      secondValue.value = withDelay(100, withSpring(210));
      thirdValue.value = withSpring(290);
    }
    isOpen.value = !isOpen.value;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentContainer, thirdIcon]}>
        <View style={styles.iconContainer}>
          <Ionicons name="create" size={moderateScale(20)} color="white" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.contentContainer, secondIcon]}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            handlePress();
            router.navigate("/(main)/new_group");
          }}
        >
          <Ionicons name="people" size={moderateScale(20)} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.contentContainer, firstIcon]}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="chatbubble-ellipses"
            size={moderateScale(20)}
            color="white"
          />
        </View>
      </Animated.View>

      <Pressable style={styles.contentContainer} onPress={handlePress}>
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <Ionicons name="add" size={moderateScale(20)} color="white" />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default Fab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: Colors.primary[500],
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: moderateScale(30),
  },
  iconContainer: {
    width: moderateScale(45),
    height: moderateScale(45),
    justifyContent: "center",
    alignItems: "center",
  },
});
