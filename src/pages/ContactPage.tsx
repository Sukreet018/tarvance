import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SITE } from "../config/site";
import { sendContact } from "../lib/backend";
import ZoomHero from "../components/visuals/ZoomHero";
import Reveal from "../components/ui/Reveal";
import SectionHeader from "../components/ui/SectionHeader";
import { button } from "../components/ui/button";
import { formControl, formLabel } from "../components/ui/patterns";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "New project",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      await sendContact({
        name: form.name,
        email: form.email,
        company: form.company,
        service: form.subject,
        message: form.message,
      });
      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong. Please try again, or message us on WhatsApp.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <ZoomHero
        label="Contact us"
        text="Tell us what you’re thinking."
        caption="Every good project starts with a conversation."
      />
      <section className="bg-[#030916] pb-24 pt-8 text-tar-cream">
        <div className="site-container max-w-3xl">
          <Reveal>
            <span className="eyebrow text-[#8bb6ff]">Contact</span>
            <h2 className="display-heading mt-5 text-4xl sm:text-5xl">
              Tell us what you need.
            </h2>
            <p className="mt-5 text-lg leading-8 text-tar-cream/65">
              Call us, message us on WhatsApp, or use the form below. A rough
              idea is enough to get started, and you don’t need to know the
              technical details.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section-pad bg-tar-paper">
        <div className="site-container grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <Reveal>
            <div>
              <SectionHeader
                eyebrow="Contact details"
                title="Prefer to talk it through?"
                description="Call or message us, or send an email. We’ll get back to you as soon as we can."
              />
              <div className="mt-9 grid gap-4">
                <div className="flex gap-4 rounded-2xl border border-tar-navy/10 bg-white p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#244ec4]">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-tar-navy">Email</h3>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="mt-1 block wrap-break-word text-sm text-slate-600 transition hover:text-[#244ec4]"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-tar-navy/10 bg-white p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#244ec4]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-tar-navy">Phone</h3>
                    <a
                      href={SITE.phoneHref}
                      className="mt-1 block text-sm text-slate-600 transition hover:text-[#244ec4]"
                    >
                      {SITE.phoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-tar-navy/10 bg-white p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#244ec4]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-tar-navy">Office</h3>
                    <address className="mt-1 text-sm not-italic leading-6 text-slate-600">
                      {SITE.address.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className={button("quiet", "md")}
                  >
                    <FaWhatsapp size={17} /> WhatsApp us
                  </a>
                  <a
                    href={SITE.calendly}
                    target="_blank"
                    rel="noreferrer"
                    className={button("quiet", "md")}
                  >
                    <CalendarCheck size={17} /> Book a call
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-tar-navy/10 bg-white p-6 shadow-[0_20px_70px_rgba(7,22,63,.05)] sm:p-9">
              <div className="mb-7">
                <h2 className="font-display text-2xl font-bold tracking-[-.04em] text-tar-navy">
                  Send a message
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Fields marked with * are required.
                </p>
              </div>
              {submitted ? (
                <div className="rounded-2xl border border-[#244ec4]/20 bg-[#eef3ff] p-6">
                  <ShieldCheck size={28} className="text-[#244ec4]" />
                  <h3 className="mt-4 font-display text-xl font-bold text-tar-navy">
                    Thanks, {form.name || "there"}.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your message has been sent. We’ll get back to you as soon as
                    possible.
                  </p>
                  <button
                    type="button"
                    className={button("quiet", "md", "mt-5")}
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        company: "",
                        subject: "New project",
                        message: "",
                      });
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <div>
                    <label className={formLabel} htmlFor="contact-name">
                      Your name *
                    </label>
                    <input
                      id="contact-name"
                      className={formControl}
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className={formLabel} htmlFor="contact-email">
                      Email address *
                    </label>
                    <input
                      id="contact-email"
                      className={formControl}
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={formLabel} htmlFor="contact-company">
                      Company / brand
                    </label>
                    <input
                      id="contact-company"
                      className={formControl}
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      placeholder="Your company"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={formLabel} htmlFor="contact-subject">
                      What do you need help with?
                    </label>
                    <select
                      id="contact-subject"
                      className={formControl}
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                    >
                      <option>New project</option>
                      <option>Custom software or web app</option>
                      <option>New website</option>
                      <option>Google Business Profile or SEO</option>
                      <option>Maintenance for an existing site</option>
                      <option>Content or video</option>
                      <option>Something else</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={formLabel} htmlFor="contact-message">
                      Your message *
                    </label>
                    <textarea
                      id="contact-message"
                      className={`${formControl} min-h-36 resize-y`}
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Tell us a bit about your business and what you’re looking for."
                    />
                  </div>
                  <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-xs leading-5 text-slate-500">
                      <ShieldCheck size={15} /> We only use your details to
                      reply to you.
                    </p>
                    <button
                      type="submit"
                      disabled={sending}
                      className={button("primary", "lg")}
                    >
                      {sending ? (
                        <>
                          Sending…{" "}
                          <Loader2 size={17} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          Send your message <ArrowUpRight size={17} />
                        </>
                      )}
                    </button>
                  </div>
                  {error && (
                    <p
                      role="alert"
                      className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
