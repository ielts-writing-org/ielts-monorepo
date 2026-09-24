// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: import("better-auth").Session | undefined;
			user: import("better-auth").User | undefined;
			theme: "light" | "emerald" | "nord" | "winter" | "dark" | "abyss" | "forest" | "night";
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
