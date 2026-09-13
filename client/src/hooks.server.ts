import { authClient } from "$lib/shared/auth-client";
import { type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: event.request.headers
		}
	});

	if (session) {
		event.locals.session = session.data?.session;
		event.locals.user = session.data?.user;
	}

	const theme = event.cookies.get("theme");

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace("%theme%", theme ?? "light")
	});

	return response;
};
