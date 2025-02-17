
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/employee/:path*', '/dummy-page', '/add-employee'],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const role = token?.role;
    const url = request.nextUrl;


    // Redirect HR users to dashboard if they try to access sign-in, sign-up, or home 
    if (token && role === 'HR' && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname === '/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect non-authenticated users trying to access protected routes
    if (!token && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/employee') || url.pathname.startsWith('/add-employee'))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Redirect users who are NOT HR when trying to access restricted areas
    if (token && role !== 'HR' && (url.pathname.startsWith('/employee') || url.pathname === '/add-employee')) {
        return NextResponse.redirect(new URL('/dummy-page', request.url));
    }

    // Redirect users who are NOT HR when trying to access restricted areas
    if (token && role !== 'HR' && (url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/sign-in') || url.pathname === '/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}
