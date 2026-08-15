import baseConfig from '@hono/eslint-config';
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	globalIgnores(['worker-configuration.d.ts', 'eslint.config.js']),
	baseConfig,
	{
		files: ['**/*.ts'],
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				projectService: true
			}
		}
	}
);
