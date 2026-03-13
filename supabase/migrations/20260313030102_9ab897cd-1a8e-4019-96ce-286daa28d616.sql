
-- Enable RLS on tables missing it
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sidebar_sections ENABLE ROW LEVEL SECURITY;

-- Add public read-only policies
CREATE POLICY "public_read" ON albums FOR SELECT USING (true);
CREATE POLICY "public_read" ON artists FOR SELECT USING (true);
CREATE POLICY "public_read" ON platform_links FOR SELECT USING (true);
CREATE POLICY "public_read" ON sidebar_sections FOR SELECT USING (true);
