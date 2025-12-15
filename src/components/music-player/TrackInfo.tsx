
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
      <h2 className="text-2xl font-semibold tracking-wide" style={{ color: 'var(--player-text, #ffffff)' }}>
        {name}
      </h2>
      <p className="text-lg" style={{ color: 'var(--player-text-muted, rgba(255, 255, 255, 0.8))' }}>
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
              className="flex items-center gap-0.5 transition-colors"
              style={{ color: 'var(--player-text-subtle, rgba(255, 255, 255, 0.6))' }}
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
