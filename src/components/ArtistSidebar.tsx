
import { useState, useEffect } from "react";
import { ChevronLeft, User, Newspaper, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

export const ArtistSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [artistBio, setArtistBio] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchArtistBio = async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('bio')
        .eq('name', 'Nathan Garcia')
        .single();
      
      if (error) {
        console.error('Error fetching artist bio:', error);
        return;
      }

      if (data) {
        setArtistBio(data.bio || '');
      }
    };

    fetchArtistBio();
  }, []);

  const MobileHeader = () => (
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
          <Menu className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <User className="h-5 w-5 shrink-0" />
              <div className="space-y-1">
                <h3 className="font-medium">Nathan Garcia</h3>
                <p className="text-sm text-gray-500">{artistBio}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Newspaper className="h-5 w-5 shrink-0" />
              <div className="space-y-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">New Single Release</h4>
                  <p className="text-sm text-gray-500">
                    Latest single "Todo con todo" now available on all platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return <MobileHeader />;
  }

  return (
    <Sidebar
      className={`hidden md:block transition-all duration-300 ease-in-out backdrop-blur-md bg-white/70 border-r border-white/20 ${
        isCollapsed ? "w-20" : "w-80"
      }`}
    >
      <div className="p-4 border-b border-gray-100/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="h-16 w-full flex items-center justify-center">
              <img 
                src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
                alt="Nathan Garcia Logo" 
                className="h-12 w-12"
              />
            </div>
          )}
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
                <User className="h-5 w-5 shrink-0" />
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

        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
          >
            Latest News
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Newspaper className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">New Single Release</h4>
                      <p className="text-sm text-gray-500">
                        Latest single "Todo con todo" now available on all platforms.
                      </p>
                    </div>
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
