import PrismJS from 'prismjs';
import { Marked } from 'marked';

const delimiter_substitutes = {
	'+++': '             ',
	'---': '           ',
	':::': '         '
};

/**
 * @param {string} content
 * @param {string} classname
 */
function highlight_spans(content, classname) {
	return `<span class="${classname}">${content}</span>`;
	// return content.replace(/<span class="([^"]+)"/g, (_, classnames) => {
	// 	return `<span class="${classname} ${classnames}"`;
	// });
}

/** @type {Partial<import('marked').Renderer>} */
const default_renderer = {
	code: (source, language = '') => {
		/** @type {Record<string, string>} */
		const options = {};

		let html = '';

		source = source
			.replace(/\/\/\/ (.+?)(?:: (.+))?\n/gm, (_, key, value) => {
				options[key] = value;
				return '';
			})
			.replace(/^([\-\+])?((?:    )+)/gm, (match, prefix = '', spaces) => {
				if (prefix && language !== 'diff') return match;

				// for no good reason at all, marked replaces tabs with spaces
				let tabs = '';
				for (let i = 0; i < spaces.length; i += 4) {
					tabs += '\t';
				}
				return prefix + tabs;
			})
			.replace(/(\+\+\+|---|:::)/g, (_, /** @type {keyof delimiter_substitutes} */ delimiter) => {
				return delimiter_substitutes[delimiter];
			})
			.replace(/\*\\\//g, '*/');

		const highlighted = PrismJS.highlight(source, PrismJS.languages['rust'], 'rust');

		html = `<div class="code-block">${
			options.file ? `<span class="filename">${options.file}</span>` : ''
		}<pre class='language-rust'><code>${highlighted}</code></pre></div>`;

		return html
			.replace(/ {13}([^ ][^]+?) {13}/g, (_, content) => {
				return highlight_spans(content, 'highlight add');
			})
			.replace(/ {11}([^ ][^]+?) {11}/g, (_, content) => {
				return highlight_spans(content, 'highlight remove');
			})
			.replace(/ {9}([^ ][^]+?) {9}/g, (_, content) => {
				return highlight_spans(content, 'highlight');
			});
	}
};

/**
 * @param {string} markdown
 * @param {Partial<import('marked').Renderer>} options
 */
export async function transform(markdown, options) {
	const marked = new Marked({
		renderer: {
			...default_renderer,
			...options
		}
	});

	return (await marked.parse(markdown)) ?? '';
}
