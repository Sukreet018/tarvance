import { Link } from "react-router-dom";
import Reveal from "../../ui/Reveal";
import SectionHeader from "../../ui/SectionHeader";
import FaqList from "../../seo/FaqList";
import { globalFaqs } from "../../../seo/types";

export default function FaqSection() {
  return (
    <section className="section-pad bg-[#f1eee5]">
      <div className="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <SectionHeader
            eyebrow="Questions"
            title="Common questions."
            description="Straight answers about working with a software company in Kolkata."
          />
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Looking for something local?{" "}
            <Link className="font-semibold text-[#244ec4]" to="/software-company-kolkata">
              Software company in Kolkata
            </Link>
            {" · "}
            <Link
              className="font-semibold text-[#244ec4]"
              to="/website-development-maharashtra"
            >
              Website development in Maharashtra
            </Link>
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <FaqList items={globalFaqs} />
        </Reveal>
      </div>
    </section>
  );
}
