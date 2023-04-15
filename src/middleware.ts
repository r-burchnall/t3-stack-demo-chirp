import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default withClerkMiddleware(() => {
    console.log("Clerk middleware ran")
    return NextResponse.next();
});

export const config = {
    matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
}