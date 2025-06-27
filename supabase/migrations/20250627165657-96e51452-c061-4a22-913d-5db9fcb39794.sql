
-- Add track_number column to track_urls table
ALTER TABLE public.track_urls 
ADD COLUMN track_number integer;

-- Add some example track numbers for Chipotle tracks
-- You can update these values as needed
UPDATE public.track_urls 
SET track_number = 1
WHERE track_name ILIKE '%chipotle%';
