
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

const Playlist = ({ tracks, onTrackSelect, currentTrackId }: PlaylistProps) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="mt-8 w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-xl p-4">
        <p className="text-white text-center">Loading tracks...</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-xl p-4">
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
                      onClick={(e) => e.stopPropagation()}
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
                      onClick={(e) => e.stopPropagation()}
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      Apple Music <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => onTrackSelect(track)}
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
