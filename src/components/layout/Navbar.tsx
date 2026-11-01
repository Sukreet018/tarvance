import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-[11px] font-semibold uppercase tracking-[.2em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-[#8bb6ff] after:transition-transform after:duration-200 hover:after:scale-x-100 ${
      isActive
        ? "text-white after:scale-x-100"
        : "text-white/65 after:scale-x-0 hover:text-white"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#030916]/70 text-white shadow-[0_8px_32px_rgba(0,0,0,.08)] backdrop-blur-md">
      {/* Full-bleed bar: brand pinned to the far left, CTA pinned to the far right, links centred between them. */}
      <div className="flex h-19 w-full items-center gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8 xl:px-10">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 lg:justify-self-start"
          aria-label="TarVance home"
          onClick={() => setOpen(false)}
        >
          <img
            src={`${import.meta.env.BASE_URL}tarvance-logo.jpeg`}
            alt="TarVance logo"
            className="h-10 w-10 rounded-full border border-white/15 object-cover transition-colors group-hover:border-[#8bb6ff]/70 sm:h-11 sm:w-11"
          />
          <span className="font-display text-[1.35rem] font-bold tracking-[-.065em] text-white sm:text-[1.45rem]">
            TarVance
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex xl:gap-9"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          className="ml-auto hidden items-center gap-2 rounded-full border border-white/20 bg-white/[.07] px-4 py-3 text-[11px] font-semibold uppercase tracking-[.12em] text-white transition hover:border-[#8bb6ff]/70 hover:bg-white/12 sm:inline-flex lg:ml-0 lg:justify-self-end"
        >
          Start a project <ArrowUpRight size={15} />
        </Link>

        <button
          className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#8bb6ff]/60 hover:bg-white/10 sm:ml-0 lg:hidden"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          className="border-t border-white/10 bg-[#030916]/95 px-5 py-6 shadow-[0_18px_35px_rgba(0,0,0,.24)] lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-xl flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-12 items-center border-b border-white/8 text-xs font-semibold uppercase tracking-[.2em] transition-colors ${isActive ? "text-white before:mr-3 before:size-1.25 before:rounded-full before:bg-[#8bb6ff]" : "text-white/65 hover:text-white"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#8bb6ff]/50 bg-[#8bb6ff]/10 px-5 text-xs font-semibold uppercase tracking-[.12em] text-white transition hover:bg-[#8bb6ff]/20"
            >
              Start a project <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
