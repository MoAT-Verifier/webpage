/** @type {import('tailwindcss').Config} */
// Loaded from src/styles/global.css via @config. The palette itself lives in
// that file's @theme block; all this adds is the class-based dark mode the
// header's toggle switches on.
export default {
	darkMode: "class",
	content: ["./src/**/*.{astro,html,js,ts,md}"],
};
