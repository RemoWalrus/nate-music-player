
-- Add album_cover column to track_urls table for shared album artwork
ALTER TABLE public.track_urls 
ADD COLUMN album_cover text;

-- Add example album cover for Chipotle album tracks
-- You can update this with the actual album cover filename or URL
UPDATE public.track_urls 
SET album_cover = 'chipotle-album-cover.jpg'
WHERE album = 'Chipotle';
