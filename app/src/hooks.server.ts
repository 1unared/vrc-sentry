import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { DEV_BULLBOARD } from '$env/static/private';
import { createBullBoard } from '@bull-board/api';
import { HonoAdapter } from '@bull-board/hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

const bullboard = (() => {
	const serverAdapter = new HonoAdapter(serveStatic);

	createBullBoard({
		queues: [], // Add queues here later
		serverAdapter
	});

	const app = new Hono({ strict: false });
	const basePath = '/jobs';

	serverAdapter.setBasePath(basePath);
	app.route(basePath, serverAdapter.registerPlugin());

	return app;
})();

export const handle: Handle = async ({ event, resolve }) => {
	const isJobRoute = event.url.pathname.match(/^\/jobs($|\/)/);

	if (DEV_BULLBOARD === 'true' && isJobRoute) {
		return bullboard.fetch(event.request);
	}

	return resolve(event);
};

if (!building) {
	// setupApiBullMQWorker();
}
