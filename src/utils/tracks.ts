
import { SpotifyTrack, TrackUrls, Track } from "../types/music";
import { supabase } from "@/integrations/supabase/client";
import { encryptFileName } from "./fileEncryption";

export const getTrackUrlsFromSupabase = async () => {
  try {
    console.log('Fetching all track URLs from Supabase');
    const { data: urlsData, error: urlsError } = await supabase
      .from('track_urls')
      .select('*');

    if (urlsError) {
      console.error('Error fetching track URLs:', urlsError);
      return null;
    }

    console.log('Received track URLs data:', urlsData);

    const urlsMap: Record<string, TrackUrls> = {};
    
    for (const track of urlsData || []) {
      let mp3Url = null;
      if (track.mp3_url) {
        const { data: publicUrl } = supabase.storage
          .from('audio')
          .getPublicUrl(track.mp3_url);
        
        if (publicUrl) {
          const url = new URL(publicUrl.publicUrl);
          const pathParts = url.pathname.split('/');
          const fileName = pathParts[pathParts.length - 1];
          const encryptedFileName = encryptFileName(fileName);
          pathParts[pathParts.length - 1] = encryptedFileName;
          url.pathname = pathParts.join('/');
          mp3Url = url.toString();
          console.log('Generated encrypted URL for', track.spotify_track_id, ':', mp3Url);
        }
      }

      let artworkUrl = track.artwork_url;
      if (artworkUrl) {
        const { data: publicUrl } = supabase.storage
          .from('artwork')
          .getPublicUrl(artworkUrl);
        if (publicUrl) {
          artworkUrl = publicUrl.publicUrl;
        }
      }

      urlsMap[track.spotify_track_id] = {
        spotify_track_id: track.spotify_track_id,
        mp3_url: mp3Url,
        youtube_music_url: track.youtube_music_url,
        apple_music_url: track.apple_music_url,
        amazon_music_url: track.amazon_music_url,
        permalink: track.permalink,
        artwork_url: artworkUrl,
        track_name: track.track_name,
        artist_name: track.artist_name
      };
    }

    console.log('Final track URLs map:', urlsMap);
    return urlsMap;
  } catch (error) {
    console.error('Error in fetchTrackUrls:', error);
    return null;
  }
};

export const createTrackFromSpotify = (
  spotifyTrack: SpotifyTrack,
  trackUrls: TrackUrls | undefined
): Track => ({
  id: spotifyTrack.id,
  name: spotifyTrack.name,
  artist: spotifyTrack.artists[0].name,
  albumUrl: trackUrls?.artwork_url || spotifyTrack.album.images[0]?.url,
  isPlaying: false,
  previewUrl: spotifyTrack.preview_url,
  mp3Url: trackUrls?.mp3_url || null,
  youtubeUrl: trackUrls?.youtube_music_url || null,
  spotifyUrl: spotifyTrack.external_urls?.spotify || null,
  appleMusicUrl: trackUrls?.apple_music_url || null,
  amazonMusicUrl: trackUrls?.amazon_music_url || null,
  permalink: trackUrls?.permalink || ''
});

export const createTrackFromUrls = (trackUrl: TrackUrls): SpotifyTrack => ({
  id: trackUrl.spotify_track_id,
  name: trackUrl.track_name || '',
  artists: [{ name: trackUrl.artist_name || '' }],
  album: { 
    images: [{ 
      url: trackUrl.artwork_url || 'https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg'
    }] 
  },
  preview_url: null,
  external_urls: { spotify: null }
});
