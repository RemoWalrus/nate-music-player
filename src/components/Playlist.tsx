import { useState } from "react";
import { Play } from "lucide-react";

interface Track {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

interface PlaylistProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
  currentTrackId: string;
}

const Playlist = ({ tracks, onTrackSelect, currentTrackId }: PlaylistProps) => {
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