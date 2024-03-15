<script>
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { acceptCompletion } from '@codemirror/autocomplete';
	import { indentWithTab } from '@codemirror/commands';
	import { rust } from '@codemirror/lang-rust';
	import { indentUnit } from '@codemirror/language';
	import { setDiagnostics } from '@codemirror/lint';
	import { EditorState } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { svelteTheme } from '@sveltejs/repl/theme';
	import { basicSetup } from 'codemirror';
	import { onMount, tick } from 'svelte';
	import { autocomplete_for_rust } from './autocompletion.js';
	import './codemirror.css';

	/** @type {HTMLDivElement} */
	let container;

	let preserve_editor_focus = false;
	let skip_reset = true;

	/** @type {any} */
	let remove_focus_timeout;

	/** @type {Map<string, import('@codemirror/state').EditorState>} */
	let editor_states = new Map();

	/** @type {import('@codemirror/view').EditorView} */
	let editor_view;

	const extensions = [
		basicSetup,
		EditorState.tabSize.of(2),
		keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab]),
		indentUnit.of('\t'),
		svelteTheme
	];

	/** @param {import('$lib/types').Stub[]} $files */
	async function reset($files) {
		if (skip_reset) return;

		for (const file of $files) {
			if (file.type !== 'file') continue;

			let state = editor_states.get(file.name);

			if (state) {
				const existing = state.doc.toString();

				if (file.contents !== existing) {
					const transaction = state.update({
						changes: {
							from: 0,
							to: existing.length,
							insert: file.contents
						}
					});

					editor_states.set(file.name, transaction.state);
					state = transaction.state;
				}
			} else {
				let lang;

				if (file.name.endsWith('.oxi')) {
					lang = [rust(), ...autocomplete_for_rust()];
				}

				state = EditorState.create({
					doc: file.contents,
					extensions: lang ? [...extensions, ...lang] : extensions
				});

				editor_states.set(file.name, state);
			}
		}
	}

	/** @param {string | null} $selected_name */
	function select_state($selected_name) {
		if (skip_reset) return;

		const state =
			($selected_name && editor_states.get($selected_name)) ||
			EditorState.create({
				doc: '',
				extensions: [EditorState.readOnly.of(true)]
			});

		editor_view.setState(state);
	}

	onMount(() => {
		editor_view = new EditorView({
			parent: container,
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
>
</div>

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
</style>
