const SPOTIFY_ARTIST_ID = '1cK40hLuV86SgatMzjMeTA';
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const CLIENT_ID = '13085f73bf14486bb13c6d60cea896ed';

async function getAccessToken() {
  try {
    console.log('Getting access token...');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}`,
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    console.log('Successfully obtained access token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

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
    const accessToken = await getAccessToken();
    
    const response = await fetch(
      `${SPOTIFY_BASE_URL}/artists/${SPOTIFY_ARTIST_ID}/top-tracks?market=US`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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