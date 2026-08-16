// No trailing slash: paths below are appended directly.
const SITE_URL =
	import.meta.env.PUBLIC_SITE_URL || "https://moat.verify.rwth-aachen.de";

export const siteConfig = {
	url: SITE_URL,
	meta: {
		title: "MoAT - LTL Model Checking of Infinite State Systems",
		description:
			"MoAT (Model Checking Analysis Tool) verifies LTL properties of infinite state systems by reducing model checking to fair termination, using the termination tools KoAT and LoAT in the backend.",
		keywords:
			"LTL model checking, infinite state systems, fair termination, integer transition systems, Büchi automata, termination analysis, KoAT, LoAT, program verification",
		// TODO: no Open Graph image exists yet. Point this at a file under
		// public/ once there is one; while it is empty, no og:image is emitted,
		// which beats linking a URL that 404s.
		image: "",
	},
	// The analysis service behind /interface/, deployed from the
	// `webinterface` repository. Set PUBLIC_MOAT_API_URL in the deploy
	// workflow to point the page at a different host.
	api: {
		url:
			import.meta.env.PUBLIC_MOAT_API_URL ||
			"https://moat-api.verify.rwth-aachen.de",
	},
	social: {
		// TODO: point this at the MoAT tool repository once it is public.
		github: "https://github.com/MoAT-Verifier",
	},
	contact: {
		group: "LuFG Informatik 2, RWTH Aachen University",
		groupUrl: "https://verify.rwth-aachen.de/",
	},
};
