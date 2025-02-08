
import { cn } from "@/lib/utils";

interface MusicPlatformLinksProps {
  className?: string;
}

export const MusicPlatformLinks = ({ className }: MusicPlatformLinksProps) => {
  return (
    <div className={cn(className)}>
      <a href="https://music.youtube.com/channel/UCrGiV8amcSjOyJevavJERLA" 
         target="_blank" 
         rel="noopener noreferrer"
         className="text-gray-500 hover:text-gray-700">
        YouTube Music
      </a>
      <a href="https://open.spotify.com/artist/1cK40hLuV86SgatMzjMeTA" 
         target="_blank" 
         rel="noopener noreferrer"
         className="text-gray-500 hover:text-gray-700">
        Spotify
      </a>
      <a href="https://music.apple.com/us/artist/nathan-garcia/1778355814" 
         target="_blank" 
         rel="noopener noreferrer"
         className="text-gray-500 hover:text-gray-700">
        Apple Music
      </a>
    </div>
  );
};

