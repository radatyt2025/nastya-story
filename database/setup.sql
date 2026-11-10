-- Execute in Supabase SQL Editor. Do not expose service_role key to the browser.
create table if not exists public.meeting_rsvps (
 id bigint generated always as identity primary key,
 meeting_date date not null check (meeting_date = date '2026-11-11'),
 meeting_time text not null check (meeting_time in ('17:00','17:30','18:00','18:30','19:00','19:30','20:00')),
 created_at timestamptz not null default now()
);
alter table public.meeting_rsvps enable row level security;
-- No public policies: only the server-side service_role can read/write.
