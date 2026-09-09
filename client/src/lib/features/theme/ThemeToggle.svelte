<script lang="ts">
	import { Moon, Sun } from "@lucide/svelte";

	type ThemeToggleProps = {
		isNightTheme: boolean;
	};

	let { isNightTheme }: ThemeToggleProps = $props();

	async function handleThemeChange(
		event: Event & { currentTarget: EventTarget & HTMLInputElement }
	) {
		const theme = event.currentTarget.checked ? event.currentTarget.value : "light";
		document.documentElement.setAttribute("data-theme", theme);
		await cookieStore.set({
			name: "theme",
			value: theme
		});
	}
</script>

<label class="swap swap-rotate">
	<input type="checkbox" value="night" checked={isNightTheme} onchange={handleThemeChange} />
	<Sun class="swap-off" />
	<Moon class="swap-on" />
</label>
