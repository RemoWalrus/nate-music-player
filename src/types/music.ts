
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
  spotify_track_id: string;
  track_name: string | null;
  artist_name: string | null;
  artwork_url: string | null;
  mp3_url: string | null;
  youtube_music_url: string | null;
  apple_music_url: string | null;
  amazon_music_url: string | null;
  permalink: string | null;
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
}
