<script lang="ts">
	import { Moon, Sun } from "@lucide/svelte";

	const handleChangeTheme = (
		event: ToggleEvent & { currentTarget: EventTarget & HTMLInputElement }
	) => {
		document.documentElement.setAttribute(
			"data-theme",
			event.currentTarget.checked ? "light" : event.currentTarget.value
		);
	};
</script>

<label class="swap swap-rotate">
	<input type="checkbox" value="night" class="theme-controller" ontoggle={handleChangeTheme} />
	<Sun class="swap-on" />
	<Moon class="swap-off" />
</label>
