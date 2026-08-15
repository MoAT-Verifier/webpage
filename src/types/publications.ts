/**
 * Shape of one publication, mirroring the field contract of the KoAT
 * publications page (see `src/data/publications.bib` for the data source).
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
export function monthToNumber(value: string | undefined): number | undefined {
	if (!value) return undefined;
	const normalized = value.trim().toLowerCase().replace(/[.]/g, "");
	if (/^\d+$/.test(normalized)) return Number(normalized);
	return MONTHS[normalized];
}

/** year desc, then month desc, then sortkey desc. */
export function sortPublications(entries: Publication[]): Publication[] {
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
