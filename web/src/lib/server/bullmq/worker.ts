import { Worker, UnrecoverableError } from 'bullmq';
import { redis } from '../redis';
import { handlers } from './handlers';
import { JobType } from './registry';
import { API_REQS_PER_MIN } from '$env/static/private';

const requestsPerMinute = parseInt(API_REQS_PER_MIN || '1', 10);

export const setupApiBullMQWorker = () => {
	new Worker(
		'apiQueue',
		async (job) => {
			const handler = handlers[job.data.type as JobType];
			if (!handler) throw new UnrecoverableError(`No handler for ${job.data.type}`);

			return await handler(job.data);
		},
		{
			connection: redis,
			limiter: {
				max: requestsPerMinute,
				duration: 60000
			}
		}
	);
};
