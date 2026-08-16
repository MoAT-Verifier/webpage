/**
 * The publications page, end to end: the shape of an entry, the BibTeX parser
 * that produces them at build time, and the ordering rules the list renders by.
 * The data source is `src/data/publications.bib`; nothing else needs editing to
 * add a paper.
 */

/**
 * Shape of one publication, mirroring the field contract of the KoAT
 * publications page.
 */
export interface Publication {
	/** Stable id — the BibTeX citation key. Used as the map key, never displayed. */
	key: string;
	/** Rendered verbatim as one line, exactly as authored. Not a parsed name list. */
	authors: string;
	title: string;
	year: number;
	/** Proceedings branch: booktitle (+ optionally series/volume/pages). */
	booktitle?: string;
	series?: string;
	/** Journal branch: journal (+ optionally volume/pages). */
	journal?: string;
	volume?: string;
	pages?: string;
	/** Full abstract, shown in the abstract box. */
	abstract?: string;
	/** 1-12. Only used to order entries within a year. */
	month?: number;
	/** Manual tiebreaker within a year; higher sorts first. */
	sortkey?: number;
	/** Bare DOI, without the https://doi.org/ prefix. */
	doi?: string;
	arxiv?: string;
	pdf?: string;
	site?: string;
	toAppear?: boolean;
}

// --- parsing --------------------------------------------------------------

/** Fields holding URLs/DOIs: unescape only, never rewrite dashes. */
const LINK_FIELDS = new Set(["doi", "url", "pdf", "arxiv", "site"]);

const MONTHS: Record<string, number> = {
	jan: 1,
	january: 1,
	feb: 2,
	february: 2,
	mar: 3,
	march: 3,
	apr: 4,
	april: 4,
	may: 5,
	jun: 6,
	june: 6,
	jul: 7,
	july: 7,
	aug: 8,
	august: 8,
	sep: 9,
	sept: 9,
	september: 9,
	oct: 10,
	october: 10,
	nov: 11,
	november: 11,
	dec: 12,
	december: 12,
};

/** Months are free text in BibTeX; compare them as numbers, never as strings. */
function monthToNumber(value: string | undefined): number | undefined {
	if (!value) return undefined;
	const normalized = value.trim().toLowerCase().replace(/[.]/g, "");
	if (/^\d+$/.test(normalized)) return Number(normalized);
	return MONTHS[normalized];
}

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

function parseBibtex(input: string): RawEntry[] {
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

// --- ordering and display -------------------------------------------------

/** year desc, then month desc, then sortkey desc. */
function sortPublications(entries: Publication[]): Publication[] {
	return [...entries].sort(
		(a, b) =>
			b.year - a.year ||
			(b.month ?? 0) - (a.month ?? 0) ||
			(b.sortkey ?? 0) - (a.sortkey ?? 0),
	);
}

/** Groups sorted entries into year buckets, newest year first. */
export function groupByYear(
	entries: Publication[],
): { year: number; items: Publication[] }[] {
	const groups: { year: number; items: Publication[] }[] = [];
	for (const entry of sortPublications(entries)) {
		const last = groups[groups.length - 1];
		if (last && last.year === entry.year) last.items.push(entry);
		else groups.push({ year: entry.year, items: [entry] });
	}
	return groups;
}

/** "Series Volume, Pages, Year" for proceedings, or the journal equivalent. */
export function venueLine(entry: Publication): string {
	const stem = entry.journal ?? entry.series;
	if (!stem) return "";
	return (
		[stem, entry.volume].filter(Boolean).join(" ") +
		[entry.pages, String(entry.year)]
			.filter(Boolean)
			.map((part) => `, ${part}`)
			.join("")
	);
}

/** Title-link fallback: doi -> arxiv -> site -> no link. */
export function titleHref(entry: Publication): string | undefined {
	if (entry.doi) return `https://doi.org/${entry.doi}`;
	if (entry.arxiv) return entry.arxiv;
	if (entry.site) return entry.site;
	return undefined;
}
