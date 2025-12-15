
import { Play, ExternalLink } from "lucide-react";
import { useLocation } from "react-router-dom";

interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  amazonMusicUrl?: string;
}

interface TrackUrls {
  id: string;
  spotify_track_id: string;
  youtube_music_url?: string;
  apple_music_url?: string;
  amazon_music_url?: string;
  mp3_url?: string;
  track_name?: string;
  artist_name?: string;
  artwork_url?: string;
  permalink?: string;
  album?: string;
  single?: string;
  track_number?: number;
  created_at?: string;
  updated_at?: string;
}

interface PlaylistProps {
  tracks: SpotifyTrack[];
  onTrackSelect: (track: SpotifyTrack) => void;
  currentTrackId: string;
  showTrackNumbers?: boolean;
  trackUrls?: Record<string, TrackUrls>;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const Playlist = ({ 
  tracks, 
  onTrackSelect, 
  currentTrackId, 
  showTrackNumbers = false,
  trackUrls = {}
}: PlaylistProps) => {
  const location = useLocation();
  
  // Check if we're on an album page
  const isAlbumPage = location.pathname.startsWith('/album/') || location.pathname === '/chipotle';

  if (!tracks || tracks.length === 0) {
    return (
      <div 
        className={`mt-4 w-full max-w-2xl mx-auto backdrop-blur-xl rounded-xl ${isAlbumPage ? 'p-6' : 'p-4'}`}
        style={{ backgroundColor: 'var(--player-bg-overlay, rgba(0, 0, 0, 0.2))' }}
      >
        <p className="text-center" style={{ color: 'var(--player-text, #ffffff)' }}>Loading tracks...</p>
      </div>
    );
  }

  const handleTrackSelect = (track: SpotifyTrack) => {
    const playEvent = {
      event: 'track_play',
      track_name: track.name,
      track_artist: track.artists[0].name,
    };
    console.log('Sending play event to GA:', playEvent);
    window.dataLayer?.push(playEvent);
    onTrackSelect(track);
  };

  const handleExternalLinkClick = (platform: string, trackName: string, artistName: string) => {
    const clickEvent = {
      event: 'external_link_click',
      platform: platform,
      track_name: trackName,
      track_artist: artistName,
    };
    console.log('Sending external link click event to GA:', clickEvent);
    window.dataLayer?.push(clickEvent);
  };

  const getPlatformLinks = (track: SpotifyTrack) => {
    const links = [];
    
    if (track.youtubeUrl) {
      links.push({
        url: track.youtubeUrl,
        platform: 'youtube',
        label: 'YouTube'
      });
    }
    
    if (track.spotifyUrl) {
      links.push({
        url: track.spotifyUrl,
        platform: 'spotify',
        label: 'Spotify'
      });
    }
    
    if (track.appleMusicUrl) {
      links.push({
        url: track.appleMusicUrl,
        platform: 'apple_music',
        label: 'Apple Music'
      });
    }
    
    if (track.amazonMusicUrl) {
      links.push({
        url: track.amazonMusicUrl,
        platform: 'amazon_music',
        label: 'Amazon Music'
      });
    }
    
    return links;
  };

  console.log('GTM status:', window.dataLayer ? 'Loaded' : 'Not loaded');
  
  return (
    <div 
      className={`mt-4 w-full max-w-2xl mx-auto backdrop-blur-xl rounded-xl ${isAlbumPage ? 'p-6' : 'p-4'}`}
      style={{ backgroundColor: 'var(--player-bg-overlay, rgba(0, 0, 0, 0.2))' }}
    >
      <div className={`space-y-1 ${isAlbumPage ? 'max-h-96 overflow-y-auto' : ''}`}>
        {tracks.map((track) => {
          const platformLinks = getPlatformLinks(track);
          const trackUrlData = trackUrls[track.id];
          const trackNumber = trackUrlData?.track_number;
          
          return (
            <div
              key={track.id}
              className={`flex items-center justify-between ${isAlbumPage ? 'py-1 px-2' : 'py-0.5 px-2'} rounded-lg transition-colors`}
              style={{
                backgroundColor: currentTrackId === track.id 
                  ? 'var(--player-bg-overlay-hover, rgba(255, 255, 255, 0.2))' 
                  : 'transparent'
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                {showTrackNumbers && trackNumber && (
                  <div className="w-6 text-center">
                    <span className="text-sm font-medium" style={{ color: 'var(--player-text-muted, rgba(255, 255, 255, 0.7))' }}>
                      {trackNumber}
                    </span>
                  </div>
                )}
                <div className="relative group">
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    className={`${isAlbumPage ? 'w-14 h-14' : 'w-12 h-12'} rounded-md object-cover flex-shrink-0`}
                  />
                  <button
                    onClick={() => handleTrackSelect(track)}
                    className="absolute inset-0 bg-black/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 text-white" fill="white" />
                  </button>
                </div>
                <div className="text-left">
                  <h3 className="font-medium" style={{ color: 'var(--player-text, #ffffff)' }}>{track.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--player-text-muted, rgba(255, 255, 255, 0.7))' }}>
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                  {platformLinks.length > 0 && (
                    <div className="flex gap-3 mt-1">
                      {platformLinks.map((link) => (
                        <a
                          key={link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1.5 transition-colors"
                          style={{ color: 'var(--player-text-subtle, rgba(255, 255, 255, 0.6))' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExternalLinkClick(link.platform, track.name, track.artists[0].name);
                          }}
                        >
                          {link.label} <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Playlist;
