
import { fetchArtistTopTracks } from "./spotify";
import { supabase } from "@/integrations/supabase/client";
import type { SpotifyTrack, TrackUrls } from "../types/music";

export const createCustomTrackFromUrls = async (trackData: TrackUrls): Promise<SpotifyTrack> => {
  let artworkUrl = '/placeholder.svg';
  
  console.log('Creating custom track from URLs:', trackData);
  
  // Prioritize album_cover over individual artwork_url
  const imageSource = trackData.album_cover || trackData.artwork_url;
  console.log('Image source for custom track:', trackData.spotify_track_id, ':', imageSource);
  
  // Handle custom artwork URLs from Supabase storage
  if (imageSource) {
    try {
      // Check if it's already a full URL
      if (imageSource.startsWith('http')) {
        artworkUrl = imageSource;
        console.log('Using full URL for custom track:', trackData.spotify_track_id, ':', artworkUrl);
      } else {
        // It's a filename, get public URL from storage
        const bucketName = trackData.album_cover ? 'artwork' : 'artwork';
        const { data: artworkPublicUrl } = supabase.storage
          .from(bucketName)
          .getPublicUrl(imageSource);
        
        if (artworkPublicUrl) {
          artworkUrl = artworkPublicUrl.publicUrl;
          console.log('Generated artwork URL for custom track:', trackData.spotify_track_id, ':', artworkUrl);
        }
      }
    } catch (error) {
      console.error('Exception getting artwork URL:', error);
    }
  } else {
    console.log('No artwork_url or album_cover found for track:', trackData.spotify_track_id);
  }

  // Better fallback handling for track name and artist
  const trackName = trackData.track_name || `Track ${trackData.spotify_track_id}`;
  const artistName = trackData.artist_name || 'Nathan Garcia';
  
  console.log('Creating track with name:', trackName, 'artist:', artistName);

  return {
    id: trackData.spotify_track_id,
    name: trackName,
    album: {
      images: [{ url: artworkUrl }]
    },
    artists: [{ name: artistName }],
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
        let finalAlbumImages = track.album.images; // Default to Spotify artwork
        
        console.log('Processing Spotify track:', track.id, 'with URL data:', trackUrlData);
        console.log('Track name:', track.name);
        console.log('Album cover from database:', trackUrlData.album_cover);
        console.log('Individual artwork_url from database:', trackUrlData.artwork_url);
        console.log('Default Spotify artwork:', track.album.images[0]?.url);
        
        // Prioritize album_cover, then individual artwork_url
        const imageSource = trackUrlData.album_cover || trackUrlData.artwork_url;
        
        // Only override if we have custom artwork AND it's valid
        if (imageSource) {
          try {
            let customArtworkUrl = null;
            
            // Check if it's already a full URL
            if (imageSource.startsWith('http')) {
              customArtworkUrl = imageSource;
              console.log('Using full URL for Spotify track:', track.id, ':', customArtworkUrl);
            } else {
              // It's a filename, get public URL from storage
              const { data: artworkPublicUrl } = supabase.storage
                .from('artwork')
                .getPublicUrl(imageSource);
              
              if (artworkPublicUrl?.publicUrl) {
                customArtworkUrl = artworkPublicUrl.publicUrl;
                console.log('Generated custom artwork URL for Spotify track:', track.id, ':', customArtworkUrl);
              }
            }
            
            // Only use custom artwork if we successfully got a URL
            if (customArtworkUrl) {
              finalAlbumImages = [{ url: customArtworkUrl }];
              console.log('Using custom artwork for track:', track.name, '(album_cover priority)');
            } else {
              console.log('Failed to get custom artwork, using Spotify artwork for:', track.name);
            }
          } catch (error) {
            console.error('Exception getting Spotify track artwork URL, falling back to Spotify artwork:', error);
            // Keep the default Spotify artwork
          }
        } else {
          console.log('No custom artwork for Spotify track:', track.id, 'using default Spotify artwork');
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
    console.log('Created custom tracks:', customTracks);
    combinedTracks.push(...customTracks);
  }
  
  console.log('Final combined tracks:', combinedTracks);
  return combinedTracks;
};
