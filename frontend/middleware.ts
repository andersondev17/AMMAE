// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/productos", "/api/auth", "/categorias"];

// Verifica si una ruta es pública basada en prefijos
function isPublicRoute(pathname: string) {
    if (publicRoutes.includes(pathname)) return true;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/assets") ||
        pathname.match(/\.(jpg|jpeg|png|gif|svg|ico)$/i)
    ) return true;

    if (pathname.startsWith("/categoria/")) return true;

    return false;
}

export default auth(async (req) => {
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;

    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    const session = await auth();

    // Si no hay sesión, redirigir a login
    if (!session?.user) {
        const loginUrl = new URL('/login', nextUrl.origin);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};