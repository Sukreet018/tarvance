/**
 * Single source of truth for contact details and backend endpoints.
 * The values below are the ones the live site (TarVance-main) already uses, so a plain
 * `git push` keeps every form, review and link working. Override any endpoint per environment
 * with a VITE_* variable (see .env.example) without touching code.
 */
export const SITE = {
  email: "contact@tarvance.com",
  phoneDisplay: "+91 82820 17341",
  phoneHref: "tel:+918282017341",
  whatsapp: "https://wa.me/918282017341",
  calendly: "https://calendly.com/contact-tarvance",
  location: "Kolkata, India",
  address: ["227/10/1 Manicktala Main Road", "Kolkata – 700054"],
  tagline: "Build. Connect. Grow.",
  social: {
    instagram:
      "https://www.instagram.com/tarvanceweb?stkn=cGdzZ2ttZDJoN3hk&utm_source=qr",
    facebook: "https://www.facebook.com/profile.php?id=61594404690999",
    linkedin:
      "https://www.linkedin.com/company/tarvance/home/?viewAsMember=true",
  },
} as const;

/** Google Apps Script web apps that receive form submissions / serve reviews (same as the live site). */
export const ENDPOINTS = {
  contact:
    import.meta.env.VITE_CONTACT_SCRIPT_URL ??
    "https://script.google.com/macros/s/AKfycbxCGCSPZqBNZSgR3yZOXpwvT08Qf_G0ZwpT5TzAiU1-XZdl9HDTQRKX185041PI6_AD/exec",
  reviews:
    import.meta.env.VITE_REVIEWS_SCRIPT_URL ??
    "https://script.google.com/macros/s/AKfycbw9DS1j0VglI8RHVBKGQvqnvJAj2_GBQRZvu1EX1Ld0NzWToHs1qkCXhwt29KU7Y-D3/exec",
} as const;
