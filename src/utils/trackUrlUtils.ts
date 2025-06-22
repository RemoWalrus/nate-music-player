
import { supabase } from "@/integrations/supabase/client";
import { encryptFileName } from "./fileEncryption";
import type { TrackUrls } from "../types/music";

export const fetchTrackUrls = async (): Promise<Record<string, TrackUrls> | null> => {
  try {
    console.log('Fetching all track URLs from Supabase');
    
    const { data: urlsData, error: urlsError } = await supabase
      .from('track_urls')
      .select('*');

    if (urlsError) {
      console.error('Error fetching track URLs:', urlsError);
      return null;
    }

    console.log('Received track URLs data:', urlsData);

    const urlsMap: Record<string, TrackUrls> = {};
    
    for (const track of urlsData || []) {
      let mp3Url = null;
      if (track.mp3_url) {
        const { data: publicUrl } = supabase.storage
          .from('audio')
          .getPublicUrl(track.mp3_url);
        
        if (publicUrl) {
          const url = new URL(publicUrl.publicUrl);
          const pathParts = url.pathname.split('/');
          const fileName = pathParts[pathParts.length - 1];
          const encryptedFileName = encryptFileName(fileName);
          pathParts[pathParts.length - 1] = encryptedFileName;
          url.pathname = pathParts.join('/');
          mp3Url = url.toString();
          console.log('Generated encrypted URL for', track.spotify_track_id, ':', mp3Url);
        }
      }

      // Store the original artwork_url filename, don't convert to public URL here
      // The public URL conversion will be done in trackCombiner.ts when needed
      urlsMap[track.spotify_track_id] = {
        ...track,
        mp3_url: mp3Url,
        artwork_url: track.artwork_url // Keep original filename
      };
    }

    console.log('Final track URLs map:', urlsMap);
    return urlsMap;
  } catch (error) {
    console.error('Error in fetchTrackUrls:', error);
    return null;
  }
};
