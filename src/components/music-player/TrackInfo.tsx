
import { ExternalLink } from "lucide-react";

interface TrackInfoProps {
  name: string;
  artist: string;
  youtubeUrl?: string | null;
  spotifyUrl?: string | null;
  appleMusicUrl?: string | null;
  amazonMusicUrl?: string | null;
}

const TrackInfo = ({ 
  name, 
  artist, 
  youtubeUrl, 
  spotifyUrl, 
  appleMusicUrl, 
  amazonMusicUrl 
}: TrackInfoProps) => {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-white text-2xl font-semibold tracking-wide">
        {name}
      </h2>
      <p className="text-white/80 text-lg">
        {artist}
      </p>
      <div className="flex items-center justify-center gap-2 mt-2 text-xs">
        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white flex items-center gap-0.5"
          >
            YouTube <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {spotifyUrl && (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white flex items-center gap-0.5"
          >
            Spotify <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {appleMusicUrl && (
          <a
            href={appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white flex items-center gap-0.5"
          >
            Apple <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {amazonMusicUrl && (
          <a
            href={amazonMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white flex items-center gap-0.5"
          >
            Amazon <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
