
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Album {
  id: string;
  name: string;
  description: string | null;
  spotify_url: string | null;
  youtube_music_url: string | null;
  apple_music_url: string | null;
  amazon_music_url: string | null;
  album_cover: string | null;
}

export function useAlbum(albumName: string) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('albums')
          .select('*')
          .ilike('name', albumName)
          .single();
        
        if (error) {
          console.error('Error fetching album:', error);
          setError(error.message);
        } else {
          setAlbum(data);
        }
      } catch (err) {
        console.error('Error fetching album:', err);
        setError('Failed to fetch album data');
      } finally {
        setIsLoading(false);
      }
    };

    if (albumName) {
      fetchAlbum();
    }
  }, [albumName]);

  return { album, isLoading, error };
}
