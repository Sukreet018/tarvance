import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../../ui/Reveal";
import TeamGrid from "../../ui/TeamGrid";

type TeamSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  showLink?: boolean;
  className?: string;
};

export default function TeamSection({
  eyebrow = "Our team",
  title = "Meet the team.",
  description = "We’re a small team based in Kolkata. When you get in touch, you’ll be talking to the people who will actually build your project.",
  showLink = true,
  className = "bg-tar-cream",
}: TeamSectionProps) {
  return (
    <section className={`section-pad ${className}`}>
      <div className="site-container">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="eyebrow">{eyebrow}</span>
              <h2 className="display-heading mt-5 text-4xl text-tar-navy sm:text-5xl lg:text-6xl">
                {title}
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-base leading-7 text-slate-600">
                {description}
              </p>
              {showLink && (
                <Link
                  to="/about"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#244ec4]"
                >
                  More about us <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </Reveal>
        <div className="mt-12 pb-10 sm:mt-14">
          <TeamGrid />
        </div>
      </div>
    </section>
  );
}
