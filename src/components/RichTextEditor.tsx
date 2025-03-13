import { Colors } from "@/constants/Colors";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "./CustomText";

// Define the props interface
interface RichTextEditorProps {
  editorRef: React.RefObject<RichEditor>;
  onChange: (text: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  editorRef,
  onChange,
}) => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();

  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
          actions.setStrikethrough,
          actions.removeFormat,
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.undo,
          actions.line,
          actions.heading1,
          actions.heading4,
          actions.setParagraph,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
            <CustomText style={{ color: tintColor }}>H1</CustomText>
          ),
          [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
            <CustomText style={{ color: tintColor }}>H4</CustomText>
          ),
          [actions.setParagraph]: ({ tintColor }: { tintColor: string }) => (
            <CustomText style={{ color: tintColor }}>P</CustomText>
          ),
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        // Use getEditor prop to supply the editor reference
        getEditor={() => editorRef.current}
        disabled={false}
        selectedIconTint={Colors.primary}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder={t("addPost.RichEditorPlaceholder")}
        onChange={onChange}
      />
    </View>
  );
};

export default RichTextEditor;

const stylesheet = createStyleSheet((theme, rt) => ({
  richBar: {
    backgroundColor: theme.Colors.gray[100],
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: theme.Colors.gray[200],
  },
  contentStyle: {
    color: theme.Colors.typography,
    placeholderColor: theme.Colors.gray[400],
    backgroundColor: theme.Colors.gray[100],
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
}));
