
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Album } from "@/hooks/use-album";

interface AlbumPlatformLinksProps {
  album: Album;
  className?: string;
}

export const AlbumPlatformLinks = ({ album, className = "" }: AlbumPlatformLinksProps) => {
  const [platformLinks, setPlatformLinks] = useState<Array<{
    platform: string;
    url: string;
    icon: string;
    order_index: number;
  }>>([]);

  useEffect(() => {
    const fetchPlatformLinks = async () => {
      const { data, error } = await supabase
        .from('platform_links')
        .select('platform, icon, order_index')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching platform links:', error);
      } else if (data) {
        // Map platform links to album URLs
        const albumLinks = data.map(link => {
          let url = '';
          switch (link.platform.toLowerCase()) {
            case 'spotify':
              url = album.spotify_url || '';
              break;
            case 'youtube':
            case 'youtube music':
              url = album.youtube_music_url || '';
              break;
            case 'apple music':
            case 'apple':
              url = album.apple_music_url || '';
              break;
            case 'amazon music':
            case 'amazon':
              url = album.amazon_music_url || '';
              break;
            default:
              url = '';
          }
          
          return {
            platform: link.platform,
            url,
            icon: link.icon,
            order_index: link.order_index
          };
        }).filter(link => link.url); // Only show links that have URLs

        setPlatformLinks(albumLinks);
      }
    };

    fetchPlatformLinks();
  }, [album]);

  const handleClick = (platform: string, url: string) => {
    // Type-safe way to check for gtag
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'external_link_click', {
        platform: platform,
        album_name: album.name
      });
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={className}>
      {platformLinks.map((link, index) => (
        <button
          key={index}
          onClick={() => handleClick(link.platform, link.url)}
          className="text-xs text-gray-500 hover:text-gray-700 text-left py-0.5"
        >
          {link.platform}
        </button>
      ))}
    </div>
  );
};
