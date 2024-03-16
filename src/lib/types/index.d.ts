import type { Writable } from 'svelte/store';

export interface FileStub {
	type: 'file';
	name: string;
	basename: string;
	contents: string;
	text: boolean;
}

export interface DirectoryStub {
	type: 'directory';
	name: string;
	basename: string;
}

export type Stub = FileStub | DirectoryStub;

export interface Adapter {
	/** Returns `false` if the reset was in such a way that a reload of the iframe isn't needed */
	reset(files: Array<Stub>): Promise<boolean>;
	update(file: FileStub): Promise<boolean>;
}

export interface Scope {
	prefix: string;
	name: string;
}

export interface Exercise {
	focus: string;
	title: string;
	label: string;
	slug: string;
	path: string;
	output: string;
	code: string;
	prev: { slug: string } | null;
	next: { slug: string; title: string } | null;
	markdown: string;
	html: string;
	dir: string;
}

export interface ExerciseStub {
	title: string;
	slug: string;
}

export interface ChapterStub {
	slug: string;
	title: string;
	exercises: ExerciseStub[];
}

export interface PartStub {
	slug: string;
	title: string;
	chapters: ChapterStub[];
}

export interface EditingConstraints {
	create: Set<string>;
	remove: Set<string>;
}
