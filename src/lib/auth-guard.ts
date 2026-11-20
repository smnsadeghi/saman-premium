export type UserRole = "her" | "him";

export interface AllowedUserConfig {
  emailHer: string;
  emailHim: string;
}

/**
 * Returns the configured allowed emails in lowercase.
 * Checks both server-side and NEXT_PUBLIC client-side env variables.
 */
export function getAllowedEmails(): { her: string; him: string } {
  const her = (
    process.env.ALLOWED_EMAIL_HER ||
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_HER ||
    ""
  ).trim().toLowerCase();

  const him = (
    process.env.ALLOWED_EMAIL_HIM ||
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_HIM ||
    ""
  ).trim().toLowerCase();

  return { her, him };
}

/**
 * Checks if a given email is whitelisted in the closed system.
 * Matching is strictly case-insensitive.
 */
export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const { her, him } = getAllowedEmails();
  return (Boolean(her) && normalized === her) || (Boolean(him) && normalized === him);
}

/**
 * Resolves the role ('her' or 'him') based on the whitelisted email.
 * Returns null if the email is not in the whitelist.
 */
export function resolveUserRole(email: string | null | undefined): UserRole | null {
  if (!email) return false as unknown as null;
  const normalized = email.trim().toLowerCase();
  const { her, him } = getAllowedEmails();

  if (her && normalized === her) {
    return "her";
  }
  if (him && normalized === him) {
    return "him";
  }
  return null;
}

/**
 * Returns the destination dashboard path for a given role.
 */
export function getDashboardPathForRole(role: UserRole): string {
  return role === "her" ? "/dashboard/her" : "/dashboard/him";
}
