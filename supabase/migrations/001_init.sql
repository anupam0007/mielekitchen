-- ════════════════════════════════════════════════════════════════
-- Miele Kitchen — initial schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════

-- ── Tables ───────────────────────────────────────────────────────

-- Every editable text block on the public site
CREATE TABLE IF NOT EXISTS site_content (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Menu dishes
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  featured    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- One or many photos per dish (first by sort_order with is_cover = true is the thumbnail)
CREATE TABLE IF NOT EXISTS product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_cover    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Each design slot in the Customizable Cakes galleries
CREATE TABLE IF NOT EXISTS customizable_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery     TEXT NOT NULL CHECK (gallery IN ('cakes', 'bento')),
  code        TEXT NOT NULL,          -- C1, C2 … B1, B2 …
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- One or many photos per design
CREATE TABLE IF NOT EXISTS customizable_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id     UUID NOT NULL REFERENCES customizable_items(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row-Level Security ────────────────────────────────────────────

ALTER TABLE site_content        ENABLE ROW LEVEL SECURITY;
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images      ENABLE ROW LEVEL SECURITY;
ALTER TABLE customizable_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE customizable_images ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY "public_read_site_content"        ON site_content        FOR SELECT USING (true);
CREATE POLICY "public_read_products"            ON products            FOR SELECT USING (true);
CREATE POLICY "public_read_product_images"      ON product_images      FOR SELECT USING (true);
CREATE POLICY "public_read_customizable_items"  ON customizable_items  FOR SELECT USING (true);
CREATE POLICY "public_read_customizable_images" ON customizable_images FOR SELECT USING (true);

-- Authenticated admin can do everything
CREATE POLICY "admin_all_site_content"        ON site_content        FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_all_products"            ON products            FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_all_product_images"      ON product_images      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_all_customizable_items"  ON customizable_items  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_all_customizable_images" ON customizable_images FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ── Storage policies (bucket: "media", set to Public in dashboard) ─

-- Authenticated admin can upload, update, delete
CREATE POLICY "media_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "media_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "media_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- ── Seed: site_content keys ───────────────────────────────────────

INSERT INTO site_content (key, value) VALUES
  ('hero_eyebrow',        'Bengaluru · Freshly-made to order'),
  ('hero_title',          'Miele'),
  ('hero_tagline',        'Where Whisk Whips Wonders'),
  ('hero_description',    'Miele is a cloud kitchen in Vasanthnagar, Bengaluru, run by chef Anjali V Prasad, where we make cakes fresh to order — every cake, tart and bake is whisked up and finished by hand, the way good honey is made: slowly, and with care.'),
  ('stat_bakes_count',    '20+'),
  ('stat_bakes_label',    'Signature bakes'),
  ('stat_categories_count','7'),
  ('stat_categories_label','Categories to explore'),
  ('stat_handfinished_count','100%'),
  ('stat_handfinished_label','Hand-finished'),
  ('footer_tagline',      'Where Whisk Whips Wonders — freshly-made cakes and bakes from our cloud kitchen, hand-finished in Vasanthnagar, Bengaluru by chef Anjali V Prasad.'),
  ('footer_address',      '#37, 1st Floor, 8th Main Road, Vasanthnagar, Bengaluru 560052'),
  ('footer_phone',        '+91 97424 86901'),
  ('footer_email',        'chefanjalii@gmail.com'),
  ('footer_instagram',    '@mielekitchen_'),
  ('kitchen_section_heading', 'A peek inside our kitchen'),
  ('kitchen_section_subtext', 'Every bake starts here — freshly made to order, hand-finished with care in our cloud kitchen in Vasanthnagar, Bengaluru.'),
  ('cta_section_heading', 'Planning a birthday, wedding, or just because?'),
  ('cta_section_body',    'Tell us the occasion, the flavour, and the date — we''ll work out the size and design with you directly over WhatsApp, then have it ready for pickup or delivery anywhere in Bengaluru.'),
  ('customizable_intro',  'Pick a design you love and we''ll make it yours — message us on WhatsApp to order.')
ON CONFLICT (key) DO NOTHING;
