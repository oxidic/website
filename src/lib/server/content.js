import { transform } from './markdown.js';

/**
 * @param {string} path
 */
async function readFile(path) {
	return await (
		await fetch(`https://raw.githubusercontent.com/oxidic/website/main/${path}`)
	).text();
}

/**
 * @param {string} slug
 */
export async function get_exercise(slug) {

	const dir = `content/tutorial${slug}`;


	const text = await readFile(`${dir}/README.md`);
	const meta = JSON.parse(await readFile(`${dir}/meta.json`));
	const { frontmatter, markdown } = extract_frontmatter(text, dir);
	const { title, path = '/', focus } = frontmatter;

	return {
		part: {
			slug: dir,
			title: `Part ${dir.slice(1, 2)}`,
			label: meta.title
		},
		focus: focus ?? meta.focus,
		title,
		path,
		slug,
		dir,
		markdown,
		html: await transform(markdown, {
			codespan: (text) => `<code>${text}</code>`
		})
	};
}

/**
 * @param {string} markdown
 * @param {string} dir
 */
function extract_frontmatter(markdown, dir) {
	const match = /---\n([^]+?)\n---\n([^]+)/.exec(markdown);
	if (!match) {
		throw new Error(`bad markdown for ${dir}`);
	}

	/** @type {Record<string, string>} */
	const frontmatter = {};

	for (const line of match[1].split('\n')) {
		const index = line.indexOf(':');
		if (index !== -1) {
			frontmatter[line.slice(0, index).trim()] = line.slice(index + 1).trim();
		}
	}

	return { frontmatter, markdown: match[2] };
}