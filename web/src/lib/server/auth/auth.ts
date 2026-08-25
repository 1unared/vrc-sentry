import { db } from "../db";
import bcrypt from 'bcrypt';
import { createSession } from "./sessions";
import { InvalidCredentialsError } from "./errors";

export type AuthError = 'INVALID_CREDENTIALS' | 'INVITE_EXPIRED' | "MISSING_PERMISSION"

export async function login(uuid: string, passwordAttempt: string) {
  const user = await db.query.usersTable.findFirst({
    where: {
      id: uuid
    }
  });



  if (!user || !user.password_hash) {
    throw new InvalidCredentialsError();
  }

  const isMatch = await bcrypt.compare(passwordAttempt, user.password_hash);
  if(!isMatch) throw new  InvalidCredentialsError();

  // TODO: [TASK] Implement permission-based access control during user authentication (See: https://github.com/1unared/vrc-sentry/issues/2)

  const session = await createSession(uuid)

  return {
    user,
    session
  }
}
