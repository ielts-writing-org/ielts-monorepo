<script lang="ts">
	import { slide } from "svelte/transition";
	import { LINT_KIND_STYLES, suggestionText } from "./editorDisplay.js";
	import type { UnpackedLint, UnpackedSuggestion } from "./types.js";
	import { onMount } from "svelte";

	interface Props {
		lint: UnpackedLint;
		open?: boolean;
		active?: boolean;
		onToggleOpen: () => void;
		focusError: () => void;
		onActivate?: () => void;
		onApply: (s: UnpackedSuggestion) => void;
		onIgnore?: () => void | Promise<void>;
		snippet: {
			prefix: string;
			problem: string;
			suffix: string;
			prefixEllipsis: boolean;
			suffixEllipsis: boolean;
		};
	}

	let {
		lint,
		open = false,
		active = false,
		onToggleOpen,
		focusError,
		onActivate = () => {},
		onApply,
		onIgnore = () => {},
		snippet
	}: Props = $props();

	let cardEl: HTMLDivElement | null = $state(null);

	const iconClass =
		"h-3.5 w-3.5 fill-none stroke-current stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]";
	const baseSuggestionClass =
		"h-[26px] max-w-full overflow-hidden text-ellipsis rounded-full px-[11px] text-[12.5px] font-semibold";

	let lintKindStyle = $derived(LINT_KIND_STYLES[lint.lint_kind]);
	onMount(() => {
		if (open && cardEl != null) {
			requestAnimationFrame(() => {
				const scroller = cardEl?.closest("[data-problems-scroller]");
				if (!(scroller instanceof HTMLElement) || cardEl == null) {
					return;
				}

				const top = cardEl.offsetTop;
				const bottom = top + cardEl.offsetHeight;
				const viewTop = scroller.scrollTop;
				const viewBottom = viewTop + scroller.clientHeight;

				if (top < viewTop + 8) {
					scroller.scrollTo({ top: Math.max(0, top - 14), behavior: "smooth" });
				} else if (bottom > viewBottom - 8) {
					scroller.scrollTo({ top: bottom - scroller.clientHeight + 14, behavior: "smooth" });
				}
			});
		}
	});

	function handleFocus() {
		onActivate();
		focusError?.();
	}
</script>

<div
	bind:this={cardEl}
	role="group"
	class={`shrink-0 overflow-hidden rounded-[10px] border-[0.5px] bg-base-200 shadow-sm shadow-stone-950/5 transition-[box-shadow,border-color] duration-150 ${
		active ? lintKindStyle.activeClass : "border-base-content/10"
	}`}
	onmouseenter={onActivate}>
	<button
		type="button"
		class="m-0 flex min-h-8 w-full items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-inherit"
		aria-expanded={open}
		onclick={onToggleOpen}>
		<span
			class={`inline-flex h-2.75 w-2.75 shrink-0 items-center justify-center rounded-full ${lintKindStyle.haloClass}`}>
			<span class={`h-1.75 w-1.75 rounded-full ${lintKindStyle.dotClass}`}></span>
		</span>
		<span class="text-[12.5px] leading-[1.1] font-semibold text-base-content">
			{lintKindStyle.label}
		</span>
		<span
			class={`ml-auto inline-flex shrink-0 text-base-content transition-transform duration-150 ${
				open ? "rotate-180" : ""
			}`}>
			<svg viewBox="0 0 16 16" aria-hidden="true" class={iconClass}>
				<path d="M4 6 8 10 12 6" />
			</svg>
		</span>
	</button>

	{#if open}
		<div
			class="flex flex-col gap-2.5 px-3 pt-0.5 pb-3"
			in:slide={{ duration: 130 }}
			out:slide={{ duration: 130 }}>
			<button
				type="button"
				class="m-0 flex w-full flex-col border-0 bg-transparent p-0 text-left text-[13px] leading-[1.4] font-medium text-base-content"
				onclick={handleFocus}>
				<span>{@html lint.message_html}</span>
			</button>

			<button
				type="button"
				class="m-0 block max-h-21 w-full overflow-hidden rounded-[7px] border-[0.5px] border-base-content/10 bg-base-300 px-3 py-2.5 text-left text-xs leading-[1.45] text-base-content"
				onclick={handleFocus}
				aria-label="Focus problem in editor">
				<span class="text-base-content">
					{snippet.prefixEllipsis ? "..." : ""}{snippet.prefix}
				</span>
				<mark
					class={`rounded-[3px] px-0.5 font-semibold ${lintKindStyle.softClass} ${lintKindStyle.textClass}`}>
					{snippet.problem}
				</mark>
				<span class="text-base-content">
					{snippet.suffix}{snippet.suffixEllipsis ? "..." : ""}
				</span>
			</button>

			<div class="flex items-center justify-end gap-2">
				{#if lint.suggestions && lint.suggestions.length > 0}
					<div class="flex flex-1 flex-wrap justify-end gap-1.5">
						{#each lint.suggestions as suggestion, i (i)}
							<button
								type="button"
								class={`${baseSuggestionClass} ${
									i === 0
										? `border-transparent ${lintKindStyle.softClass} ${lintKindStyle.textClass} shadow-none`
										: "border-[0.5px] border-base-content/10 bg-base-100 text-base-content shadow-sm shadow-stone-950/5"
								}`}
								title={`Replace with "${suggestionText(suggestion)}"`}
								onclick={(event) => {
									event.stopPropagation();
									onApply?.(suggestion);
								}}>
								{suggestionText(suggestion)}
							</button>
						{/each}
					</div>
				{:else}
					<span class="mr-auto text-xs text-base-content">No suggestions available.</span>
				{/if}

				<button
					type="button"
					class="h-6.5 shrink-0 border-0 bg-transparent px-1 text-[12.5px] font-medium text-base-content shadow-none"
					onclick={(event) => {
						event.stopPropagation();
						onIgnore();
					}}>
					Ignore
				</button>
			</div>
		</div>
	{/if}
</div>
