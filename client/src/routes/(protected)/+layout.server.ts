import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { resolve } from "$app/paths";

export const load = (async ({ locals }) => {
	if (!locals.session) {
		redirect(307, resolve("/signin"));
	}
	return {};
}) satisfies LayoutServerLoad;
