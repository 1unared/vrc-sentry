import { redis } from '.';

export class CacheHelper {
	static async get<T>(key: string): Promise<T | null> {
		const data = await redis.get(key);
		if (!data) return null;
		try {
			return JSON.parse(data) as T;
		} catch {
			return null;
		}
	}

	static async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
		await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
	}

	static async del(key: string): Promise<void> {
		await redis.del(key);
	}

	static async wrap<T>(
		key: string,
		ttlSeconds: number,
		fetcher: () => Promise<T>,
		forceRefresh = false
	): Promise<T> {
		if (!forceRefresh) {
			const cached = await this.get<T>(key);
			if (cached) return cached;
		}

		const fresh = await fetcher();
		if (fresh) {
			await this.set(key, fresh, ttlSeconds);
		}
		return fresh;
	}
}
