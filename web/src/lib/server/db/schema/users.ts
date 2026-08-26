import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey(),
  passwordHash: text(),
  isSystemAdmin: boolean('is_system_admin').default(false).notNull(),
});
