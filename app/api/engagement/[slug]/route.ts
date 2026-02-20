import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type Params = {
  params: {
    slug: string;
  };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const slug = params.slug;
    const supabase = getSupabaseAdmin();
    const visitorId = request.cookies.get("visitor_id")?.value;

    const { count: likesCount, error: likesError } = await supabase
      .from("post_likes")
      .select("id", { count: "exact", head: true })
      .eq("post_slug", slug);

    if (likesError) {
      return NextResponse.json({ message: "engagement fetch failed" }, { status: 500 });
    }

    let liked = false;
    if (visitorId) {
      const { data: likedRow } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_slug", slug)
        .eq("visitor_id", visitorId)
        .maybeSingle();

      liked = Boolean(likedRow);
    }

    return NextResponse.json({
      likesCount: likesCount || 0,
      liked
    });
  } catch {
    return NextResponse.json({ message: "engagement fetch failed" }, { status: 500 });
  }
}
