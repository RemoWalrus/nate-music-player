
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { MobileHeader } from "./artist-sidebar/MobileHeader";
import { DesktopSidebar } from "./artist-sidebar/DesktopSidebar";

export const ArtistSidebar = () => {
  const [artistBio, setArtistBio] = useState("");
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

  if (isMobile) {
    return <MobileHeader artistBio={artistBio} />;
  }

  return <DesktopSidebar artistBio={artistBio} />;
};
