import { invalidateSession } from '$lib/server/auth/sessions.js';
import { redirect } from '@sveltejs/kit';

export const POST = async ({ cookies, locals }) => {
	const sessionToken = cookies.get("session_token");

	if (sessionToken) {
		if (locals.session) {
			await invalidateSession(sessionToken)
		}
  }

	cookies.delete("session_token", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    });

	throw redirect(303, "/login");
};
