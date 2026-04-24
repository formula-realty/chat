import type { SessionMetadata } from "@/lib/types";

const STORAGE_KEY = "formula_chat_session_metadata";
const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "yclid"
] as const;

function readStoredMetadata(): SessionMetadata | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SessionMetadata) : null;
  } catch {
    return null;
  }
}

export function captureSessionMetadata(): SessionMetadata {
  const stored = readStoredMetadata();

  if (stored) {
    return stored;
  }

  const url = new URL(window.location.href);
  const metadata: SessionMetadata = {
    referrer: document.referrer || "",
    path: `${url.pathname}${url.search}`,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  for (const key of TRACKING_KEYS) {
    const value = url.searchParams.get(key);

    if (value) {
      metadata[key] = value;
    }
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
  return metadata;
}
