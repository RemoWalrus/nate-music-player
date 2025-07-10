
import React, { useState } from "react";
import { Menu, Disc, Music, Share2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { AlbumPlatformLinks } from "./AlbumPlatformLinks";
import { useToast } from "@/hooks/use-toast";
import { Album } from "@/hooks/use-album";
import { useTracks } from "@/hooks/use-tracks";

interface AlbumMobileHeaderProps {
  album: Album;
  backgroundColor?: string;
}

const iconMap: { [key: string]: typeof Disc } = {
  Disc,
  Music,
  Mail,
  Share2,
};

export const AlbumMobileHeader = ({ album, backgroundColor }: AlbumMobileHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { currentTrack } = useTracks();

  // Convert RGB background color to a much lighter version
  const getLighterBackgroundColor = (bgColor?: string) => {
    if (!bgColor) return 'hsl(162, 15%, 94%)';
    
    const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) return 'hsl(162, 15%, 94%)';
    
    const [, r, g, b] = rgbMatch.map(Number);
    
    // Convert RGB to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      if (max === rNorm) h = ((gNorm - bNorm) / diff) % 6;
      else if (max === gNorm) h = (bNorm - rNorm) / diff + 2;
      else h = (rNorm - gNorm) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
    
    // Create a much lighter version with reduced saturation
    const lightness = Math.max(92, l * 100); // Ensure minimum 92% lightness
    const saturation = Math.min(15, s * 100); // Cap saturation at 15%
    
    return `hsl(${h}, ${saturation}%, ${lightness}%)`;
  };

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
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 backdrop-blur-sm z-[999999] shadow-sm" style={{ backgroundColor: getLighterBackgroundColor(backgroundColor) }}>
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
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors z-[999999]"
            aria-label="Toggle menu"
          >
            <Menu {...iconProps} className="h-5 w-5" />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 top-0 bg-black/50 z-[999998] overflow-y-auto" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMobileMenuOpen(false);
            }
          }}
        >
          <div className="mt-[77px] min-h-screen" style={{ backgroundColor: getLighterBackgroundColor(backgroundColor) }}>
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
        </div>
      )}
    </>
  );
};
