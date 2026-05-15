import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.redirect(new URL("/admin/login", process.env.NEXTAUTH_URL!));
  res.cookies.delete("admin_token");
  return res;
}
