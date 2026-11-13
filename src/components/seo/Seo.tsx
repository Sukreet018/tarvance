import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { normalizePath, pages, seo } from "../../seo/types";

function setMeta(selector: string, attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/**
 * Keeps <title>, description, canonical and social tags correct while people navigate the app.
 * (Search engines and AI crawlers get the same values from the pre-rendered HTML, see scripts/prerender.mjs.)
 */
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = normalizePath(pathname);
    const page = pages[path];
    const url = seo.siteUrl.replace(/\/$/, "") + (path === "/" ? "/" : path);

    const title = page ? page.title : "Page not found | TarVance";
    const description = page ? page.description : pages["/"].description;

    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", page ? "index, follow, max-image-preview:large" : "noindex, follow");
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [pathname]);

  return null;
}
