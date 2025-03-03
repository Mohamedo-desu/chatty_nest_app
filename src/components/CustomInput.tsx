import { Colors } from "@/constants/Colors";
import React, { FC } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "./CustomText";

interface CustomInputProps {
  placeholder: string;
  rightIcon?: string | null;
  errors?: string;
  touched?: boolean;
  value: string;
  onPressRightIcon?: () => void;
  handleChange: (value: string) => void;
  handleBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  autoComplete?: TextInputProps["autoComplete"];
  maxLength?: number;
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
  style?: ViewStyle | ViewStyle[];
  props?: TextInputProps;
}

const CustomInput: FC<CustomInputProps> = ({
  placeholder,
  rightIcon,
  errors,
  touched,
  value,
  handleChange,
  handleBlur,
  autoComplete,
  maxLength,
  keyboardType,
  secureTextEntry,
  onPressRightIcon,
  style,
  props,
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          keyboardType={keyboardType || "default"}
          autoCapitalize="none"
          cursorColor={Colors.primary}
          autoComplete={autoComplete}
          maxLength={maxLength}
          numberOfLines={1}
          placeholder={placeholder}
          style={[styles.input, style]}
          placeholderTextColor={theme.Colors.gray[400]}
          secureTextEntry={secureTextEntry || false}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onPressRightIcon}
            style={styles.rightIconContainer}
          >
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={theme.Colors.gray[300]}
            />
          </TouchableOpacity>
        )}
      </View>
      {errors && touched ? (
        <CustomText variant="h7" style={styles.error}>
          {errors}
        </CustomText>
      ) : null}
    </>
  );
};

export default CustomInput;

const stylesheet = createStyleSheet((theme) => ({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.Colors.gray[50],
    borderRadius: theme.border.xs,
    borderWidth: 1,
    borderColor: theme.Colors.gray[200],
    paddingHorizontal: theme.margins.md,
    height: moderateScale(50),
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.Regular,
    fontSize: RFValue(14),
    color: theme.Colors.typography,
  },
  rightIconContainer: {
    marginLeft: theme.margins.sm,
  },
  error: {
    color: theme.Colors.error,
    fontSize: RFValue(12),
  },
}));
