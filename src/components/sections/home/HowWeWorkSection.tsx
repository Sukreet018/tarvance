import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  Lightbulb,
  MessagesSquare,
  Rocket,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "../../ui/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "A first conversation",
    short: "We listen first.",
    description:
      "Tell us about your business, what isn’t working and what you’d like to change. We ask questions and take notes. There’s no sales pitch.",
    outcome: "A shared understanding of the problem",
    icon: MessagesSquare,
    tone: "bg-[#fdfbf5]",
  },
  {
    number: "02",
    title: "Plan and quote",
    short: "Agree what we’re building.",
    description:
      "We turn that conversation into a written list of what’s included, a timeline and a price, so everyone knows what to expect before work starts.",
    outcome: "A written scope and quote",
    icon: Compass,
    tone: "bg-[#f2f5ff]",
  },
  {
    number: "03",
    title: "Design",
    short: "See it before it’s built.",
    description:
      "You’ll see the layout and main screens before we write the code. Changes are quick and cheap at this stage, so this is the time to say what you’d change.",
    outcome: "Designs you’ve signed off",
    icon: Lightbulb,
    tone: "bg-[#eaf0ff]",
  },
  {
    number: "04",
    title: "Build and test",
    short: "Regular updates, working software.",
    description:
      "We build in stages and show you progress along the way. Everything is tested on real phones and browsers before it goes live.",
    outcome: "A tested, working product",
    icon: Workflow,
    tone: "bg-[#e2ebff]",
  },
  {
    number: "05",
    title: "Launch and support",
    short: "We’re still here after go-live.",
    description:
      "We put it live, show you how to run it, and stay available for fixes, updates and changes once real customers start using it.",
    outcome: "A live product, with support",
    icon: Rocket,
    tone: "bg-[#173d9d]",
  },
];

export default function HowWeWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(
      (card): card is HTMLElement => card !== null,
    );

    if (!section || cards.length === 0) return;

    // Smooth scrolling is initialized once in SiteLayout. This section only
    // owns its card stack, active-step tracking, and progress indicator.
    // `scrub: true` (not a number): Lenis already eases the scroll, and a second GSAP smoothing
    // layer made the sticky cards lag and shimmer against the page.
    const context = gsap.context(() => {
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
      }

      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 42%",
          end: "bottom 42%",
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });

      cards.forEach((card, index) => {
        const depth = cards.length - 1 - index;
        const face = card.querySelector<HTMLElement>("[data-card-face]");

        if (depth === 0) return;

        const tweenOptions = {
          trigger: card,
          start: () => `top ${window.innerWidth < 768 ? 92 : 116}px`,
          endTrigger: cards[cards.length - 1],
          end: () => `top ${window.innerWidth < 768 ? 92 : 116}px`,
          scrub: true,
          invalidateOnRefresh: true,
        };

        gsap.to(card, {
          scale: 1 - depth * 0.045,
          y: -depth * 13,
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: tweenOptions,
        });

        if (face) {
          gsap.to(face, {
            opacity:
              index === cards.length - 1 ? 1 : Math.max(0.68, 1 - depth * 0.07),
            ease: "none",
            scrollTrigger: tweenOptions,
          });
        }
      });
    }, section);

    // Refresh after card dimensions and pinned positions are registered.
    ScrollTrigger.refresh();

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip bg-[#f1eee5] py-20 text-tar-ink sm:py-28 lg:py-32"
      aria-labelledby="how-we-work-title"
    >
      <div className="site-container">
        <div className="grid items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              eyebrow="How we work"
              title="From first call to launch, and after."
              description="Every project follows the same five steps. Scroll down to see what happens at each one."
            />

            <div className="mt-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5974b4] lg:flex">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#244ec4]/20 bg-white/70">
                <ArrowDownRight size={17} />
              </span>
              Five steps, start to finish
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-tar-navy/10 bg-white/60 p-4 lg:mt-10">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e4ebff] text-[#244ec4]">
                <ShieldCheck size={21} />
              </div>
              <p className="text-sm leading-6 text-slate-600">
                <span className="font-bold text-tar-navy">No surprises.</span>{" "}
                You’ll always know where your project stands and what happens
                next.
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-24 left-0 top-17 hidden w-px bg-[#244ec4]/15 sm:block"
            >
              <div
                ref={progressRef}
                className="absolute inset-x-0 top-0 h-full origin-top bg-[#315bd0] shadow-[0_0_10px_rgba(49,91,208,.35)]"
              />
            </div>
            <div className="mb-5 flex items-center justify-between border-b border-tar-navy/10 pb-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5974b4]">
                Our process
              </span>
              <span className="inline-flex items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="font-mono text-[#244ec4]">
                  {String(activeStep + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-8 bg-[#244ec4]/25" />
                <span>5 steps</span>
              </span>
            </div>

            <div className="relative space-y-7 pb-16 pl-6 sm:pl-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;

                return (
                  <article
                    key={step.number}
                    ref={(node) => {
                      cardsRef.current[index] = node;
                    }}
                    className={`sticky top-26 flex min-h-97.5 flex-col justify-between overflow-hidden rounded-[1.75rem] border border-tar-navy/10 p-7 shadow-[0_22px_70px_rgba(7,22,63,0.12)] will-change-transform sm:min-h-107.5 sm:p-9 lg:top-31 lg:min-h-112.5 ${
                      isLast
                        ? "border-[#244ec4]/40 bg-[#173d9d] text-white"
                        : `${step.tone} text-tar-ink`
                    } ${activeStep === index ? "ring-1 ring-[#315bd0]/35" : ""}`}
                    style={{ zIndex: index + 1 }}
                  >
                    <div
                      data-card-face
                      className="flex h-full flex-1 flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-2xl ${
                            isLast
                              ? "bg-white/10 text-[#c7d9ff]"
                              : "bg-[#244ec4]/9 text-[#244ec4]"
                          }`}
                        >
                          <Icon size={23} strokeWidth={1.65} />
                        </div>
                        <span
                          className={`font-mono text-sm font-semibold tracking-[0.16em] ${
                            isLast ? "text-white/55" : "text-[#5974b4]"
                          }`}
                        >
                          STEP {step.number}
                        </span>
                      </div>

                      <div className="mt-9">
                        <p
                          className={`text-xs font-bold uppercase tracking-[0.14em] ${
                            isLast ? "text-[#b9ceff]" : "text-[#4264b9]"
                          }`}
                        >
                          {step.short}
                        </p>
                        <h3 className="mt-3 max-w-lg font-display text-3xl font-bold leading-tight tracking-[-0.045em] sm:text-4xl">
                          {step.title}
                        </h3>
                        <p
                          className={`mt-4 max-w-xl text-sm leading-7 sm:text-base ${
                            isLast ? "text-white/70" : "text-slate-600"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>

                      <div
                        className={`mt-8 flex items-center justify-between gap-4 border-t pt-5 ${
                          isLast ? "border-white/15" : "border-tar-navy/10"
                        }`}
                      >
                        <p
                          className={`text-xs font-semibold sm:text-sm ${
                            isLast ? "text-white/80" : "text-[#24375e]"
                          }`}
                        >
                          <span className="mr-2 text-[#7197ef]">→</span>
                          {step.outcome}
                        </p>
                        {isLast ? (
                          <ArrowUpRight
                            size={20}
                            className="shrink-0 text-[#c7d9ff]"
                          />
                        ) : (
                          <span className="shrink-0 font-mono text-xs text-[#5974b4]">
                            {step.number} / 05
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="flex items-center gap-2 text-xs leading-5 text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-[#315bd0]" />
              Every project is a little different, so we adjust the steps to
              fit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
