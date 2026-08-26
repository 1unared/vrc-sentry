import { type Repository } from '.';
import { db } from '..';
import { eq, count as drizzleCount } from 'drizzle-orm';
import { sessionsTable } from '../schema/sessions';
import { CacheHelper } from '$lib/server/redis/cache';

type Session = NonNullable<Awaited<ReturnType<typeof db.query.sessionsTable.findFirst>>>;

export const SessionsRepository = {
	async readById(
		id: Session['id'],
		options: { forceFresh?: boolean } = {}
	): Promise<Session | null> {
		return CacheHelper.wrap<Session | null>(
			`session:id:${id}`,
			3600,
			async () => {
				const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, id));
				return session ?? null;
			},
			options.forceFresh
		);
	},

	async readByTokenHash(
		tokenHash: Session['tokenHash'],
		options: { forceFresh?: boolean } = {}
	): Promise<Session | null> {
		return CacheHelper.wrap<Session | null>(
			`session:tokenHash:${tokenHash}`,
			3600,
			async () => {
				const [session] = await db
					.select()
					.from(sessionsTable)
					.where(eq(sessionsTable.tokenHash, tokenHash));
				return session ?? null;
			},
			options.forceFresh
		);
	},

	async create(entity: Omit<Session, 'id'>): Promise<Session> {
		const [session] = await db.insert(sessionsTable).values(entity).returning();
		if (!session) throw new Error('Failed to create session');
		return session;
	},

  async update(id: Session['id'], entity: Partial<Omit<Session, 'id' | "tokenHash" | "expiresAt" | "userId">>): Promise<Session> {
		const [session] = await db
			.update(sessionsTable)
			.set(entity)
			.where(eq(sessionsTable.id, id))
			.returning();
		if (!session) throw new Error(`Session with id ${id} not found`);
		await CacheHelper.del(`session:${id}`);
		return session;
	},

  async remove(id: Session['id']): Promise<void> {
    const session = await this.readById(id, { forceFresh: true })
    if (!session) return;
		await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
		await CacheHelper.del(`session:${id}`);
		await CacheHelper.del(`session:tokenHash:${session.tokenHash}`);
	},

	async count(): Promise<number> {
		const [result] = await db.select({ count: drizzleCount() }).from(sessionsTable);
		return result.count;
	}
} satisfies Repository<Session, Session['id']> & {
	readByTokenHash(tokenHash: Session['tokenHash'], options: { forceFresh?: boolean }): Promise<Session | null>;
};
