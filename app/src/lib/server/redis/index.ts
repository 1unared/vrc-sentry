import Redis from 'ioredis';
import { env } from '$env/dynamic/private';

if (!env.REDIS_URL) {
	throw new Error('REDIS_URL is not defined in your environment variables.');
}

export const redis = new Redis(env.REDIS_URL, {
	connectTimeout: 5000,
	maxRetriesPerRequest: 3,
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
