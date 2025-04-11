-- Drop dependent objects first
drop table if exists post_comments CASCADE;

drop table if exists post_likes CASCADE;

drop table if exists posts CASCADE;

drop table if exists notification_settings CASCADE;

drop table if exists privacy_settings CASCADE;

drop table if exists message_filtering CASCADE;

drop table if exists user_count CASCADE;

drop table if exists messages CASCADE;

drop table if exists conversations CASCADE;

drop table if exists follows CASCADE;

drop table if exists users CASCADE;

DROP VIEW IF EXISTS public.randomized_posts;

-- Drop the function
drop function IF exists requesting_user_id () CASCADE;

-------------------------------------------------
-- Re-create objects with cascade integrity and indexes
-------------------------------------------------
-- Table: user_count
create table
  user_count (
    id serial primary key,
    user_count integer not null default 0
  );

-- Function: requesting_user_id
create
or replace function requesting_user_id () RETURNS text as $$
  SELECT NULLIF(
      current_setting('request.jwt.claims', true)::json->>'sub',
      ''
  )::text;
$$ LANGUAGE sql;

-- Table: users
create table
  users (
    user_id text primary key default requesting_user_id (),
    created_at timestamptz not null default now(),
    email_address text not null unique,
    display_name text not null,
    photo_url text null,
    cover_url text null,
    user_bio text null,
    push_tokens text[],
    birth_date date null,
    user_name text null unique,
    banned boolean not null default false
  );

-- Create index on users for display_name searches
create index idx_users_display_name on users (display_name);

-- Initialize user_count
insert into
  user_count (id, user_count)
values
  (1, 0) on conflict (id)
do nothing;

-- Table: notification_settings
create table
  notification_settings (
    id uuid primary key default gen_random_uuid (),
    user_id text not null unique references users (user_id) on delete CASCADE,
    push_notifications boolean not null default true,
    email_notifications boolean not null default false,
    sms_notifications boolean not null default false,
    likes_notifications boolean not null default true,
    comments_notifications boolean not null default true,
    mentions_notifications boolean not null default true,
    friend_requests_notifications boolean not null default true,
    direct_messages_notifications boolean not null default true,
    group_notifications boolean not null default true,
    notification_sound boolean not null default true,
    vibrate_on_notification boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

-- Table: privacy_settings
create table
  privacy_settings (
    id uuid primary key default gen_random_uuid (),
    user_id text not null unique references users (user_id) on delete CASCADE,
    private_account boolean not null default false,
    activity_status boolean not null default true,
    read_receipts boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

-- Table: message_filtering
create table
  message_filtering (
    id uuid primary key default gen_random_uuid (),
    user_id text not null unique references users (user_id) on delete CASCADE,
    filter_unknown boolean not null default false,
    filter_explicit boolean not null default false,
    blocked_keywords text[] not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

-- Table: posts
create table
  posts (
    id uuid primary key default gen_random_uuid (),
    user_id text not null references users (user_id) on delete CASCADE,
    type text not null check (
      type in ('private', 'public')
    ),
    file text null,
    body text,
    created_at timestamptz not null default now()
  );

-- Index for posts by user_id for faster retrieval of a user's posts
create index idx_posts_user_id on posts (user_id);

-- Table: post_likes
create table
  post_likes (
    id uuid primary key default gen_random_uuid (),
    post_id uuid not null references posts (id) on delete CASCADE,
    user_id text not null references users (user_id) on delete CASCADE,
    created_at timestamptz not null default now()
  );

-- Indexes for post_likes to speed up lookups by post and by user
create index idx_post_likes_post_id on post_likes (post_id);

create index idx_post_likes_user_id on post_likes (user_id);

-- Table: post_comments
create table
  post_comments (
    id uuid primary key default gen_random_uuid (),
    post_id uuid not null references posts (id) on delete CASCADE,
    user_id text not null references users (user_id) on delete CASCADE,
    text text not null,
    created_at timestamptz not null default now()
  );

-- Indexes for post_comments for faster filtering
create index idx_post_comments_post_id on post_comments (post_id);

create index idx_post_comments_user_id on post_comments (user_id);

-- Table: conversations
create table
  conversations (
    conversation_id uuid primary key default gen_random_uuid (),
    chat_type text not null check (chat_type in ('one_to_one', 'group')),
    conversation_name text, -- Optional, mainly for group chats
    participants text[] not null, -- Array of user IDs
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint chk_participants_count check (
      (
        chat_type='one_to_one'
        and array_length(participants, 1)=2
      )
      or (
        chat_type='group'
        and array_length(participants, 1)>=2
      )
    )
  );

-- If you plan to search for conversations by a participant, consider creating a GIN index:
create index idx_conversations_participants on conversations using gin (participants);

-- Table: messages
create table
  messages (
    message_id uuid primary key default gen_random_uuid (),
    conversation_id uuid not null references conversations (conversation_id) on delete CASCADE,
    sender_id text not null references users (user_id) on delete CASCADE,
    content text not null,
    seen_by text[], -- Array of user IDs who have seen the message
    received boolean default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz,
    is_edited boolean not null default false
  );

-- Indexes for messages to help with common queries
create index idx_messages_conversation_id on messages (conversation_id);

create index idx_messages_sender_id on messages (sender_id);

-- Table: follows
create table
  follows (
    follower_id text references users (user_id) on delete CASCADE,
    followee_id text references users (user_id) on delete CASCADE,
    created_at timestamptz not null default now(),
    primary key (follower_id, followee_id)
  );

create view
  public.randomized_posts as
select
  posts.id,
  posts.created_at,
  posts.body,
  posts.user_id,
  posts.type,
  posts.file
from
  posts
where
  posts.type='public'
order by
  random();