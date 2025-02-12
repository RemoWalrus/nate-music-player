
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

interface AudioControlsProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  hasAudio: boolean;
}

const AudioControls = ({ 
  isPlaying, 
  onTogglePlayback, 
  onPrevTrack, 
  onNextTrack,
  hasAudio 
}: AudioControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onPrevTrack}
          className="w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 bg-white/10 hover:bg-white/20"
        >
          <SkipBack className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={onTogglePlayback}
          disabled={!hasAudio}
          className={`w-16 h-16 flex items-center justify-center rounded-full transition-colors duration-200 ${
            hasAudio
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

      <div className="flex items-center justify-center gap-2">
        {!hasAudio && (
          <div className="flex items-center gap-2 text-white/60">
            <VolumeX className="w-5 h-5" />
            <span className="text-sm">Audio unavailable</span>
          </div>
        )}
        {hasAudio && (
          <div className="flex items-center gap-2 text-white/60">
            <Volume2 className="w-5 h-5" />
            <span className="text-sm">Audio available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;
