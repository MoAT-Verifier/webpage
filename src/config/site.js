// No trailing slash: paths below are appended directly.
const SITE_URL = import.meta.env.PUBLIC_SITE_URL || "https://moat.verify.rwth-aachen.de";

export const siteConfig = {
	title: "MoAT",
	author: "",
	url: SITE_URL,
	utm: {
		source: SITE_URL,
		medium: "referral",
		campaign: "navigation",
	},
	meta: {
		title: "MoAT - LTL Model Checking of Infinite State Systems",
		description:
			"MoAT (Model Checking Analysis Tool) verifies LTL properties of infinite state systems by reducing model checking to fair termination, using the termination tools KoAT and LoAT in the backend.",
		keywords:
			"LTL model checking, infinite state systems, fair termination, integer transition systems, Büchi automata, termination analysis, KoAT, LoAT, program verification",
		image: `${SITE_URL}/assets/preview.jpg`,
		twitterHandle: "",
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
