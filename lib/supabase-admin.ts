import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

export function getSupabaseAdmin() {
	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error("Supabase env is missing");
	}

	return createClient(supabaseUrl, serviceRoleKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}
