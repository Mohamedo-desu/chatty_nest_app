drop table if exists users;

drop table if exists user_count;

drop function IF exists requesting_user_id () CASCADE;

create
or replace function requesting_user_id () RETURNS text as $$
    SELECT NULLIF(
        current_setting('request.jwt.claims', true)::json->>'sub',
        ''
    )::text;
$$ LANGUAGE sql;

create table
  users (
    user_id text primary key default requesting_user_id (),
    created_at timestamptz not null default now(),
    email_address text not null unique,
    display_name text not null,
    photo_url text null,
    cover_url text null,
    user_bio text null,
    user_followers uuid[] null,
    user_followings uuid[] null,
    birth_date date null,
    user_name text not null unique
  );

create table
  user_count (
    id serial primary key,
    user_count integer not null default 0
  );

INSERT INTO
  user_count (id, user_count)
VALUES
  (1, 0) ON CONFLICT (id)
DO NOTHING;