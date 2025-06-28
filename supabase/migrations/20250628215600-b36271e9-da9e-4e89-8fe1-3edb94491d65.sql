
-- Add album_cover column to albums table
ALTER TABLE public.albums 
ADD COLUMN album_cover text;

-- Move album cover data from track_urls to albums table
UPDATE public.albums 
SET album_cover = (
  SELECT DISTINCT album_cover 
  FROM public.track_urls 
  WHERE track_urls.album = albums.name 
  AND album_cover IS NOT NULL 
  LIMIT 1
);

-- Remove album_cover column from track_urls table
ALTER TABLE public.track_urls 
DROP COLUMN album_cover;
