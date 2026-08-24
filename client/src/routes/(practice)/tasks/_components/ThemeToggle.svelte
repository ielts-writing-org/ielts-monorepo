<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';

	const handleChangeTheme = (
		event: ToggleEvent & { currentTarget: EventTarget & HTMLInputElement }
	) => {
		document.documentElement.setAttribute(
			'data-theme',
			event.currentTarget.checked ? 'light' : event.currentTarget.value
		);
	};
</script>

<div>
	<label class="flex cursor-pointer gap-2">
		<Sun />
		<input
			type="checkbox"
			value="dark"
			class="theme-controller toggle"
			ontoggle={handleChangeTheme} />
		<Moon />
	</label>
</div>
