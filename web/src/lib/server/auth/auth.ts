import bcrypt from 'bcrypt';
import { createSession } from "./sessions";
import { InvalidCredentialsError } from "./errors";
import { UsersRepository } from "../db/repositories/usersRepository";

export type AuthError = 'INVALID_CREDENTIALS' | 'INVITE_EXPIRED' | "MISSING_PERMISSION"

export async function login(uuid: string, passwordAttempt: string) {

  const user = await UsersRepository.readById(uuid, {forceFresh: true})

  if (!user || !user.passwordHash) {
    throw new InvalidCredentialsError();
  }

  const isMatch = await bcrypt.compare(passwordAttempt, user.passwordHash);
  if(!isMatch) throw new InvalidCredentialsError();

  // TODO: [TASK] Implement permission-based access control during user authentication (See: https://github.com/1unared/vrc-sentry/issues/2)

  const session = await createSession(uuid)

  return {
    user,
    session
  }
}
