import { pgTable, integer, boolean } from "drizzle-orm/pg-core";

export const appConfigTable = pgTable("app_config", {
  id: integer().primaryKey().default(1),
  isSetupCompleted: boolean().default(false)
});
