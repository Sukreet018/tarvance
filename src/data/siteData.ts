import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  Code2,
  Layers3,
  MapPin,
  Search,
  Wrench,
} from "lucide-react";

export type Service = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** File name inside public/services/ */
  image: string;
  tags: string[];
  /** Offered alongside the main software work, not as a standalone focus. */
  side?: boolean;
};

/**
 * TarVance is a software company first. Websites, Google Business Profile and SEO support that work.
 * Content and video are offered as an add-on, so they come last and are marked as a side service.
 */
export const services: Service[] = [
  {
    number: "01",
    title: "Custom software",
    description:
      "Web apps, dashboards, booking and billing systems, and internal tools. We build around how your business already runs, so your team isn't forced to change how they work.",
    icon: Layers3,
    image: "custom-software.jpg",
    tags: ["Web apps", "Internal tools", "Dashboards"],
  },
  {
    number: "02",
    title: "Websites",
    description:
      "Custom-built, fast, mobile-friendly websites. We design them from scratch around your business, with clear pages and an easy way for customers to get in touch.",
    icon: Code2,
    image: "websites.jpg",
    tags: ["Custom design", "Mobile-first", "Forms"],
  },
  {
    number: "03",
    title: "Google Business Profile",
    description:
      "We set up and optimise your Google Business Profile so customers nearby can find you on Search and Maps, with the right details, photos and hours.",
    icon: MapPin,
    image: "google-business.jpg",
    tags: ["Profile setup", "Local search", "Maps"],
  },
  {
    number: "04",
    title: "SEO",
    description:
      "Practical search optimisation for your site: page structure, speed, and content that helps people find you when they search for what you do.",
    icon: Search,
    image: "seo.jpg",
    tags: ["On-page SEO", "Site speed", "Local SEO"],
  },
  {
    number: "05",
    title: "Maintenance and support",
    description:
      "Updates, fixes and small changes after launch. We keep your website, software and Google profile accurate, secure and running.",
    icon: Wrench,
    image: "maintenance.jpg",
    tags: ["Updates", "Fixes", "Hosting help"],
  },
  {
    number: "06",
    title: "Content and video",
    description:
      "Content writing and video production to go with your website or software. We offer this as an add-on to our main work.",
    icon: Clapperboard,
    image: "content-video.jpg",
    tags: ["Content marketing", "Videography"],
    side: true,
  },
];

export const principles = [
  {
    number: "01",
    title: "Keep it simple",
    text: "Good software is the kind people can use without a manual. We leave out what you don't need.",
  },
  {
    number: "02",
    title: "Build it to last",
    text: "We think about what happens after launch: the updates, the new features, and whoever has to maintain it next year.",
  },
  {
    number: "03",
    title: "Say it straight",
    text: "If something won't work, or isn't worth the money, we'll tell you. You'll always know where your project stands.",
  },
];

export const samples = [
  {
    name: "Ember & Olive",
    kind: "Café website · Brand & menu",
    year: "2026",
    url: "https://cafe.tarvance.com/",
    img: "photo-1501339847302-ac426a4a7cbb",
  },
  {
    name: "GymX",
    kind: "Gym website · Memberships",
    year: "2026",
    url: "https://gym.tarvance.com/",
    img: "photo-1534438327276-14e5300c3a48",
  },
  {
    name: "Lumina Spa & Salon",
    kind: "Spa website · Online booking",
    year: "2026",
    url: "https://spa.tarvance.com",
    img: "photo-1540555700478-4be289fbecef",
  },
  {
    name: "DentalCare",
    kind: "Clinic website · Patient portal",
    year: "2026",
    url: "https://clinic.tarvance.com/DentalCare",
    img: "photo-1629909613654-28e377c37b09",
  },
];
