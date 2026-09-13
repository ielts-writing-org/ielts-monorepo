import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { env } from "cloudflare:workers";

export const auth = betterAuth({
	database: env.MAIN_DB,
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET
		}
	},
	trustedOrigins: ["http://localhost:5173"],
	plugins: [dash()]
});
