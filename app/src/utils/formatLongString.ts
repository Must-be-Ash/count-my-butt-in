export default function formatLongString(
  url?: string | null,
  endPrefix?: number,
  endSuffix?: number
): string {
  if (!url) return "";
  if (url.length <= ((endPrefix || 0) + (endSuffix || 0))) return url;
  const prefix = url.substring(0, endPrefix || 8);
  const suffix =
    endSuffix === 0 ? "" : url.substring(url.length - (endSuffix || 4));
  return `${prefix}...${suffix}`;
}
