
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { MobileHeader } from "./artist-sidebar/MobileHeader";
import { DesktopSidebar } from "./artist-sidebar/DesktopSidebar";
import { SidebarSection } from "./types/sidebar";

export const ArtistSidebar = () => {
  const [artistBio, setArtistBio] = useState("");
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([]);
  const isMobile = useIsMobile();

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

      // Fetch sidebar sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sidebar_sections')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (sectionsError) {
        console.error('Error fetching sidebar sections:', sectionsError);
      } else if (sectionsData) {
        setSidebarSections(sectionsData);
      }
    };

    fetchData();
  }, []);

  if (isMobile) {
    return <MobileHeader artistBio={artistBio} sidebarSections={sidebarSections} />;
  }

  return <DesktopSidebar artistBio={artistBio} sidebarSections={sidebarSections} />;
};
