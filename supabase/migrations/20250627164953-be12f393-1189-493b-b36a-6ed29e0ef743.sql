
-- Add Album and Single columns to track_urls table
ALTER TABLE public.track_urls 
ADD COLUMN album text,
ADD COLUMN single text;

-- Add some example data to show how this could work
-- You can update these values as needed for your tracks
UPDATE public.track_urls 
SET 
  album = 'Chipotle',
  single = track_name
WHERE track_name ILIKE '%chipotle%';
