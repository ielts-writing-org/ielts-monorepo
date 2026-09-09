import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
	const theme = cookies.get("theme") ?? "light";

	return {
		theme
	};
}) satisfies LayoutServerLoad;
