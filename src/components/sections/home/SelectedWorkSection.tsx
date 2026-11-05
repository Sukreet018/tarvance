import {
  ArrowUpRight,
  CalendarCheck,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { samples } from "../../../data/siteData";
import Reveal from "../../ui/Reveal";
import { SITE } from "../../../config/site";
import { button } from "../../ui/button";
import { FaWhatsapp } from "react-icons/fa";


const calls = [
  { label: "Book a call", href: SITE.calendly, Icon: CalendarCheck },
  { label: SITE.phoneDisplay, href: SITE.phoneHref, Icon: Phone },
  { label: "WhatsApp us", href: SITE.whatsapp, Icon: FaWhatsapp },
];

export default function SelectedWorkSection() {
  return (
    <section
      id="work"
      className="section-pad scroll-mt-24 bg-tar-cream text-tar-navy"
    >
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">Our work</span>
          <h2 className="display-heading mt-5 text-[clamp(2.8rem,6vw,5.5rem)]">
            See what your site{" "}
            <em className="text-tar-royal">could look like.</em>
          </h2>
          <p className="mt-4 max-w-lg text-tar-navy/60">
            These are demo sites we built for a café, a gym, a spa and a dental
            clinic. Open any of them and have a click around.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {samples.map((s, i) => (
            <Reveal
              key={s.name}
              delay={(i % 2) * 0.1}
              className={i % 2 ? "md:mt-24" : ""}
            >
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="overflow-hidden rounded-md bg-tar-navy shadow-[0_30px_70px_-30px_rgba(7,22,63,.55)]">
                  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                    <i className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    <i className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    <i className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    <span className="ml-3 truncate font-mono text-[11px] text-white/45">
                      {s.url.replace("https://", "")}
                    </span>
                  </div>
                  <div className="aspect-4/3 overflow-hidden">
                    <motion.img
                      src={`https://images.unsplash.com/${s.img}?auto=format&fit=crop&w=1600&q=80`}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="display-heading text-4xl sm:text-5xl">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-sm text-tar-navy/60">{s.kind}</p>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-tar-royal">
                    Sample{" "}
                    <ArrowUpRight
                      size={16}
                      className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-tar-navy/15 pt-10 lg:flex-row lg:items-center">
          <p className="display-heading text-3xl sm:text-4xl">
            Want something like this for your business?
          </p>
          <div className="flex flex-wrap gap-3">
            {calls.map(({ label, href, Icon }, i) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={button(i === 0 ? "navy" : "outline", "lg")}
              >
                <Icon size={18} />
                {label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
