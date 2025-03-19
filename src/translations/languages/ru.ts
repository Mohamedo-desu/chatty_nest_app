export const ru = {
  translation: {
    onboarding: {
      description: "Начните создавать",
      get_started: "Начать",
    },
    signIn: {
      title: "С возвращением! 🎉",
      description: "Войдите, чтобы продолжить",
      signUp: "Регистрация",
      forgotPassword: "Забыли пароль?",
      signIn: "Войти",
      or: "Или войдите через",
      emailPlaceholder: "Введите ваш email",
      passwordPlaceholder: "Введите ваш пароль",
    },
    signUp: {
      title: "Добро пожаловать в BlueBird",
      description: "Зарегистрируйтесь, чтобы продолжить",
      signUp: "Зарегистрироваться",
      or: "Или зарегистрируйтесь через",
      displayNamePlaceholder: "Введите полное имя",
      emailPlaceholder: "Введите ваш email",
      passwordPlaceholder: "Введите ваш пароль",
      confirmPasswordPlaceholder: "Повторите пароль",
    },
    forgotPassword: {
      title: "Забыли пароль?",
      description: "Введите email для сброса пароля",
      emailPlaceholder: "Введите зарегистрированный email",
      submit: "Отправить запрос",
    },
    resetPassword: {
      title: "Сброс пароля",
      description:
        "Код для сброса отправлен на ваш email {{email}}. Введите код и создайте новый пароль.",
      resetCodePlaceholder: "Введите код сброса",
      newPasswordPlaceholder: "Введите новый пароль",
      confirmPasswordPlaceholder: "Подтвердите новый пароль",
      resetPassword: "Сбросить пароль",
      resendCode: "Отправить код повторно",
      resendCodeIn: "Отправить код повторно через {{displayTime}}",
    },
    SettingsPage: {
      account: "Аккаунт",
      profile: "Профиль",
      privacy: "Конфиденциальность",
      privacySettings: "Настройки конфиденциальности",
      notifications: "Уведомления",
      pushNotifications: "Push-уведомления",
      dataAndStorage: "Данные и хранилище",
      dataUsage: "Использование данных",
      general: "Общее",
      theme: "Тема",
      language: "Язык",
      about: "О приложении",
      support: "Поддержка",
      helpCenter: "Центр помощи",
      reportProblem: "Сообщить о проблеме",
      other: "Другое",
      logOut: "Выйти",
      alertLogoutTitle: "Выход",
      alertLogoutDescription: "Вы уверены, что хотите выйти?",
      alertLogoutYes: "Да",
      alertLogoutNo: "Нет",
    },
    privacySettingsPage: {
      headerTitle: "Настройки конфиденциальности",
      accountPrivacy: "Конфиденциальность аккаунта",
      privateAccount: "Приватный аккаунт",
      activityStatus: "Статус активности",
      messagePrivacy: "Конфиденциальность сообщений",
      readReceipts: "Подтверждения чтения",
      messageFiltering: "Фильтрация сообщений",
      blockingAndRestriction: "Блокировка и ограничения",
      blockedAccounts: "Заблокированные аккаунты",
      restrictedAccounts: "Ограниченные аккаунты",
    },
    validation: {
      email: "Электронная почта",
      invalidEmail: "Неверный email",
      password: "Пароль",
      passwordMatch: "Пароли должны совпадать",
      passwordRequirement:
        "Пароль должен содержать хотя бы одну заглавную букву, одну строчную и одну цифру",
      required: "обязательно",
      reset: "Код сброса",
    },
    languageSettings: {
      headerTitle: "Настройки языка",
      title: "Выберите предпочитаемый язык",
    },
    messageFilteringScreen: {
      filterUnknownLabel: "Фильтровать сообщения от неизвестных отправителей",
      filterExplicitLabel: "Фильтровать сообщения с нецензурной лексикой",
      blockedKeywordsLabel: "Заблокированные ключевые слова (через запятую)",
      blockedKeywordsPlaceholder:
        "Введите ключевые слова, разделённые запятыми",
      saveSettings: "Сохранить настройки",
    },
    notificationsScreen: {
      headerTitle: "Уведомления",
      generalNotifications: "Общие уведомления",
      pushNotifications: "Push-уведомления",
      emailNotifications: "Уведомления по email",
      smsNotifications: "SMS уведомления",
      socialActivity: "Социальная активность",
      likes: "Лайки",
      comments: "Комментарии",
      mentions: "Упоминания",
      friendRequests: "Запросы в друзья",
      directMessages: "Личные сообщения",
      groupNotifications: "Групповые уведомления",
      soundAndVibration: "Звук и вибрация",
      notificationSound: "Звук уведомления",
      vibrateOnNotification: "Вибрировать при уведомлении",
    },
    themeSettings: {
      headerTitle: "Настройки темы",
      chooseTheme: "Выберите предпочитаемую тему",
      light: "Светлая",
      dark: "Тёмная",
      system: "Системная",
    },
    aboutScreen: {
      headerTitle: "О приложении",
      appDescription: "Встречайте людей",
      appInformation: "Информация о приложении",
      versionLabel: "Версия:",
      buildNumberLabel: "Номер сборки:",
      updates: "Обновления",
      checkForUpdates: "Проверить обновления",
      noUpdatesTitle: "Обновлений нет",
      noUpdatesMessage: "Вы используете последнюю версию.",
      errorTitle: "Ошибка",
      updateErrorMessage: "Ошибка при проверке обновлений.",
      rateThisApp: "Оцените приложение",
      rateNow: "Оцените сейчас",
      legal: "Юридическая",
      legalText: "© {{year}} {{appName}}. Все права защищены.",
      privacyPolicy: "Политика конфиденциальности",
      termsAndConditions: "Условия и положения",
      openPrivacyError: "Не удалось открыть политику конфиденциальности.",
      openTermsError: "Не удалось открыть условия и положения.",
    },
    helpScreen: {
      headerTitle: "Помощь и отзывы",
      subTitle: "Сообщите нам о ваших отзывах или проблемах.",
      reportType: {
        bugReport: "Сообщить об ошибке",
        feedback: "Отзыв",
        other: "Другое",
      },
      errorTitle: "Ошибка",
      enterName: "Введите ваше имя.",
      enterEmail: "Введите ваш email.",
      validEmail: "Введите корректный email.",
      enterReportDescription: "Введите описание проблемы.",
      reportFeedback: "Тип отчёта: {{type}}\n\n{{report}}",
      reportSubmittedTitle: "Отчёт отправлен",
      reportSubmittedMessage: "Имя: {{name}}\nEmail: {{email}}\nТип: {{type}}",
      placeholderName: "Ваше имя",
      placeholderEmail: "Ваш email",
      placeholderDescription: "Опишите проблему или отзыв здесь...",
      submitReport: "Отправить отчёт",
    },
    tabLayout: {
      home: "Главная",
      explore: "Обзор",
      chats: "Чаты",
      settings: "Настройки",
    },
    main: {
      about: "О приложении",
      help_center: "Центр поддержки",
      help: "Помощь и отзывы",
      language_settings: "Настройки языка",
      theme_settings: "Настройки темы",
    },
    public: {
      forgot_password: "Забыли пароль?",
      index: "Главная",
      sign_in: "Войти",
      sign_up: "Регистрация",
      reset_password: "Сбросить пароль",
    },
    authenticated: {
      edit_profile: "Редактировать профиль",
      privacy_settings: "Настройки конфиденциальности",
      message_filtering: "Фильтрация сообщений",
      notifications_settings: "Настройки уведомлений",
      add_post: "Добавить пост",
      add_chat: "Создать чат",
      blocked_accounts: "Заблокированные аккаунты",
      chat_details: "Детали чата",
      data_usage: "Использование данных",
      group_details: "Детали группы",
      profile: "Профиль",
      restricted_accounts: "Ограниченные аккаунты",
    },
    chats: {
      index: "Чаты",
      groups: "Группы",
      emptyChats: "У вас пока нет чатов",
    },
    home: {
      index: "Для вас",
      followings: "Подписки",
      emptyPosts: "У вас пока нет постов",
    },
    addPost: {
      chooseMedia: "Выберите медиафайл",
      postType: "Тип поста:",
      public: "Публичный",
      private: "Приватный",
      post: "Опубликовать",
      update: "Обновить",
      submitAlertError: "Ошибка",
      submitAlertErrorDesc: "Пожалуйста, введите текст или выберите файл.",
      submitSuccessTitle: "Успех",
      submitSuccessUpdateDesc: "Ваш пост успешно обновлен.",
      submitSuccessAddDesc: "Ваш пост успешно загружен.",
      submitErrorTitle: "Ошибка",
      submitErrorDesc: "Произошла ошибка при загрузке вашего поста.",
      RichEditorPlaceholder: "Напишите что-нибудь здесь...",
    },
    commentCard: {
      alertDeleteTitle: "Подтвердить",
      alertDeleteDescription: "Вы уверены, что хотите это удалить?",
      alertDeleteYes: "Да",
      alertDeleteNo: "Нет",
      addComment: "Добавить комментарий",
      typeComment: "Напишите комментарий",
    },
    addChat: {
      search: "Поиск",
      searchUsers: "Искать пользователей",
      noUsers: "Пользователи не найдены",
      resultsFound: "результатов найдено",
    },
    chatDetails: {
      type: "Введите ваше сообщение здесь...",
      noMessages: "В этом разговоре нет сообщений.",
    },
    postDetails: {
      noComments: "Пока нет комментариев",
      noPost: "Нет поста",
    },
  },
};
