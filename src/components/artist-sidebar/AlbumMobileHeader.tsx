
import React, { useState } from "react";
import { Menu, Disc, Music, Share2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { AlbumPlatformLinks } from "./AlbumPlatformLinks";
import { useToast } from "@/hooks/use-toast";
import { Album } from "@/hooks/use-album";
import { useTracks } from "@/hooks/use-tracks";

interface AlbumMobileHeaderProps {
  album: Album;
}

const iconMap: { [key: string]: typeof Disc } = {
  Disc,
  Music,
  Mail,
  Share2,
};

export const AlbumMobileHeader = ({ album }: AlbumMobileHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { currentTrack } = useTracks();

  const albumDisplayName = album.name.charAt(0).toUpperCase() + album.name.slice(1).toLowerCase();

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?og=true`;
      if (navigator.share) {
        await navigator.share({
          title: `${albumDisplayName} by Nathan Garcia`,
          text: `Check out the ${albumDisplayName} album by Nathan Garcia!`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          description: "Link copied to clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const sidebarSections = [
    {
      id: '1',
      label: 'Album',
      icon: 'Disc'
    },
    {
      id: '2',
      label: 'Music',
      icon: 'Music'
    },
    {
      id: '3',
      label: 'Contact',
      icon: 'Mail'
    },
    {
      id: '4',
      label: 'Share',
      icon: 'Share2'
    }
  ];

  const getSectionContent = (sectionLabel: string) => {
    switch (sectionLabel) {
      case "Album":
        return (
          <div className="space-y-1 text-left">
            <h3 className="font-medium text-base">{albumDisplayName}</h3>
            <p className="text-xs text-gray-600 whitespace-pre-line">
              {album.description || `The ${albumDisplayName} album by Nathan Garcia.`}
            </p>
          </div>
        );
      case "Music":
        return (
          <div className="space-y-2 text-left">
            <h4 className="text-xs font-medium text-gray-900">Listen to {albumDisplayName} on</h4>
            <AlbumPlatformLinks album={album} className="flex flex-col gap-2" />
          </div>
        );
      case "Contact":
        return (
          <a 
            href="mailto:remo@romergarcia.com?subject=Nathan%20Garcia%20Music&body=Hi%2C%20I%27m%20reaching%20Nathan%20Garcia%27s%20team"
            className="text-xs text-gray-600 hover:text-gray-900 text-left"
          >
            Contact us
          </a>
        );
      case "Share":
        return (
          <button 
            onClick={handleShare}
            className="text-xs text-gray-600 hover:text-gray-900 text-left"
          >
            Share this album
          </button>
        );
      default:
        return null;
    }
  };

  const iconProps = { color: "#ea384c" };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 backdrop-blur-sm z-50 shadow-sm" style={{ backgroundColor: 'hsl(162, 15%, 94%)' }}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
              alt="Nathan Garcia Logo" 
              className="h-8 w-8"
            />
          </Link>
          {currentTrack && currentTrack.isPlaying && (
            <span className="text-xs font-medium text-gray-900">
              Now Playing: {currentTrack.name}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu {...iconProps} className="h-5 w-5" />
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[61px] backdrop-blur-sm z-50 overflow-y-auto" style={{ backgroundColor: 'hsl(162, 15%, 94%)' }}>
          <div className="p-4 space-y-4">
            {sidebarSections.map((section, index) => {
              const Icon = iconMap[section.icon];
              return (
                <React.Fragment key={section.id}>
                  {index > 0 && <div className="border-t border-gray-200" />}
                  <div className="flex items-start gap-3 py-2">
                    <Icon {...iconProps} className="h-5 w-5 shrink-0 mt-1" />
                    <div className="space-y-2 flex-1 text-left">
                      <h3 className="text-xs font-medium text-gray-900">{section.label}</h3>
                      {getSectionContent(section.label)}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
