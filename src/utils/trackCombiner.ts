
import { fetchArtistTopTracks } from "./spotify";
import type { SpotifyTrack, TrackUrls } from "../types/music";

export const createCustomTrackFromUrls = (trackData: TrackUrls): SpotifyTrack => {
  return {
    id: trackData.spotify_track_id,
    name: trackData.track_name || 'Unknown Track',
    album: {
      images: [{ url: trackData.artwork_url || '/placeholder.svg' }]
    },
    artists: [{ name: trackData.artist_name || 'Unknown Artist' }],
    preview_url: null,
    external_urls: {},
    youtubeUrl: trackData.youtube_music_url,
    spotifyUrl: `https://open.spotify.com/track/${trackData.spotify_track_id}`,
    appleMusicUrl: trackData.apple_music_url,
    amazonMusicUrl: trackData.amazon_music_url,
    permalink: trackData.permalink || ''
  };
};

export const combineTracksWithUrls = async (urlsMap: Record<string, TrackUrls> | null): Promise<SpotifyTrack[]> => {
  const combinedTracks: SpotifyTrack[] = [];
  
  // Fetch tracks from Spotify
  const fetchedTracks = await fetchArtistTopTracks();
  console.log('Fetched Spotify tracks:', fetchedTracks);
  
  // Add Spotify tracks that have URLs in our database
  if (fetchedTracks.length > 0 && urlsMap) {
    const tracksWithUrls = fetchedTracks.filter(track => urlsMap[track.id]);
    combinedTracks.push(...tracksWithUrls.map(track => ({
      ...track,
      // Override album artwork if custom artwork is available
      album: {
        ...track.album,
        images: urlsMap[track.id]?.artwork_url 
          ? [{ url: urlsMap[track.id].artwork_url }]
          : track.album.images
      },
      youtubeUrl: urlsMap[track.id]?.youtube_music_url || null,
      spotifyUrl: track.external_urls?.spotify || null,
      appleMusicUrl: urlsMap[track.id]?.apple_music_url || null,
      amazonMusicUrl: urlsMap[track.id]?.amazon_music_url || null,
      permalink: urlsMap[track.id]?.permalink || ''
    })));
  }
  
  // Add custom tracks that don't have Spotify counterparts
  if (urlsMap) {
    const spotifyTrackIds = new Set(fetchedTracks.map(track => track.id));
    const customTracks = Object.values(urlsMap)
      .filter(trackData => !spotifyTrackIds.has(trackData.spotify_track_id))
      .map(trackData => createCustomTrackFromUrls(trackData));
    
    combinedTracks.push(...customTracks);
  }
  
  console.log('Final combined tracks:', combinedTracks);
  return combinedTracks;
};
