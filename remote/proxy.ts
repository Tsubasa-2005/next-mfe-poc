import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerEnv } from "./env";

const serverEnv = getServerEnv();

function nextWithHeaders(headers: Headers) {
  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export async function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.trim();

  if (forwardedHost !== serverEnv.ALLOWED_PUBLIC_ORIGIN) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return nextWithHeaders(new Headers(request.headers));
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"],
};
