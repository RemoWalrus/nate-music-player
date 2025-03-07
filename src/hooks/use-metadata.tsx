
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteMetadata {
  id: string;
  title: string;
  description: string;
  keywords: string;
  author: string;
  og_image: string;
  created_at: string;
  updated_at: string;
}

export const useMetadata = () => {
  const [metadata, setMetadata] = useState<SiteMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the site metadata from Supabase
        const { data, error } = await supabase
          .from('site_metadata')
          .select('*')
          .single();
        
        if (error) {
          throw error;
        }
        
        setMetadata(data as SiteMetadata);
      } catch (err) {
        console.error('Error fetching site metadata:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { metadata, isLoading, error };
};
