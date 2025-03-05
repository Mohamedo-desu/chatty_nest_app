import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as Yup from "yup";

// Define form values interface (bio added)
interface EditProfileFormValues {
  displayName: string;
  userName: string;
  birthDate: string;
  bio: string;
}

// Validation schema (bio is optional)
const validationSchema = Yup.object().shape({
  displayName: Yup.string().required("Display name is required"),
  userName: Yup.string()
    .matches(/^\S*$/, "UserName should not contain white space")
    .required("UserName is required"),
  birthDate: Yup.string().required("BirthDate is required"),
  bio: Yup.string(),
});

const EditProfile: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const userId = user?.id;
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const currentUser = useUserStore((state) => state.currentUser);

  const [profileImage, setProfileImage] = useState<string>(
    currentUser.photo_url || ""
  );
  const [coverImage, setCoverImage] = useState<string>(
    currentUser.cover_url || ""
  );

  // Returns MIME type based on file extension
  const getMimeType = (uri: string): string => {
    const ext = uri.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      default:
        return "image/jpeg";
    }
  };

  // Reusable function to upload an image to Supabase Storage.
  // It uploads the image to images/{userId}/{folder}/{fileName} and returns its public URL.
  const uploadImage = async (
    uri: string,
    folder: string,
    fileName: string
  ): Promise<string> => {
    // Read the file as a base64 string directly from the provided URI.
    const base64Data = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const fileData = decode(base64Data);
    const mimeType = getMimeType(uri);
    const storagePath = `${userId}/${folder}/${fileName}`;
    const { error } = await client.storage
      .from("images")
      .upload(storagePath, fileData, { contentType: mimeType, upsert: true });
    if (error) {
      throw error;
    }
    const { data } = client.storage.from("images").getPublicUrl(storagePath);
    return data.publicUrl;
  };

  // Prompts the user to pick an image and updates the provided state setter
  const selectImage = async (
    setImage: (value: string) => void
  ): Promise<void> => {
    Alert.alert("Select Image", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const { granted } = await ImagePicker.requestCameraPermissionsAsync();
          if (!granted) {
            Alert.alert("Permission to access camera is required!");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
          });
          if (!result.canceled && result.assets?.length) {
            setImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const { granted } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!granted) {
            Alert.alert("Permission to access gallery is required!");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
          });
          if (!result.canceled && result.assets?.length) {
            setImage(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Handle form submission: upload images and update user profile
  const handleFormSubmit = async (
    values: EditProfileFormValues,
    { resetForm }: FormikHelpers<EditProfileFormValues>
  ) => {
    try {
      setLoading(true);
      let profileImageUrl = "";
      let coverImageUrl = "";

      if (profileImage) {
        // If the image URI starts with "file://", upload it;
        // otherwise, assume it's already hosted and use it as-is.
        profileImageUrl = profileImage.startsWith("file://")
          ? await uploadImage(
              profileImage,
              "avatars",
              `${profileImage.split("/").pop()}`
            )
          : profileImage;
      }
      if (coverImage) {
        coverImageUrl = coverImage.startsWith("file://")
          ? await uploadImage(
              coverImage,
              "cover",
              `${coverImage.split("/").pop()}`
            )
          : coverImage;
      }

      // Check if username already exists (ignoring the current user)
      const { data: existingUsers, error: usernameCheckError } = await client
        .from("users")
        .select("user_id")
        .eq("user_name", values.userName)
        .neq("user_id", userId);

      if (usernameCheckError) {
        throw usernameCheckError;
      }
      if (existingUsers && existingUsers.length > 0) {
        throw new Error(
          "Username already taken, please choose a different one."
        );
      }
      // then continue
      const { data, error } = await client
        .from("users")
        .update({
          display_name: values.displayName,
          user_name: values.userName,
          user_bio: values.bio,
          birth_date: values.birthDate,
          photo_url: profileImageUrl,
          cover_url: coverImageUrl,
        })
        .eq("user_id", userId)
        .select("*")
        .single();

      if (error) throw error;
      if (data) {
        setCurrentUser(data);
      }
      showToast("success", "Success", "Updated Successfully!");
    } catch (error: any) {
      console.error("Error submitting form:", error);

      showToast(
        "error",
        "There was an error updating your profile.",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.page}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: moderateScale(20) }}
    >
      {/* Image Pickers */}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => selectImage(setProfileImage)}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.imagePreview}
              contentFit="cover"
            />
          ) : (
            <CustomText style={styles.imagePlaceholder} variant="h7">
              Select Profile Image
            </CustomText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => selectImage(setCoverImage)}
        >
          {coverImage ? (
            <Image
              source={{ uri: coverImage }}
              style={styles.imagePreview}
              contentFit="cover"
            />
          ) : (
            <CustomText style={styles.imagePlaceholder} variant="h7">
              Select Cover Image
            </CustomText>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <Formik
        initialValues={{
          displayName: currentUser.display_name || "",
          userName: currentUser.user_name || "",
          birthDate: currentUser.birth_date || "",
          bio: currentUser.user_bio || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Display Name"
              errors={errors.displayName}
              touched={touched.displayName}
              value={values.displayName}
              handleChange={handleChange("displayName")}
              handleBlur={handleBlur("displayName")}
              autoComplete="additional-name"
              rightIcon="account"
            />
            <CustomInput
              placeholder="User Name"
              errors={errors.userName}
              touched={touched.userName}
              value={values.userName}
              handleChange={handleChange("userName")}
              handleBlur={handleBlur("userName")}
              rightIcon="account"
            />
            <CustomInput
              placeholder="Bio"
              errors={errors.bio}
              touched={touched.bio}
              value={values.bio}
              handleChange={handleChange("bio")}
              handleBlur={handleBlur("bio")}
              style={{ height: moderateScale(80) }}
            />
            <TouchableOpacity
              style={[styles.input, { justifyContent: "center" }]}
              onPress={() => setShowDatePicker(true)}
            >
              <CustomText
                style={{
                  color: values.birthDate
                    ? theme.Colors.typography
                    : theme.Colors.gray[400],
                  fontSize: RFValue(16),
                }}
                variant="h7"
              >
                {values.birthDate || "Select BirthDate"}
              </CustomText>
            </TouchableOpacity>
            {touched.birthDate && errors.birthDate && (
              <Text style={styles.errorText}>{errors.birthDate}</Text>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={
                  values.birthDate ? new Date(values.birthDate) : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={(event, selectedDate?: Date) => {
                  if (Platform.OS !== "ios") {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) {
                    setFieldValue(
                      "birthDate",
                      selectedDate.toISOString().split("T")[0]
                    );
                  }
                }}
              />
            )}
            <CustomButton
              text="Save"
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default EditProfile;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    padding: moderateScale(16),
    backgroundColor: theme.Colors.background,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(15),
  },
  imagePicker: {
    flex: 1,
    height: moderateScale(150),
    borderWidth: 2,
    borderColor: theme.Colors.gray[200],
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    marginHorizontal: moderateScale(5),
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(8),
  },
  imagePlaceholder: {
    color: theme.Colors.gray[300],
    fontSize: moderateScale(16),
  },
  formContainer: {
    width: "100%",
    gap: moderateScale(15),
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.Colors.gray[50],
    borderRadius: theme.border.xs,
    borderWidth: 1,
    borderColor: theme.Colors.gray[200],
    paddingHorizontal: theme.margins.md,
    height: moderateScale(50),
  },
  errorText: {
    color: Colors.error,
    marginBottom: moderateScale(8),
    fontSize: moderateScale(12),
  },
}));
