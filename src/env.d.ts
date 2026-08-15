/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.bib?raw" {
	const src: string;
	export default src;
}

declare module "aos" {
	const AOS: {
		init: (options?: Record<string, unknown>) => void;
	};

	export default AOS;
}

interface Window {
	darkMode: boolean;
	stickyHeaderFuncionality: () => void;
	evaluateHeaderPosition: () => void;
	applyMenuItemClasses: () => void;
	openMobileMenu: () => void;
	closeMobileMenu: () => void;
}
