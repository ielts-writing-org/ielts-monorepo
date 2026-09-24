import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { resolve } from "$app/paths";

export const load = (async ({ locals }) => {
	if (locals.session) {
		redirect(302, resolve("/"));
	}

	return {};
}) satisfies PageServerLoad;
