import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // Plugin for relative time
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const dateFormat = "ddd,MMM DD";
export const dateFormatWithYear = "MMM DD,YYYY";
export const timeFormat = "HH:mm A";
export const yearFormat = "YYYY";

export const formatRelativeTime = (createdAt: Date | string | null): string => {
  // If createdAt is null, return an empty string.
  if (createdAt === null) return "";

  // Convert the createdAt date (stored in UTC) to local time.
  const localCreatedAt = dayjs.utc(createdAt).local();

  // Get the current local date.
  const currentDate = dayjs();

  // Check if the createdAt date is in the current year.
  const isCurrentYear = localCreatedAt.year() === currentDate.year();

  // If the createdAt date is in the current year, calculate the difference in days.
  // If the difference is greater than 7, return the formatted date without year.
  // Otherwise, return the relative time.
  if (isCurrentYear) {
    const diffInDays = currentDate.diff(localCreatedAt, "day");
    if (diffInDays > 7) return localCreatedAt.format(dateFormat);

    return localCreatedAt.fromNow();
  }

  // If the createdAt date is not in the current year, return the formatted date with year.
  return localCreatedAt.format(dateFormatWithYear);
};
