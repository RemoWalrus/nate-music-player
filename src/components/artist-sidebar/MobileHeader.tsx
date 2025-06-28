
import React, { useState } from "react";
import { Menu, User, Music, Newspaper, Share2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { MusicPlatformLinks } from "./MusicPlatformLinks";
import { useToast } from "@/hooks/use-toast";
import { SidebarSection } from "../types/sidebar";
import { useTracks } from "@/hooks/use-tracks";

interface MobileHeaderProps {
  artistBio: string;
  sidebarSections: SidebarSection[];
}

const iconMap: { [key: string]: typeof User } = {
  User,
  Music,
  Newspaper,
  Mail,
  Share2,
};

export const MobileHeader = ({ artistBio, sidebarSections }: MobileHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { currentTrack } = useTracks();

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}?og=true`;
      if (navigator.share) {
        await navigator.share({
          title: 'Nathan Garcia Music',
          text: 'Check out Nathan Garcia\'s music!',
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

  const getSectionContent = (section: SidebarSection) => {
    switch (section.label) {
      case "Artist":
        return (
          <div className="space-y-1 text-left">
            <h3 className="font-medium text-base">Nathan Garcia</h3>
            <p className="text-xs text-gray-600 whitespace-pre-line">{artistBio}</p>
          </div>
        );
      case "Music":
        return (
          <div className="space-y-2 text-left">
            <h4 className="text-xs font-medium text-gray-900">Listen on</h4>
            <MusicPlatformLinks className="flex flex-col gap-2" />
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
            Share this page
          </button>
        );
      default:
        return (
          <p className="text-xs text-gray-600 text-left">
            {section.content}
          </p>
        );
    }
  };

  const iconProps = { color: "#ea384c" };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
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
        <div className="fixed inset-0 top-[61px] bg-white z-50 overflow-y-auto">
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
                      {getSectionContent(section)}
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
