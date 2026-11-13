# What to do after you upload

## 1. Replace the files
Delete everything in the GitHub repo except the hidden `.git` folder, copy the contents of this folder in, commit and push to `main`.

## 2. GitHub Pages settings (important)
Repo -> Settings -> Pages:
- Source: **GitHub Actions** (the old site may have used "Deploy from a branch").
- Custom domain: your real domain (the code assumes `https://tarvance.com`; if you use `www.`, change `siteUrl` in `src/seo/seo.json` and `SITE_URL` in `.github/workflows/deploy.yml`).
- Tick "Enforce HTTPS".

## 3. Things only you can do (these decide ranking more than code)
1. **Google Search Console**: add the domain, verify, submit `https://tarvance.com/sitemap.xml`, then "Request indexing" for each page.
2. **Bing Webmaster Tools**: import from Search Console. ChatGPT search and Copilot use Bing's index.
3. **Google Business Profile** for TarVance: same name, address and phone as the website (227/10/1 Manicktala Main Road, Kolkata 700054, +91 82820 17341). Add category "Software company", services, photos, and ask real clients for Google reviews.
4. Put the same name/address/phone on Instagram, Facebook, LinkedIn, Justdial, Sulekha, IndiaMART.
5. Get links from real places: client websites ("Built by TarVance" footer link to https://tarvance.com), directories like Clutch/GoodFirms, local business groups.
6. Add real client case studies when you have them.

## 4. Check it worked
- View source of https://tarvance.com/about: you should see the page text, not an empty `<div id="root">`.
- Test https://search.google.com/test/rich-results with the home page.
- Open /robots.txt, /sitemap.xml, /llms.txt.
