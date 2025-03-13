import { client } from "@/supabase/config";

export const fetchPosts = async (limit = 10) => {
  const { data, error } = await client
    .from("posts")
    .select(
      `*,
        user:users (user_id,display_name,user_name,photo_url)`
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }
  if (data) {
    return data;
  }
};
