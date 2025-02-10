
import { Play, ExternalLink } from "lucide-react";

interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

interface PlaylistProps {
  tracks: SpotifyTrack[];
  onTrackSelect: (track: SpotifyTrack) => void;
  currentTrackId: string;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const Playlist = ({ tracks, onTrackSelect, currentTrackId }: PlaylistProps) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="mt-8 w-full max-w-2xl mx-auto bg-black/20 backdrop-blur-xl rounded-xl p-4">
        <p className="text-white text-center">Loading tracks...</p>
      </div>
    );
  }

  const handleTrackSelect = (track: SpotifyTrack) => {
    // Track play event - push variables directly to dataLayer
    const playEvent = {
      event: 'track_play',
      track_name: track.name,
      track_artist: track.artists[0].name,
    };
    console.log('Sending play event to GA:', playEvent);
    window.dataLayer?.push(playEvent);
    onTrackSelect(track);
  };

  const handleExternalLinkClick = (platform: string, trackName: string, artistName: string) => {
    // Track external link click event - push variables directly to dataLayer
    const clickEvent = {
      event: 'external_link_click',
      platform: platform,
      track_name: trackName,
      track_artist: artistName,
    };
    console.log('Sending external link click event to GA:', clickEvent);
    window.dataLayer?.push(clickEvent);
  };

  // Verify GTM is loaded
  console.log('GTM status:', window.dataLayer ? 'Loaded' : 'Not loaded');
  
  return (
    <div className="mt-8 w-full max-w-2xl mx-auto bg-black/20 backdrop-blur-xl rounded-xl p-4">
      <div className="space-y-2">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              currentTrackId === track.id
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className="w-12 h-12 rounded-md"
              />
              <div className="text-left">
                <h3 className="text-white font-medium">{track.name}</h3>
                <p className="text-white/70 text-sm">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
                <div className="flex gap-4 mt-1">
                  {track.youtubeUrl && (
                    <a
                      href={track.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white text-xs flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExternalLinkClick('youtube', track.name, track.artists[0].name);
                      }}
                    >
                      YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {track.spotifyUrl && (
                    <a
                      href={track.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white text-xs flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExternalLinkClick('spotify', track.name, track.artists[0].name);
                      }}
                    >
                      Spotify <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {track.appleMusicUrl && (
                    <a
                      href={track.appleMusicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white text-xs flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExternalLinkClick('apple_music', track.name, track.artists[0].name);
                      }}
                    >
                      Apple Music <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleTrackSelect(track)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <Play className="w-5 h-5 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
