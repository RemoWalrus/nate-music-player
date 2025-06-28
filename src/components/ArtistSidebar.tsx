
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MobileHeader } from "./artist-sidebar/MobileHeader";
import { DesktopSidebar } from "./artist-sidebar/DesktopSidebar";
import { AlbumMobileHeader } from "./artist-sidebar/AlbumMobileHeader";
import { AlbumDesktopSidebar } from "./artist-sidebar/AlbumDesktopSidebar";
import { useAlbum } from "@/hooks/use-album";
import { SidebarSection } from "./types/sidebar";

export const ArtistSidebar = () => {
  const [artistBio, setArtistBio] = useState("");
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([]);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Check if we're on an album page
  const isAlbumPage = location.pathname.startsWith('/albums/');
  const albumName = isAlbumPage ? location.pathname.split('/albums/')[1] : null;
  
  // Get album data if on album page
  const { album, isLoading: albumLoading } = useAlbum(albumName || '');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch artist bio
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('bio')
        .eq('name', 'Nathan Garcia')
        .single();
      
      if (artistError) {
        console.error('Error fetching artist bio:', artistError);
      } else if (artistData) {
        setArtistBio(artistData.bio || '');
      }

      // Fetch sidebar sections (only for artist pages, not album pages)
      if (!isAlbumPage) {
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sidebar_sections')
          .select('*')
          .eq('is_active', true)
          .order('order_index');

        if (sectionsError) {
          console.error('Error fetching sidebar sections:', sectionsError);
        } else if (sectionsData) {
          // Filter out "Latest News" section
          const filteredSections = sectionsData.filter(section => 
            section.label.toLowerCase() !== 'latest news'
          );
          setSidebarSections(filteredSections);
        }
      }
    };

    fetchData();
  }, [isAlbumPage]);

  // Show album sidebar if on album page and album data is loaded
  if (isAlbumPage && album && !albumLoading) {
    if (isMobile) {
      return <AlbumMobileHeader album={album} />;
    }
    return <AlbumDesktopSidebar album={album} />;
  }

  // Show loading state for album pages
  if (isAlbumPage && albumLoading) {
    return (
      <div className={isMobile ? "md:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-sm h-16" : "hidden md:block w-96 backdrop-blur-md bg-white/70 border-r border-white/20"}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Show default artist sidebar for homepage and other pages
  if (isMobile) {
    return <MobileHeader artistBio={artistBio} sidebarSections={sidebarSections} />;
  }

  return <DesktopSidebar artistBio={artistBio} sidebarSections={sidebarSections} />;
};
