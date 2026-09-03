import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import tseslint from "typescript-eslint";

export default defineConfig(
	globalIgnores(["coverage/**"]),
	{
		files: ["**/*.ts"],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: path.resolve(import.meta.dirname)
			}
		},
		extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked]
	},
	{
		files: ["**/*.js"],
		extends: [js.configs.recommended]
	},
	eslintConfigPrettier
);
