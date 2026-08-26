import { type Repository } from '.';
import { db } from '..';
import { eq, count as drizzleCount } from 'drizzle-orm';
import { usersTable } from '../schema/users';
import { CacheHelper } from '$lib/server/redis/cache';

type User = NonNullable<Awaited<ReturnType<typeof db.query.usersTable.findFirst>>>;

export const UsersRepository = {
	async readById(id: User['id'], options: { forceFresh?: boolean } = {}): Promise<User | null> {
		return CacheHelper.wrap<User | null>(`user:id:${id}`, 3600, async () => {
			const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
			return user ?? null;
		}, options.forceFresh);
  },

	async create(entity: User): Promise<User> {
		const [user] = await db.insert(usersTable).values(entity).returning();
		if (!user) throw new Error('Failed to create user');
		return user;
	},

	async update(id: User['id'], entity: Partial<Omit<User, "id">>): Promise<User> {
		const [user] = await db
			.update(usersTable)
			.set(entity)
			.where(eq(usersTable.id, id))
			.returning();
		if (!user) throw new Error(`User with id ${id} not found`);
		await CacheHelper.del(`user:id:${id}`);
		return user;
	},

	async remove(id: User['id']): Promise<void> {
		await db.delete(usersTable).where(eq(usersTable.id, id));
		await CacheHelper.del(`user:id:${id}`);
	},

	async count(): Promise<number> {
		const [result] = await db.select({ count: drizzleCount() }).from(usersTable);
		return result.count;
	}
	} satisfies Repository<User, User['id']>
