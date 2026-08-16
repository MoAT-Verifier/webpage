import path from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Drives canonical URLs, the sitemap and Open Graph metadata. Set in the
// deploy workflow; the fallback is the production host.
const siteUrl =
	import.meta.env.PUBLIC_SITE_URL || "https://moat.verify.rwth-aachen.de/";

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	base: "/",
	envPrefix: "PUBLIC_",
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	},

	server: {
		host: "127.0.0.1",
		port: 5200,
	},

	integrations: [sitemap()],
});
