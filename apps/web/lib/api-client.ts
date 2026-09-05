const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface FetcherOptions extends Omit<RequestInit, "headers"> {
  ssr?: boolean;
  headers?: Record<string, string>;
}

/**
 * Unified fetcher utility for both Client & SSR server components.
 * 
 * @param endpoint Relative API endpoint (e.g. "/users/me") or absolute URL.
 * @param options Fetch options including `ssr: true` for server cookie forwarding.
 */
export async function fetcher<T = unknown>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T | null> {
  const { ssr = false, cache = "no-store", ...fetchOptions } = options;
  const isServer = typeof window === "undefined";
  const shouldSSR = ssr || isServer;

  try {
    const customHeaders: Record<string, string> = { ...options.headers };

    if (shouldSSR) {
      try {
        const { headers } = await import("next/headers");
        const reqHeaders = await headers();
        const cookie = reqHeaders.get("cookie");
        if (cookie) {
          customHeaders["cookie"] = cookie;
        }
      } catch {
        // Ignore if called outside Next.js request context
      }
    }

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const res = await fetch(url, {
      ...fetchOptions,
      headers: customHeaders,
      cache,
    });

    if (!res.ok) return null;
    return await res.json() as T;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      ("digest" in error && error.digest === "DYNAMIC_SERVER_USAGE" ||
       "message" in error && typeof error.message === "string" && error.message.includes("DYNAMIC_SERVER_USAGE"))
    ) {
      throw error;
    }
    console.error(`fetcher error for [${endpoint}]:`, error);
    return null;
  }
}
