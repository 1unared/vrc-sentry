import { Queue, QueueEvents, type DefaultJobOptions } from 'bullmq';
import { redis } from '../redis';
import { type JobRegistry, type JobPayload, type JobResult } from './registry';
import { createHash } from 'node:crypto';
import { QueueError, UnknownQueueError } from './errors';
import { CacheHelper } from '../redis/cache';


export const defaultJobOptions: DefaultJobOptions = {
	removeOnComplete: 1000,
	removeOnFail: 1000,
	attempts: 5,
	backoff: {
		type: 'exponential',
		delay: 5000
  }
};


export const apiQueue = new Queue('apiQueue', { connection: redis, defaultJobOptions });
const queueEvents = new QueueEvents('apiQueue', { connection: redis });

export async function getApiData<T extends keyof JobRegistry>(
	type: T,
	payload: JobPayload<T>,
	options: { ttl?: number; force?: boolean } = {}
): Promise<JobResult<T>> {

	const ttl = options.ttl ?? 3600;

	const requestHash = createHash('md5')
		.update(JSON.stringify({ type, payload }))
		.digest('hex');

	const cacheKey = `vrc:cache:${requestHash}`;
	const jobId = requestHash;

	if (options.force) {
		await CacheHelper.del(cacheKey);
	}

	return await CacheHelper.wrap<JobResult<T>>(cacheKey, ttl, async () => {
		try {
			const job = await apiQueue.add(type, { ...payload, type } as unknown, { jobId });
			const result = await job.waitUntilFinished(queueEvents);
			return result as JobResult<T>;
		} catch (err) {
			if (err instanceof QueueError) {
				throw err;
			}
			throw new UnknownQueueError();
		}
	});
}
