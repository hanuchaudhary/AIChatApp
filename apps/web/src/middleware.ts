import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/chat/:path*', '/signin', '/onboarding/:path*', '/'],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const url = request.nextUrl;
    if (
        token &&
        (url.pathname.startsWith('/signin') ||
            url.pathname.startsWith('/onboarding') ||
            url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/chat', request.url));
    }

    if (!token && url.pathname.startsWith('/chat')) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}