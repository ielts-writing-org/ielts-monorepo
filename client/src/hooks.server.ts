import { authClient } from "$lib/clients/auth/auth-client";
import { type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const ignoreAuthPaths = ["/favicon.ico"];

const authHandle: Handle = async ({ event, resolve }) => {
	if (!ignoreAuthPaths.includes(event.url.pathname)) {
		try {
			const session = await authClient.getSession({
				fetchOptions: {
					headers: event.request.headers
				}
			});

			if (session) {
				event.locals.session = session.data?.session;
				event.locals.user = session.data?.user;
			}
		} catch {
			throw new Error("Unable to contact remote server");
		}
	}

	return await resolve(event);
};

const themeHandle: Handle = async ({ event, resolve }) => {
	const theme = (event.cookies.get("theme") ?? "light") as
		"light" | "emerald" | "nord" | "winter" | "dark" | "abyss" | "forest" | "night";

	event.locals.theme = theme;

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace("%theme%", theme)
	});
};

export const handle = sequence(authHandle, themeHandle);
