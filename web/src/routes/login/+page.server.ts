import { login } from '$lib/server/auth/auth.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { uuid, password } = form.data;

		try {
			const { session } = await login(uuid, password);

			event.cookies.set('session_token', session.token, {
				path: '/',
				secure: true,
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 30
			});
		} catch {
			return message(form, 'Invalid credentials or inactive account', { status: 401 });
		}
		throw redirect(303, '/dashboard');
	}
};
