import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	return {
		theme: locals.theme,
		session: locals.session,
		user: locals.user
	};
}) satisfies LayoutServerLoad;
