import { dash, sentinel } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { admin, openAPI } from "better-auth/plugins";
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
	plugins: [
		admin(),
		dash(),
		sentinel(),
		openAPI({
			disableDefaultReference: true
		})
	],
	advanced: {
		database: {
			validateSchema: false
		},
		cookies: {
			session_token: {
				name: "session_token"
			}
		}
	}
});
