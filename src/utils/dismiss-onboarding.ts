'use server';

import { cookies } from 'next/headers';

export const dismissOnboarding = async () => {
    const c = await cookies();
    c.set('me_onboarding_done', '1', {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
    });
};
