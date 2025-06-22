
import { fetchArtistTopTracks } from "./spotify";
import { supabase } from "@/integrations/supabase/client";
import type { SpotifyTrack, TrackUrls } from "../types/music";

export const createCustomTrackFromUrls = async (trackData: TrackUrls): Promise<SpotifyTrack> => {
  let artworkUrl = '/placeholder.svg';
  
  // Handle custom artwork URLs from Supabase storage
  if (trackData.artwork_url) {
    const { data: artworkPublicUrl } = supabase.storage
      .from('graphics')
      .getPublicUrl(trackData.artwork_url);
    
    if (artworkPublicUrl) {
      artworkUrl = artworkPublicUrl.publicUrl;
      console.log('Generated artwork URL for custom track:', trackData.spotify_track_id, ':', artworkUrl);
    }
  }

  return {
    id: trackData.spotify_track_id,
    name: trackData.track_name || 'Unknown Track',
    album: {
      images: [{ url: artworkUrl }]
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
    for (const track of fetchedTracks) {
      if (urlsMap[track.id]) {
        const trackUrlData = urlsMap[track.id];
        let finalAlbumImages = track.album.images;
        
        // Override album artwork if custom artwork is available
        if (trackUrlData.artwork_url) {
          const { data: artworkPublicUrl } = supabase.storage
            .from('graphics')
            .getPublicUrl(trackUrlData.artwork_url);
          
          if (artworkPublicUrl) {
            finalAlbumImages = [{ url: artworkPublicUrl.publicUrl }];
            console.log('Using custom artwork for Spotify track:', track.id, ':', artworkPublicUrl.publicUrl);
          }
        }
        
        combinedTracks.push({
          ...track,
          album: {
            ...track.album,
            images: finalAlbumImages
          },
          youtubeUrl: trackUrlData.youtube_music_url || null,
          spotifyUrl: track.external_urls?.spotify || null,
          appleMusicUrl: trackUrlData.apple_music_url || null,
          amazonMusicUrl: trackUrlData.amazon_music_url || null,
          permalink: trackUrlData.permalink || ''
        });
      }
    }
  }
  
  // Add custom tracks that don't have Spotify counterparts
  if (urlsMap) {
    const spotifyTrackIds = new Set(fetchedTracks.map(track => track.id));
    const customTracksPromises = Object.values(urlsMap)
      .filter(trackData => !spotifyTrackIds.has(trackData.spotify_track_id))
      .map(trackData => createCustomTrackFromUrls(trackData));
    
    const customTracks = await Promise.all(customTracksPromises);
    combinedTracks.push(...customTracks);
  }
  
  console.log('Final combined tracks:', combinedTracks);
  return combinedTracks;
};
