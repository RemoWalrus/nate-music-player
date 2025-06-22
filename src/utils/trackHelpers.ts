
import type { SpotifyTrack, TrackUrls, Track } from "../types/music";

export const createTrackFromSpotify = (
  track: SpotifyTrack, 
  trackUrls: Record<string, TrackUrls>,
  isPlaying: boolean = false
): Track => {
  const trackUrlData = trackUrls[track.id];
  
  return {
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    albumUrl: track.album.images[0]?.url,
    isPlaying,
    previewUrl: track.preview_url,
    mp3Url: trackUrlData?.mp3_url || null,
    youtubeUrl: trackUrlData?.youtube_music_url || null,
    spotifyUrl: track.external_urls?.spotify || null,
    appleMusicUrl: trackUrlData?.apple_music_url || null,
    amazonMusicUrl: trackUrlData?.amazon_music_url || null,
    permalink: trackUrlData?.permalink || ''
  };
};

export const getRandomTrackIndex = (tracksLength: number): number => {
  return Math.floor(Math.random() * tracksLength);
};
