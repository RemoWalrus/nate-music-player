
-- Create a table for album information
CREATE TABLE public.albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  spotify_url TEXT,
  youtube_music_url TEXT,
  apple_music_url TEXT,
  amazon_music_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger to update updated_at column
CREATE TRIGGER update_albums_updated_at
    BEFORE UPDATE ON public.albums
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for the Chipotle album
INSERT INTO public.albums (name, description, spotify_url, youtube_music_url, apple_music_url, amazon_music_url)
VALUES (
  'Chipotle',
  'A playful collection of songs inspired by the beloved Mexican restaurant chain, blending whimsical lyrics with catchy electronic beats.',
  'https://open.spotify.com/album/chipotle-album-id',
  'https://music.youtube.com/playlist?list=chipotle-playlist-id',
  'https://music.apple.com/us/album/chipotle/chipotle-album-id',
  'https://music.amazon.com/albums/chipotle-album-id'
);
