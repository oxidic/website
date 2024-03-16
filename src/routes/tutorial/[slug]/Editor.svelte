<script>
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { acceptCompletion } from '@codemirror/autocomplete';
	import { indentWithTab } from '@codemirror/commands';
	import { indentUnit } from '@codemirror/language';
	import { EditorState } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { basicSetup } from 'codemirror';
	import { onMount, tick } from 'svelte';
	import './codemirror.css';
	import { SplitPane } from '@rich_harris/svelte-split-pane';

	/** @type {HTMLDivElement} */
	let container;

	/** @type {string} */
	let output = 'Hello world!';

	/** @type {string} */
	let version = 'v2.7.0';

	let preserve_editor_focus = false;
	let skip_reset = true;

	/** @type {any} */
	let remove_focus_timeout;

	/** @type {Map<string, import('@codemirror/state').EditorState>} */
	let editor_states = new Map();

	/** @type {import('@codemirror/view').EditorView} */
	let editor_view;

	/** @type {string} */
	export let code;

	const extensions = [
		basicSetup,
		EditorState.tabSize.of(2),
		keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab]),
		indentUnit.of('\t')
	];

	onMount(() => {
		editor_view = new EditorView({
			parent: container,
			doc: code,
			async dispatch(transaction) {
				editor_view.update([transaction]);
			}
		});

		return () => {
			editor_view.destroy();
		};
	});

	beforeNavigate(() => {
		skip_reset = true;
	});

	afterNavigate(async () => {
		skip_reset = false;

		editor_states.clear();
	});
</script>

<svelte:window
	on:pointerdown={(e) => {
		if (!container.contains(/** @type {HTMLElement} */ (e.target))) {
			preserve_editor_focus = false;
		}
	}}
	on:message={(e) => {
		if (preserve_editor_focus && e.data.type === 'iframe_took_focus') {
			editor_view.focus();
		}
	}}
/>
<SplitPane type="vertical" min="100px" max="-4.1rem" pos="50%">
	<section class="editor-container ml-1" slot="a">
		<div
			class="container"
			bind:this={container}
			on:focusin={() => {
				clearTimeout(remove_focus_timeout);
				preserve_editor_focus = true;
			}}
			on:focusout={() => {
				// Heuristic: user did refocus themmselves if iframe_took_focus
				// doesn't happen in the next few miliseconds. Needed
				// because else navigations inside the iframe refocus the editor.
				remove_focus_timeout = setTimeout(() => {
					preserve_editor_focus = false;
				}, 200);
			}}
		></div>
	</section>

	<section slot="b" class="preview">
		Output
		<div class="editor-container ml-1 container p-6">
			<button class="btn btn-primary ml-auto"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
					/></svg
				></button
			>
			<span class="text-primary font-bold">oxido ({version})</span>
			<span class="font-light">$</span>
			{output}
		</div>
	</section>
</SplitPane>

<style>
	.container {
		width: 100%;
		height: 100%;
	}

	.fake {
		display: grid;
		grid-template-columns: 4rem 1fr;
		grid-gap: 1rem;
		padding: 1rem 0;
		font-size: 1.3rem;
		line-height: 2rem;
	}

	.fake * {
		font-family: var(--font-mono) !important;
		color: #ccc;
	}

	.fake-gutter {
		text-align: right;
		padding-right: 3px;
	}

	.fake-content {
		padding: 0 1rem;
	}

	@media (prefers-color-scheme: dark) {
		.fake * {
			color: #666;
		}
	}

	.editor-container {
		position: relative;
		background-color: var(--sk-back-3);
	}
</style>
