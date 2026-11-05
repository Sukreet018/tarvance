import { team } from "../../data/team";
import Reveal from "./Reveal";

export default function TeamGrid() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {team.map((member, index) => {
        const label = member.name
          ? `${member.name}${member.role ? `, ${member.role}` : ""}`
          : "TarVance team member";
        return (
          <li key={member.photo}>
            <Reveal delay={(index % 4) * 0.07} y={20}>
              <article className="group h-full overflow-hidden rounded-2xl border border-tar-navy/10 bg-[#fbf8ee] p-2.5 shadow-[0_18px_45px_-26px_rgba(7,22,63,.35)] transition duration-350 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-20px_rgba(7,22,63,.28)] sm:p-3">
                <div className="overflow-hidden rounded-xl bg-tar-navy">
                  <img
                    src={member.photo}
                    alt={label}
                    width={720}
                    height={960}
                    loading="lazy"
                    decoding="async"
                    className="aspect-4/5 w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="px-1.5 pb-1.5 pt-3.5 text-center sm:pt-4">
                  <p className="font-display text-xl leading-tight text-tar-navy sm:text-2xl">
                    {member.name || "TarVance"}
                  </p>
                  <p className="mt-1 font-mono text-[.62rem] uppercase tracking-[.16em] text-[#3558a8] sm:text-[.68rem]">
                    {member.role || "Team member"}
                  </p>
                </div>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}