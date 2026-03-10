-- =============================================================
-- MyOutfit — Script de configuration Supabase
-- À exécuter dans l'éditeur SQL de ton projet Supabase
-- =============================================================

-- ---------------------------------------------------------------
-- 1. TABLE clothes
-- ---------------------------------------------------------------
create table if not exists clothes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  category    text not null,
  color       text,
  style       text,
  season      text,
  formality   text,
  image_url   text,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- RLS : chaque utilisateur ne voit que ses vêtements
alter table clothes enable row level security;

create policy "clothes_select" on clothes
  for select using (auth.uid() = user_id);

create policy "clothes_insert" on clothes
  for insert with check (auth.uid() = user_id);

create policy "clothes_update" on clothes
  for update using (auth.uid() = user_id);

create policy "clothes_delete" on clothes
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- 2. TABLE outfits
-- ---------------------------------------------------------------
create table if not exists outfits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  style       text,
  season      text,
  created_at  timestamptz default now()
);

alter table outfits enable row level security;

create policy "outfits_select" on outfits
  for select using (auth.uid() = user_id);

create policy "outfits_insert" on outfits
  for insert with check (auth.uid() = user_id);

create policy "outfits_delete" on outfits
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- 3. TABLE outfit_items
-- ---------------------------------------------------------------
create table if not exists outfit_items (
  id          uuid primary key default gen_random_uuid(),
  outfit_id   uuid references outfits(id) on delete cascade not null,
  clothing_id uuid references clothes(id) on delete cascade not null,
  role        text -- top | bottom | shoes | layer | accessory
);

alter table outfit_items enable row level security;

create policy "outfit_items_select" on outfit_items
  for select using (
    exists (
      select 1 from outfits
      where outfits.id = outfit_items.outfit_id
        and outfits.user_id = auth.uid()
    )
  );

create policy "outfit_items_insert" on outfit_items
  for insert with check (
    exists (
      select 1 from outfits
      where outfits.id = outfit_items.outfit_id
        and outfits.user_id = auth.uid()
    )
  );

create policy "outfit_items_delete" on outfit_items
  for delete using (
    exists (
      select 1 from outfits
      where outfits.id = outfit_items.outfit_id
        and outfits.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------
-- 4. STORAGE bucket "clothes" (photos)
-- ---------------------------------------------------------------
-- À faire dans le Dashboard Supabase > Storage :
-- 1. Créer un bucket nommé "clothes"
-- 2. Le mettre en "Public"
-- Ou via SQL :

insert into storage.buckets (id, name, public)
values ('clothes', 'clothes', true)
on conflict do nothing;

create policy "clothes_upload" on storage.objects
  for insert with check (bucket_id = 'clothes' and auth.role() = 'authenticated');

create policy "clothes_public_read" on storage.objects
  for select using (bucket_id = 'clothes');

create policy "clothes_delete_own" on storage.objects
  for delete using (bucket_id = 'clothes' and auth.uid()::text = (storage.foldername(name))[1]);
