import { ENDPOINTS } from "../config/site";

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;

  service: string;
  message: string;
};

export type Review = { name: string; rating: number; comment: string };

export async function sendContact(data: ContactPayload): Promise<void> {
  await fetch(ENDPOINTS.contact, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company: "", ...data }),
  });
}

export async function fetchReviews(signal?: AbortSignal): Promise<Review[]> {
  try {
    const res = await fetch(ENDPOINTS.reviews, { signal });
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .map((r) => ({
        name: String((r as Review).name ?? "").trim(),
        rating: Math.min(5, Math.max(1, Number((r as Review).rating) || 5)),
        comment: String((r as Review).comment ?? "").trim(),
      }))
      .filter((r) => r.name && r.comment);
  } catch {
    return [];
  }
}

export async function submitReview(review: {
  name: string;
  rating: number;
  comment: string;
}): Promise<void> {
  await fetch(ENDPOINTS.reviews, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...review, rating: String(review.rating) }),
  });
}
