import { Compass, Gauge, HeartHandshake } from "lucide-react";
import Reveal from "../../ui/Reveal";
import SectionHeader from "../../ui/SectionHeader";
import { cardLift } from "../../ui/patterns";

const beliefs = [
  {
    icon: Compass,
    number: "01",
    title: "We listen first",
    text: "Before we suggest anything, we want to understand your business and what's not working. The right solution usually becomes obvious after that.",
  },
  {
    icon: Gauge,
    number: "02",
    title: "We keep it clear",
    text: "No jargon, and no surprises. We agree what's included before we start, and tell you early if anything changes.",
  },
  {
    icon: HeartHandshake,
    number: "03",
    title: "We stay after launch",
    text: "Websites and software need looking after. Once you're live, we're still here for fixes, updates and changes.",
  },
];

export default function BeliefSection() {
  return (
    <section className="section-pad bg-tar-paper">
      <div className="site-container grid gap-14 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
        <Reveal>
          <SectionHeader
            eyebrow="How we work"
            title="Plain talk, clear scope, software that keeps working."
            description="Most of our clients aren’t technical, and they shouldn’t need to be. We explain things simply, agree the details up front, and keep you updated as the project comes together."
          />
          <a
            href="#expertise"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#214bc1] hover:text-tar-navy"
          >
            See what we build 
          </a>
        </Reveal>
        <div className="grid gap-4">
          {beliefs.map((belief, i) => {
            const Icon = belief.icon;
            return (
              <Reveal key={belief.number} delay={i * 0.08}>
                <article
                  className={`${cardLift} grid gap-5 rounded-2xl border border-tar-navy/7.5 bg-[#fbf8ee]/70 p-6 sm:grid-cols-[54px_1fr] sm:p-7`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf0ff] text-[#244ec4]">
                    <Icon size={22} strokeWidth={1.7} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[.68rem] font-extrabold tracking-[.14em] text-[#4770cf]">
                        {belief.number}
                      </span>
                      <h3 className="font-display text-xl font-bold tracking-[-.035em] text-tar-navy">
                        {belief.title}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                      {belief.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
