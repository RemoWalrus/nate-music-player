
import React, { useState, useEffect } from "react";
import { User, Music, Newspaper, Share2, Mail, Disc, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarSection } from "./components/SidebarSection";
import { useShareButton } from "./components/ShareButton";
import { MusicPlatformLinks } from "./MusicPlatformLinks";
import { SidebarSection as SidebarSectionType } from "../types/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Album } from "@/hooks/use-album";

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
  Disk: Disc,
  Bot,
};

export const DesktopSidebar = ({ artistBio, sidebarSections }: DesktopSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const { handleShare } = useShareButton();

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching albums:', error);
      } else if (data) {
        setAlbums(data);
      }
    };

    fetchAlbums();
  }, []);

  const getSectionContent = (section: SidebarSectionType) => {
    switch (section.label) {
      case "Artist":
        return (
          <div className="space-y-1 text-left">
            <h3 className="font-medium text-xs">Nathan Garcia</h3>
            <p className="text-xs text-gray-500 whitespace-pre-line">{artistBio}</p>
          </div>
        );
      case "Music":
        return (
          <div className="space-y-1 text-left">
            <h4 className="text-xs font-medium">Listen on</h4>
            <MusicPlatformLinks className="flex flex-col gap-1" />
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
      case "Todita":
        return (
          <Link 
            to="/todita" 
            className="text-xs text-gray-500 hover:text-gray-700 text-left block"
          >
            {section.content || 'Todita Universe Character Generator'}
          </Link>
        );
      default:
        return (
          <div className="space-y-1 text-left">
            <p className="text-xs text-gray-500">{section.content}</p>
          </div>
        );
    }
  };

  const getAlbumsContent = () => {
    if (albums.length === 0) {
      return (
        <div className="space-y-1 text-left">
          <p className="text-xs text-gray-500">No albums available</p>
        </div>
      );
    }

    return (
      <div className="space-y-1 text-left">
        {albums.map((album) => (
          <Link
            key={album.id}
            to={`/albums/${album.name.toLowerCase()}`}
            className="block text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {album.name.charAt(0).toUpperCase() + album.name.slice(1)}
          </Link>
        ))}
      </div>
    );
  };

  // Insert Albums section before Contact section
  const sectionsWithAlbums = [...sidebarSections];
  const contactIndex = sectionsWithAlbums.findIndex(section => section.label === "Contact");
  
  if (contactIndex !== -1) {
    sectionsWithAlbums.splice(contactIndex, 0, {
      id: 'albums-section',
      label: albums.length === 1 ? 'Album' : 'Albums',
      icon: 'Disk',
      content: '',
      order_index: contactIndex,
      is_active: true,
      created_at: '',
      updated_at: ''
    });
  }

  return (
    <div className={`hidden md:block transition-all duration-300 ease-in-out backdrop-blur-md bg-white/70 border-r border-white/20 ${
      isCollapsed ? "w-20" : "w-96"
    }`}>
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="space-y-0.5 overflow-hidden">
        {sectionsWithAlbums.map((section, index) => (
          <React.Fragment key={section.id}>
            {index > 0 && <div className="border-t border-gray-300/50 w-full my-0.5" />}
            <SidebarSection 
              label={section.label} 
              icon={iconMap[section.icon]} 
              isCollapsed={isCollapsed}
            >
              {section.id === 'albums-section' ? getAlbumsContent() : getSectionContent(section)}
            </SidebarSection>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
