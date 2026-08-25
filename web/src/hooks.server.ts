import { validateSession } from '$lib/server/auth/sessions';

export const handle = async ({ event, resolve }) => {

  const sessionToken = event.cookies.get("session_token")

  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event)
  }

  const session = await validateSession(sessionToken);

  if (session) {
    event.locals.user = {
      id: session.userId
    };
    event.locals.session = {
      token: session.token
    };

  } else {
    event.locals.user = null;
    event.locals.session = null;
  }
  return resolve(event)
}
