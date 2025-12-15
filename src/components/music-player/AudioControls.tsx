
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
          className="w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ backgroundColor: 'var(--player-bg-overlay, rgba(255, 255, 255, 0.1))' }}
        >
          <SkipBack className="w-6 h-6" style={{ color: 'var(--player-text, #ffffff)' }} />
        </button>

        <button
          onClick={onTogglePlayback}
          disabled={!hasAudio}
          className={`w-16 h-16 flex items-center justify-center rounded-full transition-colors duration-200 ${
            !hasAudio ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ backgroundColor: 'var(--player-bg-overlay, rgba(255, 255, 255, 0.1))' }}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" style={{ color: 'var(--player-text, #ffffff)' }} />
          ) : (
            <Play className="w-8 h-8 ml-1" style={{ color: 'var(--player-text, #ffffff)' }} />
          )}
        </button>

        <button
          onClick={onNextTrack}
          className="w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ backgroundColor: 'var(--player-bg-overlay, rgba(255, 255, 255, 0.1))' }}
        >
          <SkipForward className="w-6 h-6" style={{ color: 'var(--player-text, #ffffff)' }} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2" style={{ color: 'var(--player-text-subtle, rgba(255, 255, 255, 0.6))' }}>
        {!hasAudio && (
          <div className="flex items-center gap-2">
            <VolumeX className="w-5 h-5" />
            <span className="text-sm">Audio unavailable</span>
          </div>
        )}
        {hasAudio && (
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            <span className="text-sm">Audio available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;
