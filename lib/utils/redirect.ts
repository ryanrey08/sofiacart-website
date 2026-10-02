/** Only follow same-site paths after sign-in, never absolute or protocol-relative URLs. */
export function safeRedirect(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
