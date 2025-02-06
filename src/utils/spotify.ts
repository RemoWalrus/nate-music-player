const SPOTIFY_ARTIST_ID = '1cK40hLuV86SgatMzjMeTA';
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

// Using a temporary access token - in production, this should be handled properly with OAuth
const ACCESS_TOKEN = 'BQBUXwV_7JfXQXhR9FuJE9_6QgPHFWvxXhHBGBWxgFAQEEQwJLZWtWQELvBWEtYQEEQwJLZWtWQELvBWEtYQEEQwJLZWtWQELvBWEtY';

interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

export const fetchArtistTopTracks = async (): Promise<SpotifyTrack[]> => {
  try {
    console.log('Fetching tracks from Spotify API...');
    const response = await fetch(
      `${SPOTIFY_BASE_URL}/artists/${SPOTIFY_ARTIST_ID}/top-tracks?market=US`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Spotify API error:', errorData);
      throw new Error(`Spotify API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Fetched tracks successfully:', data.tracks);
    return data.tracks || [];
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
};