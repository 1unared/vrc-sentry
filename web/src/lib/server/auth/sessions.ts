import { createHash, randomBytes } from 'node:crypto';
import { SessionsRepository } from '../db/repositories/sessionsRepository';

export async function createSession(userId: string) {
  const token = randomBytes(64).toString('hex');
	const tokenHash = createHash('sha256').update(token).digest('hex')
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

	await SessionsRepository.create({
		userId,
		tokenHash,
		expiresAt
	});

	return { token, expiresAt };
}

export async function validateSession(token: string) {
  const tokenHash = createHash('sha256').update(token).digest('hex');
	const session = await SessionsRepository.readByTokenHash(tokenHash);

	if (!session || session.expiresAt < new Date()) {
		return null;
	}

	return session;
}

export async function invalidateSession(token: string) {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const session = await SessionsRepository.readByTokenHash(tokenHash, {forceFresh: true});
  if(session) await SessionsRepository.remove(session.id)
}
