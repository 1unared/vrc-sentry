import 'dotenv/config';
import { defineRelationsPart } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from './schema';

import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined in your environment variables.');
}


export const db = drizzle(env.DATABASE_URL, { relations: defineRelationsPart(schema) });
