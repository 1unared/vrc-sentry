import Redis from 'ioredis';
import { REDIS_URL } from '$env/static/private';

if (!REDIS_URL) {
	throw new Error('REDIS_URL is not defined in your environment variables.');
}

export const redis = new Redis(REDIS_URL, {
	connectTimeout: 5000,
	maxRetriesPerRequest: null,
	lazyConnect: false
});

redis.on('error', (err) => {
	console.error('[REDIS] Connection Error:', err.message);
});

redis.on('connect', () => {
	console.info('[REDIS] successfully connected');
});

redis.on('ready', () => {
	console.info('[REDIS] ready');
});
