
import React, { useState } from "react";
import { Disc, Music, Share2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarSection } from "./components/SidebarSection";
import { useShareButton } from "./components/ShareButton";
import { AlbumPlatformLinks } from "./AlbumPlatformLinks";
import { Album } from "@/hooks/use-album";

interface AlbumDesktopSidebarProps {
  album: Album;
}

const iconMap: { [key: string]: typeof Disc } = {
  Disc,
  Music,
  Mail,
  Share2,
};

export const AlbumDesktopSidebar = ({ album }: AlbumDesktopSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { handleShare } = useShareButton();

  const albumDisplayName = album.name.charAt(0).toUpperCase() + album.name.slice(1).toLowerCase();

  const sidebarSections = [
    {
      id: '1',
      label: 'Album',
      icon: 'Disc',
      content: '',
      order_index: 1,
      is_active: true
    },
    {
      id: '2',
      label: 'Music',
      icon: 'Music',
      content: '',
      order_index: 2,
      is_active: true
    },
    {
      id: '3',
      label: 'Contact',
      icon: 'Mail',
      content: '',
      order_index: 3,
      is_active: true
    },
    {
      id: '4',
      label: 'Share',
      icon: 'Share2',
      content: '',
      order_index: 4,
      is_active: true
    }
  ];

  const getSectionContent = (sectionLabel: string) => {
    switch (sectionLabel) {
      case "Album":
        return (
          <div className="space-y-1 text-left">
            <h3 className="font-medium text-xs">{albumDisplayName}</h3>
            <p className="text-xs text-gray-500 whitespace-pre-line">
              {album.description || `The ${albumDisplayName} album by Nathan Garcia.`}
            </p>
          </div>
        );
      case "Music":
        return (
          <div className="space-y-1 text-left">
            <h4 className="text-xs font-medium">Listen to {albumDisplayName} on</h4>
            <AlbumPlatformLinks album={album} className="flex flex-col gap-1" />
          </div>
        );
      case "Contact":
        return (
          <a 
            href="mailto:remo@romergarcia.com?subject=Nathan%20Garcia%20Music&body=Hi%2C%20I%27m%20reaching%20Nathan%20Garcia%27s%20team"
            className="text-xs text-gray-500 hover:text-gray-700 text-left"
          >
            Email us!
          </a>
        );
      case "Share":
        return (
          <button 
            onClick={handleShare}
            className="text-xs text-gray-500 hover:text-gray-700 text-left"
          >
            Share with your friends
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`hidden md:block transition-all duration-300 ease-in-out backdrop-blur-md bg-white/70 border-r border-white/20 ${
      isCollapsed ? "w-20" : "w-96"
    }`}>
      <div className="p-4 border-b border-gray-300/50">
        <div className="flex flex-col">
          <div className="flex justify-end">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className={`${isCollapsed ? "mt-2" : "h-32"} w-full flex flex-col items-center justify-center gap-3`}>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
                alt="Nathan Garcia Logo" 
                className={isCollapsed ? "h-8 w-8" : "h-24 w-32"}
              />
            </Link>
            {!isCollapsed && (
              <span className="text-[#ED2024] font-medium text-lg">About {albumDisplayName}</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-0.5 overflow-hidden">
        {sidebarSections.map((section, index) => (
          <React.Fragment key={section.id}>
            {index > 0 && <div className="border-t border-gray-300/50 w-full my-0.5" />}
            <SidebarSection 
              label={section.label} 
              icon={iconMap[section.icon]} 
              isCollapsed={isCollapsed}
            >
              {getSectionContent(section.label)}
            </SidebarSection>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
