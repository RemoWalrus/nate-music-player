
import { Volume2, VolumeX } from "lucide-react";

interface PlaybackStatusProps {
  playbackError: boolean;
  hasAudioSource: boolean;
}

const PlaybackStatus = ({ playbackError, hasAudioSource }: PlaybackStatusProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {playbackError ? (
        <div className="flex items-center gap-2 text-red-400">
          <VolumeX className="w-5 h-5" />
          <span className="text-sm">Playback error</span>
        </div>
      ) : !hasAudioSource ? (
        <div className="flex items-center gap-2 text-white/60">
          <VolumeX className="w-5 h-5" />
          <span className="text-sm">Audio unavailable</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white/60">
          <Volume2 className="w-5 h-5" />
          <span className="text-sm">Audio available</span>
        </div>
      )}
    </div>
  );
};

export default PlaybackStatus;
