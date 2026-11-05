import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Loader2, MessageSquarePlus, Quote, Star } from "lucide-react";
import Reveal from "../../ui/Reveal";
import SectionHeader from "../../ui/SectionHeader";
import { fetchReviews, submitReview, type Review } from "../../../lib/backend";
import { button } from "../../ui/button";
import { formControl, formLabel } from "../../ui/patterns";

const MIN_CARDS_PER_GROUP = 8;
const SECONDS_PER_CARD = 8;
const TWO_ROW_THRESHOLD = 6;

function Stars({ value }: { value: number }) {
  return (
    <div
      className="flex gap-1 text-[#b2a071]"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          fill={n <= value ? "currentColor" : "none"}
          strokeWidth={1.4}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex w-[min(82vw,21.5rem)] flex-none flex-col rounded-2xl border sm:w-96 border-tar-navy/8 bg-[#fbf8ee]/80 p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <Quote size={25} className="text-[#4264c4]" />
        <Stars value={review.rating} />
      </div>
      <p className="mt-6 line-clamp-8 flex-1 text-sm leading-6 text-slate-600">
        “{review.comment}”
      </p>
      <div className="mt-6 border-t border-tar-navy/10 pt-4">
        <p className="text-sm font-bold text-tar-navy">{review.name}</p>
      </div>
    </article>
  );
}

function ReviewMarqueeRow({
  items,
  reverse = false,
}: {
  items: Review[];
  reverse?: boolean;
}) {
  const repeats = Math.max(1, Math.ceil(MIN_CARDS_PER_GROUP / items.length));
  const cardsPerGroup = items.length * repeats;

  return (
    <div className="overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className={`flex w-max will-change-transform group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:animate-none ${reverse ? "animate-marquee-right" : "animate-marquee-left"}`}
        style={{ animationDuration: `${cardsPerGroup * SECONDS_PER_CARD}s` }}
      >
        {[0, 1].map((group) => (
          <div
            key={group}
            className="flex shrink-0 items-stretch gap-(--gap) pr-(--gap) motion-reduce:aria-hidden:hidden"
            aria-hidden={group === 1 ? true : undefined}
          >
            {Array.from({ length: repeats }, (_, copy) =>
              items.map((review, index) => (
                <div
                  key={`${group}-${copy}-${review.name}-${index}`}
                  className="flex"
                  aria-hidden={copy > 0 ? true : undefined}
                >
                  <ReviewCard review={review} />
                </div>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeedbackSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const load = useCallback(async (signal?: AbortSignal) => {
    const list = await fetchReviews(signal);
    if (signal?.aborted) return;
    setReviews([...list].reverse());
    setLoading(false);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    void load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await submitReview(form);
      setStatus({
        ok: true,
        text: "Thank you! Your review has been submitted.",
      });
      setForm({ name: "", rating: 5, comment: "" });
      window.setTimeout(() => void load(), 1500);
    } catch {
      setStatus({
        ok: false,
        text: "Failed to submit your review. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  const rows: Review[][] =
    reviews.length >= TWO_ROW_THRESHOLD
      ? [
          reviews.filter((_, i) => i % 2 === 0),
          reviews.filter((_, i) => i % 2 === 1),
        ]
      : [reviews];

  return (
    <section className="section-pad overflow-x-clip bg-[#f1eee5]">
      <div className="site-container">
        <Reveal>
          <SectionHeader
            eyebrow="Reviews"
            title="What clients say about working with us."
            description="Reviews from people we’ve worked with. If that includes you, we’d love to hear how it went."
            align="center"
          />
        </Reveal>

        <div className="mt-12">
          {loading ? (
            <p className="text-center text-sm text-slate-500">
              Loading reviews…
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-sm text-slate-500">
              No reviews yet. Be the first to leave one!
            </p>
          ) : (
            <Reveal>
              <div
                className="group/marquee ml-[calc(50%-50vw)] flex w-screen max-w-screen flex-col gap-(--gap) overflow-hidden py-2 [--gap:1rem] mask-[linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] sm:[--gap:1.25rem]"
                role="region"
                aria-label="Client reviews"
              >
                {rows.map((items, rowIndex) => (
                  <ReviewMarqueeRow
                    key={rowIndex}
                    items={items}
                    reverse={rowIndex % 2 === 1}
                  />
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <div className="mx-auto mt-14 max-w-xl">
          {!formOpen ? (
            <div className="text-center">
              <button
                type="button"
                className={button("primary", "lg")}
                onClick={() => setFormOpen(true)}
              >
                <MessageSquarePlus size={18} /> Leave a review
              </button>
            </div>
          ) : (
            <Reveal>
              <form
                onSubmit={onSubmit}
                className="grid gap-4 rounded-3xl border border-tar-navy/10 bg-[#fbf8ee] p-6 shadow-[0_20px_70px_rgba(7,22,63,.05)] sm:p-8"
              >
                <h3 className="font-display text-2xl font-bold tracking-[-.04em] text-tar-navy">
                  Leave a review
                </h3>
                <div>
                  <label className={formLabel} htmlFor="review-name">
                    Your name / company *
                  </label>
                  <input
                    id="review-name"
                    className={formControl}
                    required
                    maxLength={80}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Smith, Acme Co."
                  />
                </div>
                <div>
                  <label className={formLabel} htmlFor="review-rating">
                    Rating
                  </label>
                  <select
                    id="review-rating"
                    className={formControl}
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                    <option value={2}>★★☆☆☆ (2/5)</option>
                    <option value={1}>★☆☆☆☆ (1/5)</option>
                  </select>
                </div>
                <div>
                  <label className={formLabel} htmlFor="review-comment">
                    Your review *
                  </label>
                  <textarea
                    id="review-comment"
                    className={`${formControl} min-h-32 resize-y`}
                    required
                    maxLength={800}
                    value={form.comment}
                    onChange={(e) =>
                      setForm({ ...form, comment: e.target.value })
                    }
                    placeholder="Write your review here…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className={button("primary", "lg")}
                >
                  {sending ? (
                    <>
                      Submitting… <Loader2 size={17} className="animate-spin" />
                    </>
                  ) : (
                    "Submit review"
                  )}
                </button>
                {status && (
                  <p
                    role="status"
                    className={`rounded-xl px-4 py-3 text-sm ${status.ok ? "bg-[#eef3ff] text-[#244ec4]" : "bg-red-50 text-red-700"}`}
                  >
                    {status.text}
                  </p>
                )}
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
