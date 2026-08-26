export interface Repository<T, K> {
	readById(id: K, options: { forceFresh?: boolean }): Promise<T | null>;
	create(entity: Partial<T>): Promise<T>;
	update(id: K, entity: Partial<T>): Promise<T>;
	remove(id: K): Promise<void>;
	count(): Promise<number>;
}
