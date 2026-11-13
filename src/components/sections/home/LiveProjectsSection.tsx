import { useState } from "react";

import Reveal from "../../ui/Reveal";

/**
 * LIVE PROJECTS
 * To add or change a project, edit this list only.
 * `img` is a screenshot you put in the /public/projects/ folder (see steps).
 */
const liveProjects = [
  {
    name: "Holistic Clinic",
    kind: "Multi-speciality clinic website · ENT, Dental, Skin & Hair",
    location: "Lake Town, Kolkata",
    url: "https://clinicholistic.org/",
    img: "projects/clinicholistic.png",
  },
  {
    name: "Dr. Nitin Mittal",
    kind: "Doctor profile website · ENT & Head and Neck Surgeon",
    location: "Lake Town, Kolkata",
    url: "https://drnitinmittal.clinicholistic.org/",
    img: "projects/drnitinmittal.png",
  },
];

function Screenshot({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);

  // If the screenshot file is missing, show a clean placeholder instead of a broken image.
  if (failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-linear-to-br from-tar-navy to-[#244ec4] px-6 text-center">
        <span className="display-heading text-4xl text-white/90">{name}</span>
      </div>
    );
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}${src}`}
      alt={`${name} website screenshot`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
    />
  );
}

export default function LiveProjectsSection() {
  return (
    <section
      id="live-work"
      className="section-pad scroll-mt-24 bg-tar-paper text-tar-navy"
    >
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">Live projects</span>
          <h2 className="display-heading mt-5 text-[clamp(2.8rem,6vw,5.5rem)]">
            Real sites,{" "}
            <em className="text-tar-royal">live today.</em>
          </h2>
          <p className="mt-4 max-w-lg text-tar-navy/60">
            Websites we built and launched for real clients. Open them and have
            a look around.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {liveProjects.map((p, i) => (
            <Reveal
              key={p.url}
              delay={(i % 2) * 0.1}
              className={i % 2 ? "md:mt-24" : ""}
            >
              <a
                href={p.url}
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
                      {p.url.replace("https://", "").replace(/\/$/, "")}
                    </span>
                  </div>
                  <div className="aspect-4/3 overflow-hidden">
                    <Screenshot src={p.img} name={p.name} />
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="display-heading text-4xl sm:text-5xl">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm text-tar-navy/60">{p.kind}</p>
                    <p className="mt-1 text-sm text-tar-navy/45">
                      {p.location}
                    </p>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-tar-royal">
                    Live{" "}
                    
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
