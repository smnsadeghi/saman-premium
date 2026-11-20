/**
 * Converts Western Arabic digits (0-9) to Persian digits (۰-۹)
 */
export function toPersianDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return "";
  const str = String(input);
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Formats a duration in seconds to hh:mm:ss with Persian digits
 */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "۰۰:۰۰:۰۰";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return toPersianDigits(formatted);
}

/**
 * Formats ISO date to a friendly Persian readable date
 */
export function formatPersianDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      calendar: "persian",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("fa-IR", options).format(d);
  } catch {
    return toPersianDigits(dateString);
  }
}
