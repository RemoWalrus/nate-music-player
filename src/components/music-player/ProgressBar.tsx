
import { Progress } from "../ui/progress";

interface ProgressBarProps {
  progress: number;
  duration: number;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProgressBar = ({ progress, duration, onProgressClick }: ProgressBarProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex items-center gap-2">
      <span className="text-white/60 text-sm w-12 text-right">
        {formatTime(progress)}
      </span>
      <div 
        className="flex-1 cursor-pointer"
        onClick={onProgressClick}
      >
        <Progress 
          value={(progress / duration) * 100} 
          className="h-1.5"
        />
      </div>
      <span className="text-white/60 text-sm w-12">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;
