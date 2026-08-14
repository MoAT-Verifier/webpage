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
		title: "MoAT",
		description: "The MoAT project.",
		keywords: "moat",
		image: `${SITE_URL}/assets/preview.jpg`,
		twitterHandle: "",
	},
	social: {
		github: "https://github.com/",
	},
};
