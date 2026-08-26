import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { encryptedText } from "./utils";

export const vrchatCredentialsTable = pgTable("vrchat_credentials", {
  id: integer().primaryKey().default(1),
  vrcUsername: text().notNull(),
  vrcPassword: encryptedText().notNull(),
  totpSecret: encryptedText().notNull(),
});
