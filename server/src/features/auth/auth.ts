import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { env } from "cloudflare:workers";

export const auth = betterAuth({
	database: env.MAIN_DB,
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		}
	},
	trustedOrigins: env.CORS_ORIGINS.split(","),
	plugins: [admin(), dash()],
	advanced: {
		database: {
			validateSchema: false
		}
	}
});
