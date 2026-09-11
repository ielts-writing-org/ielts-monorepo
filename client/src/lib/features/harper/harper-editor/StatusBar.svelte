<script lang="ts">
	import {
		type EditorFontFamily,
		type EditorFontSize,
		FONT_OPTIONS,
		FONT_SIZES,
		wordCount
	} from "./editorDisplay.js";

	interface Props {
		text?: string;
		problemCount?: number;
		fontFamily?: EditorFontFamily;
		fontSize?: EditorFontSize;
		onFontFamilyChange?: (fontFamily: EditorFontFamily) => void;
		onFontSizeChange?: (fontSize: EditorFontSize) => void;
	}

	let {
		text = "",
		problemCount = 0,
		fontFamily = "sans",
		fontSize = "default",
		onFontFamilyChange = () => {},
		onFontSizeChange = () => {}
	}: Props = $props();

	const fontButtonClass =
		"inline-flex h-4 min-w-7 items-center justify-center rounded px-2 text-xs leading-none font-medium text-stone-500";

	let words = $derived(wordCount(text));
	let chars = $derived(text.length);
</script>

<footer
	class="flex min-h-6.5 flex-[0_0_26px] items-center gap-3.5 border-t-[0.5px] border-base-content/20 bg-base-300 px-2 pr-2 pl-3.5 font-mono text-[11px] whitespace-nowrap text-base-content tabular-nums @max-[760px]:h-auto @max-[760px]:min-h-7.5 @max-[760px]:flex-wrap @max-[760px]:gap-y-1.5 @max-[760px]:py-1.25"
	aria-label="Editor status">
	<div class="inline-flex items-center gap-2">
		<span class="inline-flex items-center gap-1.5">
			<span class={`h-1.5 w-1.5 rounded-full ${problemCount === 0 ? "bg-success" : "bg-error"}`}
			></span>
			{#if problemCount === 0}
				All clear
			{:else}
				{problemCount} problem{problemCount === 1 ? "" : "s"}
			{/if}
		</span>
	</div>

	<span class="h-2.5 w-px bg-base-content/20"></span>
	<span>{words} words</span>
	<span>{chars} chars</span>

	<span class="flex-1"></span>

	<div
		class="inline-flex h-4.5 items-center rounded-[5px] border-[0.5px] border-base-content/10 bg-base-200 p-px"
		aria-label="Font family">
		{#each FONT_OPTIONS as option (option.label)}
			<button
				type="button"
				class={`${fontButtonClass} ${
					fontFamily === option.value
						? "bg-white font-bold text-stone-950 shadow-sm shadow-stone-950/10"
						: ""
				}`}
				style={`font-family: ${option.stack}`}
				title={option.label}
				aria-label={`Use ${option.label.toLowerCase()} font`}
				aria-pressed={fontFamily === option.value}
				onclick={() => onFontFamilyChange(option.value)}>
				{option.sample}
			</button>
		{/each}
	</div>

	<label
		class="relative inline-flex h-4.5 items-center rounded-[5px] border-[0.5px] border-base-content/10 bg-base-200 pr-4.5 pl-2 text-[11px] font-medium text-base-content after:absolute after:top-1/2 after:right-1.25 after:-translate-y-1/2 after:font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif] after:text-[9px] after:leading-none after:text-stone-500 after:content-['v']">
		<span>{fontSize === "default" ? "Default" : `${fontSize}px`}</span>
		<select
			value={fontSize}
			class="absolute inset-0 border-0 bg-base-300 opacity-0"
			aria-label="Font size"
			onchange={(event) => {
				const value = event.currentTarget.value;
				onFontSizeChange(value === "default" ? "default" : Number(value));
			}}>
			<option value="default">Default</option>
			{#each FONT_SIZES as size (size)}
				<option value={size}>{size}px</option>
			{/each}
		</select>
	</label>
</footer>
