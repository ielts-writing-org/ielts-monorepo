import js from "@eslint/js";
import baseConfig from "@hono/eslint-config";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import globals from "globals";
import path from "node:path";

const gitignorePath = path.resolve(import.meta.dirname, "../.gitignore");

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		files: ["**/*.ts"],
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				projectService: true
			}
		},
		extends: [baseConfig]
	},
	{
		files: ["**/*.js"],
		extends: [js.configs.recommended]
	}
);
