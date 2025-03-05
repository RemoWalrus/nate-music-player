
import React, { useState } from "react";
import { User, Music, Newspaper, Share2, Mail } from "lucide-react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MusicPlatformLinks } from "./MusicPlatformLinks";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarSection } from "./components/SidebarSection";
import { useShareButton } from "./components/ShareButton";
import { SidebarSection as SidebarSectionType } from "../types/sidebar";

interface DesktopSidebarProps {
  artistBio: string;
  sidebarSections: SidebarSectionType[];
}

const iconMap: { [key: string]: typeof User } = {
  User,
  Music,
  Newspaper,
  Mail,
  Share2,
};

export const DesktopSidebar = ({ artistBio, sidebarSections }: DesktopSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { handleShare } = useShareButton();

  const getSectionContent = (section: SidebarSectionType) => {
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
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Listen on</h4>
            <MusicPlatformLinks className="flex flex-col gap-1" />
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
          <div className="space-y-1">
            <p className="text-sm text-gray-500">{section.content}</p>
          </div>
        );
    }
  };

  return (
    <Sidebar
      className={`hidden md:block transition-all duration-300 ease-in-out backdrop-blur-md bg-white/70 border-r border-white/20 ${
        isCollapsed ? "w-20" : "w-80"
      }`}
    >
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <SidebarContent className="space-y-1">
        {sidebarSections.map((section, index) => (
          <React.Fragment key={section.id}>
            {index > 0 && <div className="border-t border-gray-300/50" />}
            <SidebarSection 
              label={section.label} 
              icon={iconMap[section.icon]} 
              isCollapsed={isCollapsed}
            >
              {getSectionContent(section)}
            </SidebarSection>
          </React.Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
