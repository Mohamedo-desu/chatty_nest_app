export interface USER_PROPS {
  banned: boolean;
  birth_date: string | null;
  cover_url: string | null;
  created_at: string;
  display_name: string;
  email_address: string;
  photo_url: string | null;
  user_bio: string | null;
  user_followers: string[];
  user_followings: string[];
  user_id: string;
  user_name: string;
}
