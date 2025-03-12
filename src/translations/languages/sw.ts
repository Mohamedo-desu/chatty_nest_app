export const sw = {
  translation: {
    onboarding: {
      description: "Anza Kujenga",
      get_started: "Anza",
    },
    signIn: {
      title: "Karibu Tena! 🎉",
      description: "Ingia ili kuendelea",
      signUp: "Jisajili",
      forgotPassword: "Umesahau nenosiri?",
      signIn: "Ingia",
      or: "Au endelea na",
      emailPlaceholder: "Weka barua pepe yako",
      passwordPlaceholder: "Weka nenosiri lako",
    },
    signUp: {
      title: "Karibu kwenye BlueBird",
      description: "Jisajili ili kuendelea",
      signUp: "Jisajili",
      or: "Au endelea na",
      displayNamePlaceholder: "Weka jina lako kamili",
      emailPlaceholder: "Weka barua pepe yako",
      passwordPlaceholder: "Weka nenosiri lako",
      confirmPasswordPlaceholder: "Thibitisha nenosiri lako",
    },
    forgotPassword: {
      title: "Umesahau nenosiri?",
      description: "Weka barua pepe yako ili kurejesha nenosiri",
      emailPlaceholder: "Weka barua pepe ulioandikishwa",
      submit: "Tuma Ombi",
    },
    resetPassword: {
      title: "Weka upya nenosiri",
      description:
        "Msimbo wa upya umetumwa kwenye barua pepe yako {{email}}. Tafadhali weka msimbo na tengeneza nenosiri jipya.",
      resetCodePlaceholder: "Weka msimbo wa upya",
      newPasswordPlaceholder: "Weka nenosiri jipya",
      confirmPasswordPlaceholder: "Thibitisha nenosiri jipya",
      resetPassword: "Weka upya nenosiri",
      resendCode: "Tuma msimbo tena",
      resendCodeIn: "Tuma msimbo tena katika {{displayTime}}",
    },
    SettingsPage: {
      account: "Akaunti",
      profile: "Wasifu",
      privacy: "Faragha",
      privacySettings: "Mipangilio ya Faragha",
      notifications: "Arifa",
      pushNotifications: "Arifa za Push",
      dataAndStorage: "Data na Hifadhi",
      dataUsage: "Matumizi ya Data",
      general: "Msingi",
      theme: "Mandhari",
      language: "Lugha",
      about: "Kuhusu",
      support: "Msaada",
      helpCenter: "Kituo cha Msaada",
      reportProblem: "Ripoti Tatizo",
      other: "Nyingine",
      logOut: "Toka",
      alertLogoutTitle: "Toka",
      alertLogoutDescription: "Je, una uhakika unataka kutoka?",
      alertLogoutYes: "Ndio",
      alertLogoutNo: "Hapana",
    },
    privacySettingsPage: {
      headerTitle: "Mipangilio ya Faragha",
      accountPrivacy: "Faragha ya Akaunti",
      privateAccount: "Akaunti Binafsi",
      activityStatus: "Hali ya Shughuli",
      messagePrivacy: "Faragha ya Ujumbe",
      readReceipts: "Uthibitisho wa Kusoma",
      messageFiltering: "Uchujaji wa Ujumbe",
      blockingAndRestriction: "Kuzuia na Vikwazo",
      blockedAccounts: "Akaunti Zilizozuiwa",
      restrictedAccounts: "Akaunti Zilizopigwa marufuku",
    },
    validation: {
      email: "Barua pepe",
      invalidEmail: "Barua pepe si sahihi",
      password: "Nenosiri",
      passwordMatch: "Manenosiri yanapaswa kulingana",
      passwordRequirement:
        "Nenosiri lazima liwe na herufi kubwa, herufi ndogo, na nambari moja angalau",
      required: "inahitajika",
      reset: "Msimbo wa upya",
    },
    languageSettings: {
      headerTitle: "Mipangilio ya Lugha",
      title: "Chagua lugha unayopendelea",
    },
    messageFilteringScreen: {
      filterUnknownLabel: "Chuja ujumbe kutoka kwa watuma wasiowajua",
      filterExplicitLabel: "Chuja ujumbe wenye lugha isiyofaa",
      blockedKeywordsLabel: "Maneno yaliyozuiliwa (yaliotenganishwa na koma)",
      blockedKeywordsPlaceholder: "Ingiza maneno yaliotenganishwa na koma",
      saveSettings: "Hifadhi Mipangilio",
    },
    notificationsScreen: {
      headerTitle: "Arifa",
      generalNotifications: "Arifa za Jumla",
      pushNotifications: "Arifa za Push",
      emailNotifications: "Arifa za Barua pepe",
      smsNotifications: "Arifa za SMS",
      socialActivity: "Hawlaha ya Kijamii",
      likes: "Upenda",
      comments: "Maoni",
      mentions: "Matajwa",
      friendRequests: "Ombi la Urafiki",
      directMessages: "Ujumbe wa Moja kwa Moja",
      groupNotifications: "Arifa za Kikundi",
      soundAndVibration: "Sauti na Mwingiliano",
      notificationSound: "Sauti ya Arifa",
      vibrateOnNotification: "Tetemesha wakati wa arifa",
    },
    themeSettings: {
      headerTitle: "Mipangilio ya Mandhari",
      chooseTheme: "Chagua mandhari unayopendelea",
      light: "Mwangaza",
      dark: "Giza",
      system: "Mfumo",
    },
    aboutScreen: {
      headerTitle: "Kuhusu",
      appDescription: "Kutana na watu",
      appInformation: "Taarifa za App",
      versionLabel: "Toleo:",
      buildNumberLabel: "Nambari ya Ujenzi:",
      updates: "Maboresho",
      checkForUpdates: "Angalia Maboresho",
      noUpdatesTitle: "Hakuna Maboresho",
      noUpdatesMessage: "Unatumia toleo jipya kabisa.",
      errorTitle: "Hitilafu",
      updateErrorMessage: "Hitilafu wakati wa kuangalia maboresho.",
      rateThisApp: "Pima App hii",
      rateNow: "Pima Sasa",
      legal: "Kisheria",
      legalText: "© {{year}} {{appName}}. Haki zote zimehifadhiwa.",
      privacyPolicy: "Sera ya Faragha",
      termsAndConditions: "Sheria na Masharti",
      openPrivacyError: "Haiwezi kufungua Sera ya Faragha.",
      openTermsError: "Haiwezi kufungua Sheria na Masharti.",
    },
    helpScreen: {
      headerTitle: "Msaada na Maoni",
      subTitle: "Tafadhali tujulishe maoni yako au matatizo unayokutana nayo.",
      reportType: {
        bugReport: "Ripoti ya Hitilafu",
        feedback: "Maoni",
        other: "Nyingine",
      },
      errorTitle: "Hitilafu",
      enterName: "Tafadhali ingiza jina lako.",
      enterEmail: "Tafadhali ingiza barua pepe yako.",
      validEmail: "Tafadhali ingiza barua pepe sahihi.",
      enterReportDescription: "Tafadhali andika maelezo ya ripoti yako.",
      reportFeedback: "Aina ya ripoti: {{type}}\n\n{{report}}",
      reportSubmittedTitle: "Ripoti Imewasilishwa",
      reportSubmittedMessage:
        "Jina: {{name}}\nBarua pepe: {{email}}\nAina: {{type}}",
      placeholderName: "Jina lako",
      placeholderEmail: "Barua pepe yako",
      placeholderDescription: "Andika hapa tatizo au maoni yako...",
      submitReport: "Wasilisha Ripoti",
    },
    tabLayout: {
      home: "Nyumbani",
      explore: "Gundua",
      chats: "Mazungumzo",
      settings: "Mipangilio",
    },
    main: {
      about: "Kuhusu",
      help_center: "Kituo cha Msaada",
      help: "Msaada na Maoni",
      language_settings: "Mipangilio ya Lugha",
      theme_settings: "Mipangilio ya Mandhari",
    },
    public: {
      forgot_password: "Umesahau Nenosiri?",
      index: "Nyumbani",
      sign_in: "Ingia",
      sign_up: "Jisajili",
      reset_password: "Weka upya nenosiri",
    },
    authenticated: {
      edit_profile: "Hariri Wasifu",
      privacy_settings: "Mipangilio ya Faragha",
      message_filtering: "Uchujaji wa Ujumbe",
      notifications_settings: "Mipangilio ya Arifa",
      add_post: "Ongeza Chapisho",
      add_chat: "Ongeza Mazungumzo",
      blocked_accounts: "Akaunti Zilizozuiwa",
      chat_details: "Maelezo ya Mazungumzo",
      data_usage: "Matumizi ya Data",
      group_details: "Maelezo ya Kikundi",
      profile: "Wasifu",
      restricted_accounts: "Akaunti Zilizopigwa marufuku",
    },
    chats: {
      index: "Mazungumzo",
      groups: "Makundi",
    },
    home: {
      index: "Kwa ajili yako",
      followings: "Unayofuata",
    },
  },
};
