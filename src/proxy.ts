import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Optimistic admin guard (Better Auth pattern): /admin routes are fully
 * verified server-side by the admin layout via getSession(); the proxy only
 * performs the cheap cookie check so anonymous visitors skip the render
 * round-trip entirely.
 */
export default function proxy(request: NextRequest) {
  // Better Auth names the session cookie "<prefix>.session_token" and adds a
  // __Secure- prefix when the site is served over HTTPS.
  const securePrefix =
    request.nextUrl.protocol === "https:" ? "__Secure-" : "";
  const hasSession = request.cookies.has(
    `${securePrefix}docavia.session_token`,
  );

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
