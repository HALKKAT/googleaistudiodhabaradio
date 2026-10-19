/**
 * Robust YouTube Playlist ID parser supporting all standard YouTube URL formats.
 */
export function extractPlaylistId(url) {
  if (!url || typeof url !== "string") return null;

  try {
    // 1. Direct playlist ID (e.g., PLMdXo_74YpDU or similar 12-40 char IDs)
    if (/^[A-Za-z0-9_-]{12,}$/.test(url.trim())) {
      return url.trim();
    }

    // 2. Query param ?list=...
    const parsedUrl = new URL(url.trim());
    const listParam = parsedUrl.searchParams.get("list");
    if (listParam) return listParam;

    // 3. Fallback regex for irregular strings
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return match[1];

    return null;
  } catch {
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
}