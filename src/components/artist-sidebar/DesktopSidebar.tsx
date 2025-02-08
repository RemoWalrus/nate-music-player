import { useState } from "react";
import { ChevronLeft, User, Newspaper, Music, Share2, Mail } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { MusicPlatformLinks } from "./MusicPlatformLinks";
import { useToast } from "@/hooks/use-toast";

interface DesktopSidebarProps {
  artistBio: string;
}

export const DesktopSidebar = ({ artistBio }: DesktopSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const iconProps = { color: "#ea384c" };

  return (
    <Sidebar
      className={`hidden md:block transition-all duration-300 ease-in-out backdrop-blur-md bg-white/70 border-r border-white/20 ${
        isCollapsed ? "w-20" : "w-80"
      }`}
    >
      <div className="p-4 border-b border-gray-300/50">
        <div className="flex flex-col">
          <div className="flex justify-end">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft
                className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <div className={`${isCollapsed ? "mt-2" : "h-32"} w-full flex flex-col items-center justify-center gap-3`}>
            <img 
              src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
              alt="Nathan Garcia Logo" 
              className={isCollapsed ? "h-8 w-8" : "h-24 w-32"}
            />
            {!isCollapsed && (
              <span className="text-[#ED2024] font-medium text-lg">About Nathan Garcia</span>
            )}
          </div>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
          >
            Artist
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 text-gray-700">
                <User {...iconProps} className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="space-y-1">
                    <h3 className="font-medium">Nathan Garcia</h3>
                    <p className="text-sm text-gray-500">
                      {artistBio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="border-t border-gray-300/50" />

        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
          >
            Music
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Music {...iconProps} className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Listen on</h4>
                    <MusicPlatformLinks className="flex flex-col gap-2" />
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="border-t border-gray-300/50" />

        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
          >
            Latest News
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Newspaper {...iconProps} className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">New Single Release</h4>
                      <p className="text-sm text-gray-500">
                        Latest single "Thankful daddy" now available on all platforms.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="border-t border-gray-300/50" />

        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
          >
            Contact
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail {...iconProps} className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="space-y-2">
                    <a 
                      href="mailto:info@nathangarciamusic.com"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Email us!
                    </a>
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="border-t border-gray-300/50" />

        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
          >
            Share
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Share2 {...iconProps} className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="space-y-2">
                    <button 
                      onClick={handleShare}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Share with your friends
                    </button>
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
