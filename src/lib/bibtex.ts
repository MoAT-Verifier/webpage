import type { Publication } from "@/types/publications";
import { monthToNumber } from "@/types/publications";

/** Fields holding URLs/DOIs: unescape only, never rewrite dashes. */
const LINK_FIELDS = new Set(["doi", "url", "pdf", "arxiv", "site"]);

function unescapeLatex(value: string): string {
	return value
		.replace(/\\([&_%$#])/g, "$1")
		.replace(/[{}]/g, "")
		.trim();
}

/** LaTeX-to-Unicode for the cases this bibliography actually uses. */
function decodeText(value: string): string {
	return unescapeLatex(value)
		.replace(/---/g, "—")
		.replace(/--/g, "–")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Drops BibTeX comment lines. Only lines whose first non-blank character is `%`
 * are removed, so percent-encoded URLs (`.../a%20b`) survive untouched.
 */
function stripComments(source: string): string {
	return source.replace(/^[ \t]*%.*$/gm, "");
}

interface RawEntry {
	type: string;
	key: string;
	fields: Record<string, string>;
}

function parseFields(body: string): Record<string, string> {
	const fields: Record<string, string> = {};
	const parts: string[] = [];
	let depth = 0;
	let current = "";
	for (const ch of body) {
		if (ch === "{") depth++;
		else if (ch === "}") depth--;
		if (ch === "," && depth === 0) {
			parts.push(current);
			current = "";
			continue;
		}
		current += ch;
	}
	parts.push(current);

	for (const part of parts) {
		const eq = part.indexOf("=");
		if (eq === -1) continue;
		const name = part.slice(0, eq).trim().toLowerCase();
		if (!name) continue;
		let value = part.slice(eq + 1).trim();
		if (
			(value.startsWith("{") && value.endsWith("}")) ||
			(value.startsWith('"') && value.endsWith('"'))
		) {
			value = value.slice(1, -1);
		}
		fields[name] = LINK_FIELDS.has(name)
			? unescapeLatex(value)
			: decodeText(value);
	}
	return fields;
}

export function parseBibtex(input: string): RawEntry[] {
	const source = stripComments(input);
	const entries: RawEntry[] = [];
	const header = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;
	let match: RegExpExecArray | null = header.exec(source);
	while (match !== null) {
		let depth = 1;
		let i = header.lastIndex;
		while (i < source.length && depth > 0) {
			if (source[i] === "{") depth++;
			else if (source[i] === "}") depth--;
			if (depth === 0) break;
			i++;
		}
		entries.push({
			type: match[1].toLowerCase(),
			key: match[2],
			fields: parseFields(source.slice(header.lastIndex, i)),
		});
		header.lastIndex = i + 1;
		match = header.exec(source);
	}
	return entries;
}

export function toPublications(source: string): Publication[] {
	const publications = parseBibtex(source).map((entry) => {
		const f = entry.fields;
		return {
			key: entry.key,
			authors: f.author ?? "",
			title: f.title ?? "",
			year: Number(f.year ?? 0),
			booktitle: f.booktitle || undefined,
			series: f.series || undefined,
			journal: f.journal || undefined,
			volume: f.volume || undefined,
			pages: f.pages || undefined,
			abstract: f.abstract || undefined,
			month: monthToNumber(f.month),
			sortkey: f.sortkey ? Number(f.sortkey) : undefined,
			doi: f.doi || undefined,
			arxiv: f.arxiv || undefined,
			pdf: f.pdf || undefined,
			site: f.site || undefined,
			// Presence-only flag, mirroring the `to_appear = {}` convention.
			toAppear: "to_appear" in f,
		} satisfies Publication;
	});

	// Fail the build loudly rather than shipping a "NaN" year heading.
	const broken = publications.find(
		(p) => !Number.isFinite(p.year) || p.year === 0,
	);
	if (broken) {
		throw new Error(
			`publications.bib: entry "${broken.key}" has a missing or invalid year`,
		);
	}
	return publications;
}
