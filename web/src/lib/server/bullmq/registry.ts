
export enum JobType {
	GET_CURRENT_USER = 'GET_CURRENT_USER',
}

export interface JobRegistry {
	[JobType.GET_CURRENT_USER]: {
		payload: Record<PropertyKey, never>,
		result: { id: string; name: string };
	};
}

export type JobPayload<T extends keyof JobRegistry> = JobRegistry[T]['payload'];
export type JobResult<T extends keyof JobRegistry> = JobRegistry[T]['result'];
export type JobTaskData<T extends keyof JobRegistry> = JobRegistry[T]['payload'] & { type: T };
export type JobHandlers = {
	[K in JobType]: (payload: JobRegistry[K]['payload']) => Promise<JobRegistry[K]['result']>;
};
