import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Hono } from 'hono';

let bullboardInstance: Hono | undefined = undefined;

async function getBullBoard() {
	if (bullboardInstance) return bullboardInstance;

	const { createBullBoard } = await import('@bull-board/api');
	const { HonoAdapter } = await import('@bull-board/hono');
	const { serveStatic } = await import('@hono/node-server/serve-static');
	const { Hono } = await import('hono');

	const serverAdapter = new HonoAdapter(serveStatic);

	createBullBoard({
		queues: [], // Add queues here
		serverAdapter
	});

	const app = new Hono({ strict: false });
	const basePath = '/jobs';

	serverAdapter.setBasePath(basePath);
	app.route(basePath, serverAdapter.registerPlugin());

	bullboardInstance = app;
	return bullboardInstance;
}

export const handle: Handle = async ({ event, resolve }) => {
	const isJobRoute = event.url.pathname === '/jobs' || event.url.pathname.startsWith('/jobs/');

	if (isJobRoute) {
		if (env.DEV_BULLBOARD !== 'true') {
			return new Response('Not Found', { status: 404 });
		}

		// TODO: Add a basic auth check here once auth is implemented
		// if (!isAuthorized(event)) return new Response('Unauthorized', { status: 401 });

		const bullboard = await getBullBoard();
		return bullboard.fetch(event.request);
	}

	return resolve(event);
};

if (!building) {
	// setupApiBullMQWorker();
}
