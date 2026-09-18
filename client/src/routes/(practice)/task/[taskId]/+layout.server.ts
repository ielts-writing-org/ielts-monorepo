import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies, locals }) => {
	const theme = cookies.get("theme") ?? "light";

	return {
		theme,
		session: locals.session,
		user: locals.user
	};
}) satisfies LayoutServerLoad;
