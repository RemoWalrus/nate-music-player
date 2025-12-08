import { supabase } from "@/integrations/supabase/client";

const ARTIST_ID = '1cK40hLuV86SgatMzjMeTA'; // Nathan Garcia's Spotify ID

// No longer need to load credentials client-side - they stay server-side
export const loadSpotifyCredentials = async () => {
  // This function is now a no-op since credentials are managed server-side
  // Keeping it for backward compatibility
  return true;
};

export async function fetchArtistTopTracks() {
  console.log('Fetching tracks from Spotify API via edge function...');
  try {
    const { data, error } = await supabase.functions.invoke('spotify-token', {
      body: { action: 'get-top-tracks' }
    });

    if (error) {
      console.error('Error calling spotify-token function:', error);
      throw new Error('Failed to fetch tracks from Spotify');
    }

    if (!data?.tracks) {
      throw new Error('No tracks returned from Spotify');
    }

    console.log('Loaded tracks:', data.tracks);
    return data.tracks;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
}
