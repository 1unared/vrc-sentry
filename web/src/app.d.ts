// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  const VERSION: string;
  namespace App {
    interface Locals {
      user: {
        id: string
      } | null;
      session: {
        token: string;
      } | null
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
