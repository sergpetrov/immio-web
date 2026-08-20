/**
 * Renders the social card(s) in public/og/ from SVG.
 *
 * Run manually after changing the card design — the output is committed, so
 * the deploy build never depends on a rasteriser or on locally installed
 * fonts:
 *
 *   node scripts/generate-og-images.mjs
 *
 * Per-rule cards (flag + rule title + threshold, all of which already live in
 * the rule frontmatter) are the intended next step here; the layout below is
 * written so the text block can be swapped per rule without touching the
 * frame.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Resvg } from "@resvg/resvg-js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const fontPath = resolve(here, "fonts/RethinkSans.ttf");
const outputDir = resolve(repoRoot, "public/og");

const WIDTH = 1200;
const HEIGHT = 630;

const BRAND = {
  ink: "#1a1a1a",
  muted: "#6d6d6d",
  faint: "#a5a5a7",
  blue: "#007aff",
  blueLight: "#5eabff",
  surface: "#ffffff",
  wash: "#f8f9fb",
};

/*
 * NOTE: resvg rasterises a variable font at its default (Regular) instance,
 * so `font-weight` has no effect. Headings use a hairline stroke in the fill
 * colour to restore the intended visual weight.
 */

/** The logo mark from public/logo.svg, flattened (no filters) for rasterising. */
function logoMark(x, y, size) {
  const scale = size / 900;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
      <circle cx="450" cy="450" r="450" fill="url(#ogLogoGradient)"/>
      <path d="M283.575 759.634C275.502 766.526 263.249 759.452 265.181 749.015L324.323 429.705C326.125 419.974 338.699 417.129 344.516 425.135L403.834 506.795C403.833 506.798 403.826 506.809 403.825 506.811L346.042 625.589C344.818 628.106 348.368 630.155 349.935 627.837L423.908 518.407L423.916 518.395L524.408 528.982C534.248 530.019 538.069 542.329 530.544 548.754L283.575 759.634Z" fill="white"/>
      <path d="M616.519 140.489C624.591 133.597 636.845 140.672 634.912 151.108L575.771 470.418C573.969 480.149 561.394 482.995 555.578 474.988L496.26 393.328C496.261 393.325 496.268 393.314 496.269 393.312L554.052 274.534C555.276 272.017 551.726 269.968 550.159 272.286L476.186 381.716L476.178 381.728L375.686 371.141C365.846 370.104 362.025 357.794 369.55 351.369L616.519 140.489Z" fill="white"/>
    </g>`;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildCardSvg({ headlineLines, subline, eyebrow }) {
  const headline = headlineLines
    .map(
      (line, index) =>
        `<text x="96" y="${318 + index * 74}" font-family="Rethink Sans" font-size="62" font-weight="700" fill="${BRAND.ink}" stroke="${BRAND.ink}" stroke-width="1.4">${escapeXml(line)}</text>`,
    )
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="ogLogoGradient" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
        <stop offset="0.048" stop-color="${BRAND.blueLight}"/>
        <stop offset="0.298" stop-color="#409cff"/>
        <stop offset="0.663" stop-color="${BRAND.blue}"/>
      </linearGradient>
      <linearGradient id="ogWash" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${BRAND.surface}"/>
        <stop offset="1" stop-color="#eef4fd"/>
      </linearGradient>
    </defs>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#ogWash)"/>
    <rect width="${WIDTH}" height="10" fill="url(#ogLogoGradient)"/>

    ${logoMark(96, 88, 84)}
    <text x="200" y="146" font-family="Rethink Sans" font-size="42" font-weight="800" fill="${BRAND.ink}" stroke="${BRAND.ink}" stroke-width="1.1">Immio</text>

    <text x="96" y="236" font-family="Rethink Sans" font-size="24" font-weight="700" fill="${BRAND.blue}" stroke="${BRAND.blue}" stroke-width="0.5" letter-spacing="3">${escapeXml(eyebrow.toUpperCase())}</text>

    ${headline}

    <text x="96" y="${318 + headlineLines.length * 74 + 22}" font-family="Rethink Sans" font-size="28" font-weight="400" fill="${BRAND.muted}">${escapeXml(subline)}</text>

    <text x="96" y="${HEIGHT - 60}" font-family="Rethink Sans" font-size="24" font-weight="600" fill="${BRAND.faint}">immio.app</text>
  </svg>`;
}

const CARDS = [
  {
    file: "immio-default.png",
    eyebrow: "Rule Guide",
    headlineLines: ["Tax residency, visa and", "immigration day rules"],
    subline: "Plain-English guides, sourced from official government guidance.",
  },
];

function render(svg) {
  const options = {
    fitTo: { mode: "width", value: WIDTH },
    font: {
      loadSystemFonts: !existsSync(fontPath),
      defaultFontFamily: "Rethink Sans",
    },
  };
  if (existsSync(fontPath)) {
    options.font.fontFiles = [fontPath];
  } else {
    console.warn(`! ${fontPath} missing — falling back to system fonts.`);
  }
  return new Resvg(svg, options).render().asPng();
}

mkdirSync(outputDir, { recursive: true });

for (const card of CARDS) {
  const png = render(buildCardSvg(card));
  const target = resolve(outputDir, card.file);
  writeFileSync(target, png);
  console.log(`✓ ${card.file} — ${WIDTH}×${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB`);
}
