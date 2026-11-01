import { ArrowUpRight, Mail, Phone } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { SITE } from "../../config/site";

const FOOTER_LINK = "text-tar-cream/70 transition-colors hover:text-white";

const ICON_LINK =
  "rounded-full border border-white/15 p-2.5 text-white/75 transition hover:border-[#8bb6ff]/70 hover:text-white";

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#030916] text-tar-cream">
      <div className="site-container py-14 sm:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.5fr_.7fr_.7fr] md:gap-12 md:pb-12">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}tarvance-logo.jpeg`}
                alt=""
                className="h-11 w-11 rounded-full border border-white/10 object-cover"
              />
              <span className="font-display text-2xl font-bold tracking-[-.06em]">
                TarVance
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Custom software, websites and Google Business Profile setup for
              businesses. Based in Kolkata.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email TarVance"
                className={ICON_LINK}
              >
                <Mail size={18} />
              </a>
              <a
                href={SITE.phoneHref}
                aria-label="Call TarVance"
                className={ICON_LINK}
              >
                <Phone size={18} />
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className={ICON_LINK}
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className={ICON_LINK}
              >
                <FaInstagram size={18} />
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className={ICON_LINK}
              >
                <FaFacebook size={18} />
              </a>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className={ICON_LINK}
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-white/40">
              Explore
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link className={FOOTER_LINK} to="/about">
                About
              </Link>
              <Link className={FOOTER_LINK} to="/#expertise">
                Services
              </Link>
              <Link className={FOOTER_LINK} to="/#work">
                Selected work
              </Link>
              <Link className={FOOTER_LINK} to="/contact">
                Contact
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-white/40">
              Visit or call
            </p>
            <address className="mt-5 max-w-xs text-sm not-italic leading-6 text-white/60">
              {SITE.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a
                href={SITE.phoneHref}
                className="mt-2 block transition hover:text-white"
              >
                {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="block transition hover:text-white"
              >
                {SITE.email}
              </a>
            </address>
            <Link
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#a9c5ff] transition hover:text-white"
              to="/contact"
            >
              Start a project <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} TarVance. All rights reserved.
          </span>
          <span>{SITE.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
