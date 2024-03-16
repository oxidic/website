<script>
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import Editor from './Editor.svelte';
	import ScreenToggle from './ScreenToggle.svelte';
	import Sidebar from './Sidebar.svelte';

	export let data;

	let path = data.exercise.path;
	let show_editor = false;
	let show_filetree = false;
	let paused = false;
	let w = 1000;

	/** @type {import('$lib/types').Stub[]} */
	let previous_files = [];

	$: mobile = w < 800; // for the things we can't do with media queries

	afterNavigate(async () => {
		w = window.innerWidth;
	});

	/** @param {string} code */
	function normalise(code) {
		// TODO think about more sophisticated normalisation (e.g. truncate multiple newlines)
		return code.replace(/\s+/g, ' ').trim();
	}

	/** @type {HTMLElement} */
	let sidebar;

	/** @type {import('./$types').Snapshot<number>} */
	export const snapshot = {
		capture: () => {
			const scroll = sidebar.scrollTop;
			sidebar.scrollTop = 0;
			return scroll;
		},
		restore: (scroll) => {
			sidebar.scrollTop = scroll;
		}
	};
</script>

<svelte:head>
	<title>Guide / {data.exercise.title} • Oxido Tutorial</title>

	<meta property="og:title" content="{data.exercise.title} • Oxido Tutorial" />
	<meta property="og:url" content="https://oxido.megatank58.xyz" />
	<meta property="og:type" content="website" />
</svelte:head>

<svelte:window
	bind:innerWidth={w}
	on:popstate={(e) => {
		const q = new URLSearchParams(location.search);
		const file = q.get('file');

		show_editor = true;
	}}
/>

<div class="container" class:mobile>
	<div class="top" class:offset={show_editor}>
		<SplitPane id="main" type="horizontal" min="360px" max="50%" pos="33%">
			<section slot="a" class="content">
				<Sidebar bind:sidebar index={data.index} exercise={data.exercise} />
			</section>

			<section slot="b">
				<SplitPane type="vertical" min="100px" max="-4.1rem" pos="50%">
					<section class="editor-container mx-4" slot="a">
						<Editor code={data.exercise.code} />
					</section>

					<section slot="b" class="preview">
						<!-- <Output exercise={data.exercise} {paused} /> -->
						Output
					</section>
				</SplitPane>
			</section>
		</SplitPane>
	</div>

	<div class="screen-toggle">
		<ScreenToggle
			on:change={(e) => {
				show_editor = e.detail.pressed;

				const url = new URL(location.origin + location.pathname);

				if (show_editor) {
					url.searchParams.set('file', '');
				}

				history.pushState({}, '', url);
			}}
			pressed={show_editor}
		/>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: calc(100dvh - var(--sk-nav-height));
		/** necessary for innerWidth to be correct, so we can determine `mobile` */
		width: 100vw;
		overflow: hidden;
	}

	.top {
		width: 200vw;
		margin-left: -100vw;
		height: 0;
		flex: 1;
		transition: transform 0.2s;
		/* we transform the default state, rather than the editor state, because otherwise
		   the positioning of tooltips is wrong (doesn't take into account transforms) */
		transform: translate(50%, 0);
	}

	.top.offset {
		transform: none;
	}

	.screen-toggle {
		height: 4.6rem;
	}

	.content {
		display: flex;
		flex-direction: column;
		position: relative;
		min-height: 100%;
		height: 100%;
		background: var(--sk-back-3);
		--menu-width: 5rem;
	}

	.navigator {
		position: relative;
		background: var(--sk-back-2);
		display: flex;
		flex-direction: column;
	}

	.navigator .solve {
		position: relative;
		background: var(--sk-theme-2);
		padding: 0.5rem;
		width: 100%;
		height: 4rem;
		border-right: 1px solid var(--sk-back-4);
		color: white;
		opacity: 1;
	}

	.navigator .solve:disabled {
		opacity: 0.5;
	}

	.navigator .solve:not(:disabled) {
		background: var(--sk-theme-1);
	}

	.navigator .solve.completed {
		background: var(--sk-theme-2);
	}

	.preview {
		display: flex;
		flex-direction: column;
	}

	.editor-container {
		position: relative;
		background-color: var(--sk-back-3);
	}

	.mobile .navigator {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 1rem;
		gap: 1rem;
	}

	.mobile .navigator .file {
		flex: 1;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		/* put ellipsis at start */
		direction: rtl;
		text-align: left;
	}

	.mobile .navigator .solve {
		width: 9rem;
		height: auto;
		padding: 0.2rem;
		border-radius: 4rem;
		border: none;
	}

	.mobile-filetree {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}

	/* on mobile, override the <SplitPane> controls */
	@media (max-width: 799px) {
		:global([data-pane='main']) {
			--pos: 50% !important;
		}

		:global([data-pane='editor']) {
			--pos: 5.4rem !important;
		}

		:global([data-pane]) :global(.divider) {
			cursor: default;
		}
	}

	@media (min-width: 800px) {
		.top {
			width: 100vw;
			margin: 0;
			transform: none;
		}

		.screen-toggle {
			display: none;
		}
	}
</style>
