import { getDataFromToken } from "./helpers/getDataFromToken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";
  let user;
  const isPublicPath = path === "/login" || path === "/signup";
  const isProfilePath = path.substring(0, 8) === "/profile";
  const isHome = path === "/";
  if (token) {
    user = await getDataFromToken(token);
  }

  if (path === "/forgotpassword" && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (isPublicPath && token) {
    return NextResponse.redirect(
      new URL(`/profile/${user?.id}`, request.nextUrl)
    );
  }
  if (!isPublicPath && !token && !isHome && path !== "/confirmemail") {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (isProfilePath && path.replace("/profile/", "") !== user?.id) {
    return NextResponse.redirect(
      new URL(`/profile/${user?.id}`, request.nextUrl)
    );
  }
}

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/login",
    "/signup",
    "/confirmemail/:path*",
  ],
};
