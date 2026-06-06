import { NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE } from '@/constants';

export const proxy = (request: NextRequest): NextResponse => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token || token.split('.').length !== 3) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete(SESSION_COOKIE);
        return response;
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/upload/:path*', '/equipe/:path*', '/auditoria/:path*'],
};
