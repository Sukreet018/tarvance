import { team } from "../../data/team";
import Reveal from "./Reveal";


export default function TeamGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
      {team.map((member, index) => {
        const label = member.name
          ? `${member.name}${member.role ? `, ${member.role}` : ""}`
          : "TarVance team member";
        return (
          <li key={member.photo} className="sm:even:mt-10">
            <Reveal delay={(index % 4) * 0.07} y={20}>
              <figure className="group relative overflow-hidden rounded-2xl bg-tar-navy shadow-[0_18px_45px_-22px_rgba(7,22,63,.45)]">
                <img
                  src={member.photo}
                  alt={label}
                  width={720}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="aspect-4/5 w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                />
                {member.name && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#030916]/90 via-[#030916]/50 to-transparent px-4 pb-4 pt-12 text-white">
                    <p className="text-sm font-bold">{member.name}</p>
                    {member.role && (
                      <p className="mt-0.5 text-xs text-white/70">
                        {member.role}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
