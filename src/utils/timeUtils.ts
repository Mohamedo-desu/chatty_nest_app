import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

// Import locales
import "dayjs/locale/ar"; // Arabic
import "dayjs/locale/de"; // German
import "dayjs/locale/en"; // English
import "dayjs/locale/es"; // Spanish
import "dayjs/locale/fr"; // French
import "dayjs/locale/hi"; // Hindi
import "dayjs/locale/it"; // Italian
import "dayjs/locale/ja"; // Japanese
import "dayjs/locale/ko"; // Korean
import "dayjs/locale/pt"; // Portuguese
import "dayjs/locale/ru"; // Russian
import "dayjs/locale/sw"; // Swahili
import "dayjs/locale/zh-cn"; // Chinese (Simplified)

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const dateFormat = "ddd, MMM DD";
export const dateFormatWithYear = "MMM DD, YYYY";
export const timeFormat = "HH:mm A";
export const yearFormat = "YYYY";

export const formatRelativeTime = (createdAt: string, i18n: any) => {
  // If createdAt is null, return an empty string.
  if (createdAt === null) return "";

  // Set dayjs locale based on the current language from i18next.
  // Ensure that i18n.language matches one of the imported locale codes.
  dayjs.locale(i18n.language);

  // Convert the createdAt date (stored in UTC) to local time.
  const localCreatedAt = dayjs.utc(createdAt).local();
  const currentDate = dayjs();

  // Check if the createdAt date is in the current year.
  const isCurrentYear = localCreatedAt.year() === currentDate.year();

  if (isCurrentYear) {
    const diffInDays = currentDate.diff(localCreatedAt, "day");
    if (diffInDays > 7) return localCreatedAt.format(dateFormat);
    return localCreatedAt.fromNow();
  }

  return localCreatedAt.format(dateFormatWithYear);
};
