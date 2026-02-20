"use client";

import { useEffect, useState } from "react";

type PostEngagementProps = {
  slug: string;
};

type EngagementResponse = {
  likesCount: number;
  liked: boolean;
};

export default function PostEngagement({ slug }: PostEngagementProps) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await fetch(`/api/engagement/${slug}`, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("load failed");
        }

        const data = (await response.json()) as EngagementResponse;

        if (cancelled) {
          return;
        }

        setLikes(data.likesCount || 0);
        setLiked(Boolean(data.liked));
      } catch {
        if (!cancelled) {
          setErrorMessage("좋아요를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleLike() {
    if (loading || submitting) {
      return;
    }

    const prevLiked = liked;
    const prevLikes = likes;
    const optimisticLiked = !prevLiked;
    const optimisticLikes = optimisticLiked ? prevLikes + 1 : Math.max(0, prevLikes - 1);

    try {
      setSubmitting(true);
      setLiked(optimisticLiked);
      setLikes(optimisticLikes);
      const response = await fetch(`/api/engagement/${slug}/like`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("like failed");
      }

      const data = (await response.json()) as { likesCount: number; liked: boolean };
      setLikes(data.likesCount || 0);
      setLiked(Boolean(data.liked));
    } catch {
      // Silent rollback when API fails.
      setLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="soft-card mt-6 p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-800">공감하기</h2>
        <button
          type="button"
          onClick={handleLike}
          disabled={loading || submitting}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            liked
              ? "border-rose-300 bg-rose-100 text-rose-600"
              : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5"
          }`}
        >
          좋아요 ({likes})
        </button>
      </div>

      {errorMessage ? <p className="mt-3 text-sm text-rose-500">{errorMessage}</p> : null}
    </section>
  );
}
