
import { fetchArtistTopTracks } from "./spotify";
import { supabase } from "@/integrations/supabase/client";
import type { SpotifyTrack, TrackUrls } from "../types/music";

export interface TrackCombinerOptions {
  preferAlbumCover?: boolean;
}

export const createCustomTrackFromUrls = async (trackData: TrackUrls, options: TrackCombinerOptions = {}): Promise<SpotifyTrack> => {
  let artworkUrl = '/placeholder.svg';
  
  console.log('Creating custom track from URLs:', trackData);
  
  // For album pages, try to get album cover from albums table
  if (options.preferAlbumCover && trackData.album) {
    try {
      const { data: albumData } = await supabase
        .from('albums')
        .select('album_cover')
        .ilike('name', trackData.album)
        .single();
      
      if (albumData?.album_cover) {
        console.log('Found album cover from albums table:', albumData.album_cover);
        // Handle custom artwork URLs from Supabase storage
        if (albumData.album_cover.startsWith('http')) {
          artworkUrl = albumData.album_cover;
        } else {
          // It's a filename, get public URL from storage
          const { data: artworkPublicUrl } = supabase.storage
            .from('artwork')
            .getPublicUrl(albumData.album_cover);
          
          if (artworkPublicUrl) {
            artworkUrl = artworkPublicUrl.publicUrl;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching album cover:', error);
    }
  }
  
  // Fallback to individual artwork if no album cover found
  if (artworkUrl === '/placeholder.svg' && trackData.artwork_url) {
    try {
      if (trackData.artwork_url.startsWith('http')) {
        artworkUrl = trackData.artwork_url;
      } else {
        const { data: artworkPublicUrl } = supabase.storage
          .from('artwork')
          .getPublicUrl(trackData.artwork_url);
        
        if (artworkPublicUrl) {
          artworkUrl = artworkPublicUrl.publicUrl;
        }
      }
    } catch (error) {
      console.error('Exception getting artwork URL:', error);
    }
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

export const combineTracksWithUrls = async (urlsMap: Record<string, TrackUrls> | null, options: TrackCombinerOptions = {}): Promise<SpotifyTrack[]> => {
  const combinedTracks: SpotifyTrack[] = [];
  
  // Fetch tracks from Spotify
  const fetchedTracks = await fetchArtistTopTracks();
  console.log('Fetched Spotify tracks:', fetchedTracks);
  
  // Get album covers from albums table for album pages
  let albumCovers: Record<string, string> = {};
  if (options.preferAlbumCover) {
    try {
      const { data: albumsData } = await supabase
        .from('albums')
        .select('name, album_cover');
      
      if (albumsData) {
        albumCovers = albumsData.reduce((acc, album) => {
          if (album.album_cover) {
            acc[album.name.toLowerCase()] = album.album_cover;
          }
          return acc;
        }, {} as Record<string, string>);
      }
    } catch (error) {
      console.error('Error fetching album covers:', error);
    }
  }
  
  // Add Spotify tracks that have URLs in our database
  if (fetchedTracks.length > 0 && urlsMap) {
    for (const track of fetchedTracks) {
      if (urlsMap[track.id]) {
        const trackUrlData = urlsMap[track.id];
        let finalAlbumImages = track.album.images; // Default to Spotify artwork
        
        console.log('Processing Spotify track:', track.id, 'with URL data:', trackUrlData);
        
        // For album pages, prioritize album cover from albums table
        if (options.preferAlbumCover && trackUrlData.album) {
          const albumCover = albumCovers[trackUrlData.album.toLowerCase()];
          if (albumCover) {
            try {
              let customArtworkUrl = null;
              
              if (albumCover.startsWith('http')) {
                customArtworkUrl = albumCover;
              } else {
                const { data: artworkPublicUrl } = supabase.storage
                  .from('artwork')
                  .getPublicUrl(albumCover);
                
                if (artworkPublicUrl?.publicUrl) {
                  customArtworkUrl = artworkPublicUrl.publicUrl;
                }
              }
              
              if (customArtworkUrl) {
                finalAlbumImages = [{ url: customArtworkUrl }];
                console.log('Using album cover for track:', track.name);
              }
            } catch (error) {
              console.error('Exception getting album cover URL:', error);
            }
          }
        }
        
        // Fallback to individual artwork if no album cover
        if (finalAlbumImages === track.album.images && trackUrlData.artwork_url) {
          try {
            let customArtworkUrl = null;
            
            if (trackUrlData.artwork_url.startsWith('http')) {
              customArtworkUrl = trackUrlData.artwork_url;
            } else {
              const { data: artworkPublicUrl } = supabase.storage
                .from('artwork')
                .getPublicUrl(trackUrlData.artwork_url);
              
              if (artworkPublicUrl?.publicUrl) {
                customArtworkUrl = artworkPublicUrl.publicUrl;
              }
            }
            
            if (customArtworkUrl) {
              finalAlbumImages = [{ url: customArtworkUrl }];
              console.log('Using individual artwork for track:', track.name);
            }
          } catch (error) {
            console.error('Exception getting individual artwork URL:', error);
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
      .map(trackData => createCustomTrackFromUrls(trackData, options));
    
    const customTracks = await Promise.all(customTracksPromises);
    console.log('Created custom tracks:', customTracks);
    combinedTracks.push(...customTracks);
  }
  
  console.log('Final combined tracks:', combinedTracks);
  return combinedTracks;
};
