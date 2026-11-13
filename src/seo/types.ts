import seoData from "./seo.json";

export type Faq = { q: string; a: string };
export type PageSeo = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  eyebrow?: string;
  sections?: { h2: string; body: string[] }[];
  faqs?: Faq[];
};

export const seo = seoData;
export const pages = seoData.pages as unknown as Record<string, PageSeo>;
export const globalFaqs: Faq[] = seoData.faqs;

export function normalizePath(pathname: string) {
  const p = pathname.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}
