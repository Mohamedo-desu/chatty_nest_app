import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import SearchedUser from "@/components/ui/SearchedUser";
import { Fonts } from "@/constants/Fonts";
import { useChatStore } from "@/store/chatStore";
import { debounce } from "@/utils/functions";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const AddNewChat = () => {
  const { styles, theme } = useStyles(stylesheet);

  const [searchPhrase, setSearchPhrase] = useState("");
  const [searching, setSearching] = useState(true);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const { searchForUsers, searchedUsers, error } = useChatStore();

  const handleSearch = async () => {
    setLoading(true);
    await searchForUsers(searchPhrase);
    setLoading(false);
  };

  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch]
  );

  useEffect(() => {
    debouncedHandleSearch();
  }, [searchPhrase, debouncedHandleSearch]);

  useEffect(() => {
    if (error) {
      showToast("error", "Error", error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {searching ? (
          <TextInput
            style={styles.search}
            placeholder="Search for users"
            placeholderTextColor={theme.Colors.gray[300]}
            cursorColor={theme.Colors.primary}
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect
            autoFocus
            value={searchPhrase}
            onChangeText={(text) => setSearchPhrase(text)}
          />
        ) : (
          <CustomText style={styles.search}>{t("addChat.search")}</CustomText>
        )}

        {searching ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSearching(false);
              setSearchPhrase("");
            }}
          >
            <XMarkIcon size={RFValue(20)} color={theme.Colors.error} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSearching((prev) => !prev)}
          >
            <MagnifyingGlassIcon
              size={RFValue(20)}
              color={theme.Colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {searchedUsers?.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingVertical: 10,
            }}
          >
            <AnimatedNumbers
              includeComma
              animationDuration={300}
              animateToNumber={searchedUsers?.length}
              fontStyle={styles.count}
            />

            <CustomText
              style={{
                fontFamily: "Bold",
                fontSize: RFValue(14),
              }}
            >
              {t("addChat.resultsFound")}
            </CustomText>
          </View>
        )}
      </View>
      <FlatList
        data={searchedUsers}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 10,
        }}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <SearchedUser item={item} searchPhrase={searchPhrase} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator size={"small"} color={theme.Colors.primary} />
            ) : (
              <CustomText style={styles.emptyText}>
                {t("addChat.noUsers")}
              </CustomText>
            )}
          </View>
        )}
        keyExtractor={(item) => item.user_id}
      />
    </View>
  );
};

export default AddNewChat;

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: theme.Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: theme.Colors.gray[100],
    borderRadius: 8,
  },
  search: {
    flex: 1,
    color: theme.Colors.typography,
    fontSize: RFValue(14),
  },
  emptyText: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: theme.Colors.gray[200],
    textAlign: "center",
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  count: {
    fontSize: RFValue(16),
    color: theme.Colors.primary,
  },
}));
