import { randomBytes } from "node:crypto";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { sessionsTable } from "../db/schema/sessions";

export async function createSession(userId: string) {
  const token = randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await db.insert(sessionsTable).values({
    userId,
    token,
    expiresAt
  });

  return {token, expiresAt}
}

export async function validateSession(token: string) {
  const session = await db.query.sessionsTable.findFirst({
    where: {
      token: token
    }
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}



export async function invalidateSession(token: string){
  await db.delete(sessionsTable).where(eq(sessionsTable.token, token))
}
