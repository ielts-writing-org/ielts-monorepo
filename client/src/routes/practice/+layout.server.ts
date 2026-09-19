import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	if (!locals.session) {
		redirect(307, "/signin");
	}
	return {};
}) satisfies LayoutServerLoad;
