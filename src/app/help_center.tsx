import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  faqs: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "General Questions",
    faqs: [
      {
        question: "What is the app about?",
        answer:
          "Our app is a social platform that allows users to connect, share, and interact with friends and communities.",
      },
      {
        question: "How do I sign up?",
        answer:
          "You can sign up using your email, phone number, or social media accounts.",
      },
      {
        question: "Is there a mobile version?",
        answer: "Yes, our app is available on both iOS and Android platforms.",
      },
      {
        question: "What languages does the app support?",
        answer:
          "The app supports multiple languages. You can change your preferred language in the settings.",
      },
      {
        question: "How can I update my profile?",
        answer:
          "To update your profile, navigate to the Edit Profile section and update your details.",
      },
      {
        question: "What is the cost of the app?",
        answer:
          "Our app is free to use, with optional in-app purchases available.",
      },
      {
        question: "Can I share posts with non-users?",
        answer: "Yes, you can share your posts publicly via a shareable link.",
      },
    ],
  },
  {
    title: "Account & Privacy",
    faqs: [
      {
        question: "How do I change my password?",
        answer:
          "Go to the Change Password section in settings to update your password.",
      },
      {
        question: "How do I manage my privacy settings?",
        answer:
          "Visit the Privacy Settings screen to control who sees your activity and manage blocked accounts.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account by contacting our support team through the Help Center.",
      },
      {
        question: "What data is collected from me?",
        answer:
          "We collect your usage data, profile details, and device information to improve your experience.",
      },
      {
        question: "How is my data secured?",
        answer:
          "Your data is protected using industry-standard encryption and security protocols.",
      },
      {
        question: "Can I make my account private?",
        answer:
          "Yes, you can toggle your account privacy in the account settings.",
      },
    ],
  },
  {
    title: "Technical Support",
    faqs: [
      {
        question: "The app is crashing, what should I do?",
        answer:
          "Try restarting or reinstalling the app. If issues persist, contact our support team.",
      },
      {
        question: "How do I update the app?",
        answer:
          "Updates are available on the App Store and Google Play. Please install the latest version.",
      },
      {
        question: "How can I report a bug?",
        answer:
          "You can report bugs via the 'Report a Problem' option in the Help Center.",
      },
      {
        question: "Who do I contact for technical support?",
        answer:
          "For technical issues, please reach out to our support team through the Help Center.",
      },
      {
        question: "Are there troubleshooting guides available?",
        answer:
          "Yes, you can find troubleshooting guides in the Help Center under FAQs.",
      },
    ],
  },
  {
    title: "Billing & Payments",
    faqs: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept credit cards, debit cards, and PayPal for in-app purchases.",
      },
      {
        question: "How do I view my billing history?",
        answer:
          "Your billing history is available in the account section of the app.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Refunds are handled on a case-by-case basis. Please contact support for assistance.",
      },
      {
        question: "Is there a subscription fee?",
        answer:
          "The app is free to use, but certain premium features may require a subscription.",
      },
      {
        question: "How do I cancel my subscription?",
        answer:
          "You can cancel your subscription through your account settings on the App Store or Google Play.",
      },
    ],
  },
  {
    title: "Other",
    faqs: [
      {
        question: "How do I update the app language?",
        answer: "Language settings can be updated in the app's settings menu.",
      },
      {
        question: "Where can I find the app's terms of service?",
        answer:
          "The terms of service are available in the Help Center under Legal.",
      },
      {
        question: "How do I view app updates?",
        answer:
          "Check the 'What's New' section in the app or visit our website for the latest updates.",
      },
      {
        question: "Can I share feedback?",
        answer:
          "Yes, you can share your feedback through the 'Contact Support' option in the Help Center.",
      },
    ],
  },
];

const HelpCenter: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  // Using an object to track expanded sections by title
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(
    faqSections.reduce(
      (acc, section) => ({ ...acc, [section.title]: false }),
      {}
    )
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (sectionTitle: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  // Filter FAQ sections and their FAQs based on search query
  const filteredSections = faqSections
    .map((section) => {
      const filteredFaqs = section.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...section, faqs: filteredFaqs };
    })
    .filter((section) => section.faqs.length > 0 || searchQuery.trim() === "");

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search FAQs..."
        placeholderTextColor={theme.Colors.gray[400]}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredSections.map((section, sectionIndex) => (
        <View key={section.title} style={styles.sectionContainer}>
          <TouchableOpacity
            onPress={() => toggleSection(section.title)}
            style={styles.sectionHeader}
          >
            <CustomText style={styles.sectionTitle} variant="h6">
              {section.title}
            </CustomText>
            <ChevronRightIcon
              color={theme.Colors.gray[400]}
              width={RFValue(20)}
              height={RFValue(20)}
              style={{
                transform: [
                  {
                    rotate: expandedSections[section.title] ? "90deg" : "0deg",
                  },
                ],
              }}
            />
          </TouchableOpacity>
          {expandedSections[section.title] &&
            section.faqs.map((faq, faqIndex) => (
              <View key={faqIndex} style={styles.faqItem}>
                <CustomText style={styles.questionText}>
                  {faq.question}
                </CustomText>
                <CustomText style={styles.answerText}>{faq.answer}</CustomText>
              </View>
            ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default HelpCenter;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(20),
  },
  searchInput: {
    height: moderateScale(40),
    borderColor: theme.Colors.gray[200],
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    marginBottom: moderateScale(16),
    fontSize: RFValue(14),
    color: theme.Colors.typography,
  },
  sectionContainer: {
    marginBottom: moderateScale(20),
    borderRadius: moderateScale(8),
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    backgroundColor: theme.Colors.gray[200],
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontFamily: Fonts.SemiBold,
    color: theme.Colors.primary,
  },
  faqItem: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.Colors.gray[200],
  },
  questionText: {
    fontSize: RFValue(14),
    fontFamily: Fonts.SemiBold,
    color: theme.Colors.typography,
    marginBottom: moderateScale(8),
  },
  answerText: {
    fontSize: RFValue(13),
    fontFamily: Fonts.Regular,
    color: theme.Colors.typography,
    lineHeight: RFValue(18),
  },
}));
