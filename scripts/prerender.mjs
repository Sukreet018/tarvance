/**
 * Post-build step: turns the single-page app into real, crawlable HTML.
 *
 * For every route it writes dist/<route>/index.html with
 *   - its own <title>, description, canonical URL and social tags
 *   - JSON-LD structured data (business, services, FAQ, breadcrumbs)
 *   - the page text inside #root (React replaces it as soon as the app loads)
 * and it generates sitemap.xml, robots.txt and llms.txt.
 *
 * Google, Bing and AI crawlers (ChatGPT, Perplexity, Claude…) often do not run JavaScript,
 * so without this step they would see an empty page.
 *
 * No extra dependencies. Run automatically by `npm run build`.
 * Text comes from src/seo/seo.json. Reviews are fetched live from your Google Sheet at build time.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const seo = JSON.parse(readFileSync(join(root, "src/seo/seo.json"), "utf8"));
const siteUrl = (process.env.SITE_URL || seo.siteUrl).replace(/\/$/, "");
const b = seo.business;
const base = (process.env.BASE_PATH || "/").replace(/\/?$/, "/");
const today = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (path) => siteUrl + (path === "/" ? "/" : path);
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

if (!existsSync(join(dist, "index.html"))) {
  console.error("prerender: dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}
const template = readFileSync(join(dist, "index.html"), "utf8");

/* ---------- reviews (optional, from the existing Google Apps Script) ---------- */
async function loadReviews() {
  let url = process.env.VITE_REVIEWS_SCRIPT_URL;
  if (!url) {
    const cfg = readFileSync(join(root, "src/config/site.ts"), "utf8");
    url = (cfg.match(/reviews:\s*import\.meta\.env\.VITE_REVIEWS_SCRIPT_URL\s*\?\?\s*"([^"]+)"/) || [])[1];
  }
  if (!url) return [];
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .map((r) => ({
        name: String(r.name ?? "").trim().slice(0, 80),
        rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
        comment: String(r.comment ?? "").trim().slice(0, 600),
      }))
      .filter((r) => r.name && r.comment)
      .slice(-12)
      .reverse();
  } catch (e) {
    console.warn("prerender: could not load reviews, continuing without them (" + e.message + ")");
    return [];
  }
}
const reviews = await loadReviews();
console.log(`prerender: ${reviews.length} review(s) embedded`);

/* ---------- structured data ---------- */
const orgId = siteUrl + "/#organization";
const organization = {
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": orgId,
  name: b.legalName,
  url: siteUrl + "/",
  logo: siteUrl + "/tarvance-logo.jpeg",
  image: siteUrl + "/og-image.png",
  description: b.description,
  telephone: b.telephone,
  email: b.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: b.streetAddress,
    addressLocality: b.locality,
    addressRegion: b.region,
    postalCode: b.postalCode,
    addressCountry: b.country,
  },
  areaServed: b.areaServed.map((n) => ({ "@type": n === "India" ? "Country" : "Place", name: n })),
  sameAs: b.sameAs,
  knowsAbout: seo.services.map((s) => s.name),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "TarVance services",
    itemListElement: seo.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: s.description, provider: { "@id": orgId } },
    })),
  },
};

function faqNode(faqs) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function graphFor(path, page) {
  const graph = [organization];
  if (path === "/") {
    graph.push({
      "@type": "WebSite",
      "@id": siteUrl + "/#website",
      url: siteUrl + "/",
      name: seo.siteName,
      inLanguage: "en-IN",
      publisher: { "@id": orgId },
    });
  }
  const type = path === "/about" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage";
  graph.push({
    "@type": type,
    "@id": abs(path) + "#webpage",
    url: abs(path),
    name: page.title,
    description: page.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": siteUrl + "/#website" },
    about: { "@id": orgId },
  });
  if (path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
        { "@type": "ListItem", position: 2, name: page.h1, item: abs(path) },
      ],
    });
  }
  const faqs = path === "/" ? seo.faqs : page.faqs;
  if (faqs && faqs.length) graph.push(faqNode(faqs));
  return { "@context": "https://schema.org", "@graph": graph };
}

/* ---------- head block ---------- */
function headFor(path, page) {
  const url = abs(path);
  return `<!--seo:start-->
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <meta property="og:site_name" content="${esc(seo.siteName)}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${siteUrl}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${siteUrl}/og-image.png" />
    <meta name="geo.region" content="IN-WB" />
    <meta name="geo.placename" content="Kolkata" />
    <script type="application/ld+json">${json(graphFor(path, page))}</script>
    <!--seo:end-->`;
}

/* ---------- visible-without-JS body content ---------- */
const NAV = [
  ["/", "Home"],
  ["/about", "About"],
  ["/software-company-kolkata", "Software company in Kolkata"],
  ["/website-development-maharashtra", "Website development in Maharashtra"],
  ["/contact", "Contact"],
];

function faqHtml(faqs) {
  return `<section><h2>Frequently asked questions</h2>${faqs
    .map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`)
    .join("")}</section>`;
}

function bodyFor(path, page) {
  const parts = [];
  parts.push(`<header><a href="${base}">TarVance</a><nav aria-label="Main">${NAV.map(([h, l]) => `<a href="${base}${h.slice(1)}">${esc(l)}</a>`).join(" ")}</nav></header>`);
  parts.push(`<main><h1>${esc(path === "/" ? "We build digital solutions. Software company in Kolkata." : page.h1)}</h1><p>${esc(page.intro)}</p>`);

  if (page.sections) {
    for (const s of page.sections) parts.push(`<section><h2>${esc(s.h2)}</h2>${s.body.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`);
  }
  if (path === "/" || page.sections) {
    parts.push(`<section><h2>Services</h2><ul>${seo.services.map((s) => `<li><strong>${esc(s.name)}</strong>: ${esc(s.description)}</li>`).join("")}</ul></section>`);
  }
  if (path === "/" ) parts.push(faqHtml(seo.faqs));
  else if (page.faqs) parts.push(faqHtml(page.faqs));

  if (path === "/" && reviews.length) {
    parts.push(`<section><h2>What clients say</h2>${reviews
      .map((r) => `<blockquote><p>${esc(r.comment)}</p><footer>${esc(r.name)} (${r.rating}/5)</footer></blockquote>`)
      .join("")}</section>`);
  }
  parts.push(`<section><h2>Contact TarVance</h2><address>${esc(b.streetAddress)}, ${esc(b.locality)} – ${esc(b.postalCode)}, ${esc(b.region)}, India<br>Phone: <a href="tel:${esc(b.telephone)}">+91 82820 17341</a><br>Email: <a href="mailto:${esc(b.email)}">${esc(b.email)}</a></address></section></main>`);
  parts.push(`<footer><p>© ${new Date().getFullYear()} TarVance, Kolkata, India.</p></footer>`);

  return `<div id="seo-static" aria-hidden="true" style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${parts.join("")}</div>`;
}

/* ---------- write pages ---------- */
function render(path, page) {
  let html = template.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, headFor(path, page));
  html = html.replace(/<div id="root"><\/div>/, `<div id="root"></div>${bodyFor(path, page)}`);
  return html;
}

const routes = Object.keys(seo.pages);
for (const path of routes) {
  const html = render(path, seo.pages[path]);
  if (path === "/") writeFileSync(join(dist, "index.html"), html);
  else {
    mkdirSync(join(dist, path), { recursive: true });
    writeFileSync(join(dist, path, "index.html"), html);
  }
}

// /order used to be its own page; send people (and crawlers) to /contact.
mkdirSync(join(dist, "order"), { recursive: true });
writeFileSync(
  join(dist, "order", "index.html"),
  `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><title>Redirecting…</title><meta name="robots" content="noindex"><link rel="canonical" href="${abs("/contact")}"><meta http-equiv="refresh" content="0; url=/contact"></head><body><a href="/contact">Continue to the contact page</a></body></html>`,
);

/* ---------- sitemap, robots, llms.txt ---------- */
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((p) => `  <url><loc>${abs(p)}</loc><lastmod>${today}</lastmod><priority>${p === "/" ? "1.0" : p === "/contact" ? "0.8" : "0.7"}</priority></url>`)
    .join("\n")}\n</urlset>\n`,
);

writeFileSync(
  join(dist, "robots.txt"),
  `# Search engines and AI assistants are welcome to read this site.
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
);

writeFileSync(
  join(dist, "llms.txt"),
  `# ${seo.siteName}

> ${b.description}

TarVance is based at ${b.streetAddress}, ${b.locality} – ${b.postalCode}, ${b.region}, India. Phone: +91 82820 17341. Email: ${b.email}.

## Pages
${routes.map((p) => `- [${seo.pages[p].h1}](${abs(p)}): ${seo.pages[p].description}`).join("\n")}

## Services
${seo.services.map((s) => `- ${s.name}: ${s.description}`).join("\n")}

## Areas served
${b.areaServed.join(", ")}

## Frequently asked questions
${seo.faqs.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}
`,
);

console.log(`prerender: wrote ${routes.length} pages + sitemap.xml, robots.txt, llms.txt for ${siteUrl}`);
