import {  CheckCircle2, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { principles } from "../data/siteData";
import ZoomHero from "../components/visuals/ZoomHero";
import Reveal from "../components/ui/Reveal";
import SectionHeader from "../components/ui/SectionHeader";
import HowWeWorkSection from "../components/sections/home/HowWeWorkSection";
import TeamSection from "../components/sections/home/TeamSection";
import { button } from "../components/ui/button";

export default function AboutPage() {
  return (
    <>
      <ZoomHero
        label="About TarVance"
        text="We connect good ideas to meaningful progress."
        caption="Where an idea meets the people who build it."
      />
      <section className="bg-[#030916] pb-24 pt-8 text-tar-cream">
        <div className="site-container max-w-3xl">
          <Reveal>
            <span className="eyebrow text-[#8bb6ff]">Who we are</span>
            <h2 className="display-heading mt-5 text-4xl sm:text-5xl">
              A software company based in Kolkata.
            </h2>
            <p className="mt-5 text-lg leading-8 text-tar-cream/65">
              TarVance builds custom software and websites for businesses. We
              also set up Google Business Profiles and handle SEO, so customers
              can actually find you. Once you’re live, we stay on to keep things
              running.
            </p>
            <Link to="/contact" className={button("light", "lg", "mt-8")}>
              Work with us 
            </Link>
          </Reveal>
        </div>
      </section>
      <TeamSection
        showLink={false}
        title="The people you’ll work with."
        description="A small team in Kolkata that designs, builds and supports everything we deliver."
      />
      <section className="section-pad bg-[#f1eee5]">
        <div className="site-container">
          <Reveal>
            <SectionHeader
              eyebrow="Our focus"
              title="Software first."
              description="Software and websites are what we do every day. Content and video are something we can add on top."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
            <Reveal>
              <article className="relative h-full overflow-hidden rounded-3xl bg-tar-navy p-7 text-white sm:p-10">
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10"
                />
                <span className="relative font-mono text-[11px] uppercase tracking-[.22em] text-[#8bb6ff]">
                  What we do
                </span>
                <h3 className="relative mt-4 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">
                  Software and websites
                </h3>
                <ul className="relative mt-7 grid gap-3 text-[0.95rem] text-white/75 sm:grid-cols-2">
                  {[
                    "Custom software and web apps",
                    "Business websites",
                    "Google Business Profile setup",
                    "SEO",
                    "Maintenance and support",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#8bb6ff]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className="h-full rounded-3xl border border-tar-navy/10 bg-[#fbf8ee] p-7 sm:p-10">
                <span className="font-mono text-[11px] uppercase tracking-[.22em] text-[#4264b9]">
                  Also available
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold tracking-[-.04em] text-tar-navy sm:text-4xl">
                  Content and video
                </h3>
                <p className="mt-5 text-[0.95rem] leading-7 text-slate-600">
                  If you’d like written content or video to go with your website
                  or software, we can do that too. It’s an add-on to our main
                  work rather than our focus.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="section-pad bg-tar-paper">
        <div className="site-container grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <SectionHeader
              eyebrow="How we think"
              title="A few things we care about."
              description="Nothing fancy. These are the habits behind how we work with clients."
            />
          </Reveal>
          <div className="grid gap-4">
            {principles.map((item, index) => (
              <Reveal key={item.number} delay={index * 0.08}>
                <article className="rounded-2xl border border-tar-navy/10 bg-[#fbf8ee] p-6 sm:p-7">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf0ff] text-xs font-extrabold text-[#244ec4]">
                      {item.number}
                    </span>
                    <h2 className="font-display text-xl font-bold tracking-[-.03em] text-tar-navy">
                      {item.title}
                    </h2>
                  </div>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <HowWeWorkSection />
      <section className="section-pad bg-tar-paper">
        <div className="site-container">
          <Reveal>
            <div className="rounded-3xl border border-tar-navy/10 bg-[#fbf8ee] p-8 sm:p-12">
              <div className="grid gap-9 lg:grid-cols-[1fr_.8fr] lg:items-center">
                <div>
                  <span className="eyebrow">What to expect</span>
                  <h2 className="display-heading mt-5 text-4xl text-tar-navy sm:text-5xl">
                    Clear communication from start to finish.
                  </h2>
                </div>
                <div className="grid gap-4">
                  {[
                    "A written scope and quote before work begins",
                    "Regular updates, so you’re never left guessing",
                    "Websites and apps that work properly on phones",
                    "Support after launch, when you need it",
                  ].map((line) => (
                    <p
                      key={line}
                      className="flex gap-3 text-sm leading-6 text-slate-600"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#244ec4]"
                      />
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-9 flex flex-col items-start gap-3 border-t border-tar-navy/10 pt-7 sm:flex-row sm:items-center">
                <HeartHandshake className="text-[#244ec4]" />
                <p className="text-sm font-semibold text-tar-navy">
                  Have a project in mind?
                </p>
                <Link
                  to="/contact"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-[#244ec4] sm:ml-auto"
                >
                  Get in touch 
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
