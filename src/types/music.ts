
export interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
  preview_url: string | null;
  external_urls?: {
    spotify?: string;
  };
  youtubeUrl?: string | null;
  spotifyUrl?: string | null;
  appleMusicUrl?: string | null;
  amazonMusicUrl?: string | null;
  permalink?: string;
}

export interface TrackUrls {
  id: string;
  spotify_track_id: string;
  youtube_music_url?: string;
  apple_music_url?: string;
  amazon_music_url?: string;
  mp3_url?: string;
  track_name?: string;
  artist_name?: string;
  artwork_url?: string;
  permalink?: string;
  album?: string;
  single?: string;
  track_number?: number;
  album_cover?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  albumUrl: string;
  isPlaying: boolean;
  previewUrl: string | null;
  mp3Url: string | null;
  youtubeUrl: string | null;
  spotifyUrl: string | null;
  appleMusicUrl: string | null;
  amazonMusicUrl: string | null;
  permalink: string;
  trackNumber?: number;
}
