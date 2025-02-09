
import { useState } from "react";
import { User, Newspaper, Music, Share2, Mail } from "lucide-react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MusicPlatformLinks } from "./MusicPlatformLinks";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarSection } from "./components/SidebarSection";
import { useShareButton } from "./components/ShareButton";

interface DesktopSidebarProps {
  artistBio: string;
}

export const DesktopSidebar = ({ artistBio }: DesktopSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { handleShare } = useShareButton();

  const iconProps = { color: "#ea384c" };

  return (
    <Sidebar
      className={`hidden md:block transition-all duration-300 ease-in-out backdrop-blur-md bg-white/70 border-r border-white/20 ${
        isCollapsed ? "w-20" : "w-80"
      }`}
    >
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <SidebarContent className="space-y-1">
        <SidebarSection label="Artist" icon={User} isCollapsed={isCollapsed}>
          <div className="space-y-1">
            <h3 className="font-medium">Nathan Garcia</h3>
            <p className="text-sm text-gray-500">{artistBio}</p>
          </div>
        </SidebarSection>

        <div className="border-t border-gray-300/50" />

        <SidebarSection label="Music" icon={Music} isCollapsed={isCollapsed}>
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Listen on</h4>
            <MusicPlatformLinks className="flex flex-col gap-1" />
          </div>
        </SidebarSection>

        <div className="border-t border-gray-300/50" />

        <SidebarSection label="Latest News" icon={Newspaper} isCollapsed={isCollapsed}>
          <div className="space-y-1">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">New Single Release</h4>
              <p className="text-sm text-gray-500">
                Latest single "Thankful daddy" now available on all platforms.
              </p>
            </div>
          </div>
        </SidebarSection>

        <div className="border-t border-gray-300/50" />

        <SidebarSection label="Contact" icon={Mail} isCollapsed={isCollapsed}>
          <div className="space-y-1">
            <a 
              href="mailto:info@nathangarciamusic.com"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Email us!
            </a>
          </div>
        </SidebarSection>

        <div className="border-t border-gray-300/50" />

        <SidebarSection label="Share" icon={Share2} isCollapsed={isCollapsed}>
          <div className="space-y-1">
            <button 
              onClick={handleShare}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Share with your friends
            </button>
          </div>
        </SidebarSection>
      </SidebarContent>
    </Sidebar>
  );
};
