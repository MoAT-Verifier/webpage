/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// publications.bib is imported with ?raw and parsed at build time.
declare module "*.bib?raw" {
	const src: string;
	export default src;
}
