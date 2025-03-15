import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FC } from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "./CustomText";

import { TextStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  rightIcon?: string;
  errors?: string;
  touched?: boolean;
  value: string;
  onPressRightIcon?: () => void;
  handleChange: (value: string) => void;
  handleBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  style?: StyleProp<TextStyle>;
}

const CustomInput: FC<CustomInputProps> = ({
  placeholder,
  rightIcon,
  errors,
  touched,
  value,
  handleChange,
  handleBlur,
  onPressRightIcon,
  style,
  autoComplete,
  maxLength,
  keyboardType = "default",
  secureTextEntry = false,
  ...rest
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          autoCapitalize="none"
          cursorColor={Colors.primary}
          autoComplete={autoComplete}
          maxLength={maxLength}
          numberOfLines={1}
          placeholder={placeholder}
          style={[styles.input, style]}
          placeholderTextColor={theme.Colors.gray[400]}
          secureTextEntry={secureTextEntry}
          ref={rest.inputRef}
          {...rest}
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
      {errors && touched && (
        <CustomText variant="h7" style={styles.error}>
          {errors}
        </CustomText>
      )}
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
    height: moderateScale(45),
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
