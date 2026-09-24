<script lang="ts">
	const themeGroups = {
		"Light theme": [
			{ themeName: "Light", themeValue: "light" },
			{ themeName: "Emerald", themeValue: "emerald" },
			{ themeName: "Nord", themeValue: "nord" },
			{ themeName: "Winter", themeValue: "winter" }
		],
		"Dark theme": [
			{ themeName: "Dark", themeValue: "dark" },
			{ themeName: "Abyss", themeValue: "abyss" },
			{ themeName: "Forest", themeValue: "forest" },
			{ themeName: "Night", themeValue: "night" }
		]
	} as const;

	type ThemeToggleProps = {
		currentTheme:
			| (typeof themeGroups)["Light theme"][number]["themeValue"]
			| (typeof themeGroups)["Dark theme"][number]["themeValue"];
		class?: string;
	};

	const { currentTheme, class: className }: ThemeToggleProps = $props();

	async function handleThemeChange(
		e: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) {
		const currentTheme = e.currentTarget.value;
		document.documentElement.setAttribute("data-theme", currentTheme);
		await cookieStore.set({
			name: "theme",
			value: currentTheme
		});
	}
</script>

<select
	class={["select select-sm", className]}
	name="theme"
	aria-label="Theme switcher"
	onchange={handleThemeChange}
	value={currentTheme}>
	{#each Object.entries(themeGroups) as themeGroup (themeGroup)}
		<optgroup label={themeGroup[0]}>
			{#each themeGroup[1] as theme (theme)}
				<option value={theme.themeValue}>{theme.themeName}</option>
			{/each}
		</optgroup>
	{/each}
</select>
