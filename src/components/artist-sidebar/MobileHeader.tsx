
import React, { useState } from "react";
import { Menu, User, Music, Newspaper, Share2, Mail } from "lucide-react";
import { MusicPlatformLinks } from "./MusicPlatformLinks";
import { useToast } from "@/hooks/use-toast";
import { SidebarSection } from "../types/sidebar";

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
          <div className="space-y-1">
            <h3 className="font-medium">Nathan Garcia</h3>
            <p className="text-sm text-gray-500 whitespace-pre-line">{artistBio}</p>
          </div>
        );
      case "Music":
        return (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Music Platforms</h4>
            <MusicPlatformLinks className="flex flex-col gap-2" />
          </div>
        );
      case "Contact":
        return (
          <a 
            href="mailto:remo@romergarcia.com?subject=Nathan%20Garcia%20Music&body=Hi%2C%20I%27m%20reaching%20Nathan%20Garcia%27s%20team"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Email us!
          </a>
        );
      case "Share":
        return (
          <button 
            onClick={handleShare}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Share with your friends
          </button>
        );
      default:
        return (
          <p className="text-sm text-gray-500">
            {section.content}
          </p>
        );
    }
  };

  const iconProps = { color: "#ea384c" };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <img 
          src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
          alt="Nathan Garcia Logo" 
          className="h-8 w-8"
        />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu {...iconProps} className="h-5 w-5" />
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="p-4 space-y-4">
            {sidebarSections.map((section, index) => {
              const Icon = iconMap[section.icon];
              return (
                <React.Fragment key={section.id}>
                  {index > 0 && <div className="border-t border-gray-300/50" />}
                  <div className="flex items-center gap-3 text-gray-700">
                    <Icon {...iconProps} className="h-5 w-5 shrink-0" />
                    <div className="space-y-2">
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
