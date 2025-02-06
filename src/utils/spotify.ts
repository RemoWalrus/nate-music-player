const ARTIST_ID = '1cK40hLuV86SgatMzjMeTA'; // Nathan Garcia's Spotify ID

interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
}

let credentials: SpotifyCredentials | null = null;

export const setSpotifyCredentials = (clientId: string, clientSecret: string) => {
  credentials = { clientId, clientSecret };
};

async function getAccessToken() {
  console.log('Getting access token...');
  try {
    if (!credentials) {
      throw new Error('Spotify credentials not set');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${credentials.clientId}:${credentials.clientSecret}`)}`
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token request failed:', errorData);
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function fetchArtistTopTracks() {
  console.log('Fetching tracks from Spotify API...');
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}/top-tracks?market=US`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Loaded tracks:', data.tracks);
    return data.tracks;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
}