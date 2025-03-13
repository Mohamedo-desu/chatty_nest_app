import { client } from "@/supabase/config";

export const getUserData = async (userId: string, allFields = true) => {
  try {
    const { error, data } = await client
      .from("users")
      .select(allFields ? "*" : "user_id,display_name,user_name,photo_url")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    if (data) return data;
  } catch (error) {
    console.log(error);
  }
};
