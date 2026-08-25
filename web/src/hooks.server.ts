import { validateSession } from '$lib/server/auth/sessions';
import { building } from '$app/environment';
import { HonoAdapter } from '@bull-board/hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Hono } from 'hono';
import { DEV_BULLBOARD } from '$env/static/private';
import { apiQueue } from '$lib/server/bullmq/client';
import { setupApiBullMQWorker } from '$lib/server/bullmq/worker';

const bullboard = (() => {
	const serverAdapter = new HonoAdapter(serveStatic);

	createBullBoard({
		queues: [new BullMQAdapter(apiQueue)],
		serverAdapter
	});
	const app = new Hono({ strict: false });
	const basePath = '/jobs';
	serverAdapter.setBasePath(basePath);
	app.route(basePath, serverAdapter.registerPlugin());

	return app;
})();

if (!building) {
	setupApiBullMQWorker();
}

export const handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session_token');

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const session = await validateSession(sessionToken);

	if (session) {
		event.locals.user = {
			id: session.userId
		};
		event.locals.session = {
			token: session.token
		};

		if (DEV_BULLBOARD === 'true' && event.url.pathname.match(/^\/jobs($|\/)/)) {
			return bullboard.fetch(event.request);
		}
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}
	return resolve(event);
};
