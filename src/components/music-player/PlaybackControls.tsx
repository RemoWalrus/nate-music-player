
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  canPlay: boolean;
  playbackError: boolean;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onTogglePlayback: () => void;
}

const PlaybackControls = ({
  isPlaying,
  canPlay,
  playbackError,
  onPrevTrack,
  onNextTrack,
  onTogglePlayback,
}: PlaybackControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrevTrack}
        className="w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 bg-white/10 hover:bg-white/20"
      >
        <SkipBack className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={onTogglePlayback}
        disabled={!canPlay || playbackError}
        className={`w-16 h-16 flex items-center justify-center rounded-full transition-colors duration-200 ${
          canPlay && !playbackError
            ? 'bg-white/10 hover:bg-white/20' 
            : 'bg-white/5 cursor-not-allowed'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8 text-white" />
        ) : (
          <Play className="w-8 h-8 text-white ml-1" />
        )}
      </button>

      <button
        onClick={onNextTrack}
        className="w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 bg-white/10 hover:bg-white/20"
      >
        <SkipForward className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default PlaybackControls;
