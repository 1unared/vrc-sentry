import 'dotenv/config';
import { defineRelationsPart } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from './schema';

export const db = drizzle(process.env.DATABASE_URL!, { relations: defineRelationsPart(schema) });
