import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type Params = {
  params: {
    slug: string;
  };
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const slug = params.slug;
    const supabase = getSupabaseAdmin();
    const existingVisitorId = request.cookies.get("visitor_id")?.value;

    const visitorId = existingVisitorId || randomUUID();

    const { data: existingLike, error: selectError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_slug", slug)
      .eq("visitor_id", visitorId)
      .maybeSingle();

    if (selectError) {
      return NextResponse.json({ message: "like failed" }, { status: 500 });
    }

    let liked = false;
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_slug", slug)
        .eq("visitor_id", visitorId);

      if (deleteError) {
        return NextResponse.json({ message: "like failed" }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase.from("post_likes").insert({
        post_slug: slug,
        visitor_id: visitorId
      });

      if (insertError) {
        return NextResponse.json({ message: "like failed" }, { status: 500 });
      }

      liked = true;
    }

    const { count } = await supabase
      .from("post_likes")
      .select("id", { count: "exact", head: true })
      .eq("post_slug", slug);

    const response = NextResponse.json({
      likesCount: count || 0,
      liked
    });

    if (!existingVisitorId) {
      response.cookies.set({
        name: "visitor_id",
        value: visitorId,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/"
      });
    }

    return response;
  } catch {
    return NextResponse.json({ message: "like failed" }, { status: 500 });
  }
}
