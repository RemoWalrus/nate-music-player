
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
  const getPlatformLinks = () => {
    const links = [];
    
    if (youtubeUrl) {
      links.push({
        url: youtubeUrl,
        platform: 'youtube',
        label: 'YouTube'
      });
    }
    
    if (spotifyUrl) {
      links.push({
        url: spotifyUrl,
        platform: 'spotify',
        label: 'Spotify'
      });
    }
    
    if (appleMusicUrl) {
      links.push({
        url: appleMusicUrl,
        platform: 'apple_music',
        label: 'Apple'
      });
    }
    
    if (amazonMusicUrl) {
      links.push({
        url: amazonMusicUrl,
        platform: 'amazon_music',
        label: 'Amazon'
      });
    }
    
    return links;
  };

  const platformLinks = getPlatformLinks();

  return (
    <div className="text-center space-y-2">
      <h2 className="text-white text-2xl font-semibold tracking-wide">
        {name}
      </h2>
      <p className="text-white/80 text-lg">
        {artist}
      </p>
      {platformLinks.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-2 text-xs">
          {platformLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white flex items-center gap-0.5"
            >
              {link.label} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackInfo;
