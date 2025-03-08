import CustomText from "@/components/CustomText";
import RichTextEditor from "@/components/RichTextEditor";
import { useUserStore } from "@/store/userStore";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const AddNewPostScreen = () => {
  const { styles, theme } = useStyles(stylesheet);

  const { currentUser } = useUserStore();

  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  return (
    <View style={styles.page}>
      <View style={styles.userRow}>
        <TouchableOpacity onPress={() => {}} style={styles.photoContainer}>
          <Image
            source={{ uri: currentUser.photo_url }}
            contentFit="cover"
            style={styles.photo}
          />
        </TouchableOpacity>
        <View>
          <CustomText style={styles.name}>
            {currentUser.display_name}
          </CustomText>
          <CustomText style={styles.userName}>
            @{currentUser.user_name}
          </CustomText>
        </View>
      </View>
      <View style={styles.textEditor}>
        <RichTextEditor
          editorRef={editorRef}
          onChange={(body) => {
            bodyRef.current = body;
          }}
        />
      </View>
    </View>
  );
};

export default AddNewPostScreen;

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
    padding: 15,
  },
  photoContainer: {
    width: moderateScale(40),
    aspectRatio: 1,
    borderRadius: moderateScale(20),
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userName: {
    color: theme.Colors.gray[400],
  },
  name: {},
  textEditor: {},
}));
