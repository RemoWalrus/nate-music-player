
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
  appleMusicUrl?: string | null;
  permalink?: string;
}

export interface TrackUrls {
  spotify_track_id: string;
  mp3_url: string | null;
  youtube_music_url: string | null;
  apple_music_url: string | null;
  permalink: string;
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
  permalink: string;
}
