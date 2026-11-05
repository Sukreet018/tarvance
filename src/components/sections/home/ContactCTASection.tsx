import {  Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../../ui/Reveal";
import { SITE } from "../../../config/site";
import { button } from "../../ui/button";
import { fadeBottom, skyGrid } from "../../ui/patterns";

export default function ContactCTASection() {
  return (
    <section className="section-pad bg-tar-paper">
      <div className="site-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] bg-tar-navy px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div
              className={`${skyGrid} ${fadeBottom} absolute inset-0 opacity-55`}
            />
            <div className="absolute -right-16 -top-28 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -right-1 -top-12 h-52 w-52 rounded-full border border-white/10" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="eyebrow text-[#a7c2ff]">Get in touch</span>
                <h2 className="display-heading mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-7xl">
                  Have a project in mind?
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                  Tell us what you need. We’ll talk it through, give you honest
                  advice, and let you know if we’re the right fit.
                </p>
              </div>
              <Link to="/contact" className={button("primary", "lg", "w-fit")}>
                Start a project 
              </Link>
            </div>
            <div className="relative mt-11 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-sm text-white/65">
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <Phone size={15} /> {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <Mail size={15} /> {SITE.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
