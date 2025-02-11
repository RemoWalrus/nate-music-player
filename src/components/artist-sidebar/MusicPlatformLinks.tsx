
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface PlatformLink {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  is_active: boolean;
}

interface MusicPlatformLinksProps {
  className?: string;
}

export const MusicPlatformLinks = ({ className }: MusicPlatformLinksProps) => {
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>([]);

  useEffect(() => {
    const fetchPlatformLinks = async () => {
      const { data, error } = await supabase
        .from('platform_links')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching platform links:', error);
        return;
      }

      setPlatformLinks(data);
    };

    fetchPlatformLinks();
  }, []);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {platformLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700"
        >
          {link.platform}
        </a>
      ))}
    </div>
  );
};
