
import { useEffect } from 'react';
import { useMetadata } from '@/hooks/use-metadata';

export const MetadataHead = () => {
  const { metadata, isLoading, error } = useMetadata();

  useEffect(() => {
    if (!metadata || isLoading) return;
    
    // Update document title
    document.title = metadata.title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };
    
    const updateOpenGraphTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    };
    
    updateMetaTag('description', metadata.description);
    updateMetaTag('keywords', metadata.keywords);
    updateMetaTag('author', metadata.author);
    updateOpenGraphTag('og:title', metadata.title);
    updateOpenGraphTag('og:description', metadata.description);
    updateOpenGraphTag('og:image', metadata.og_image);
    
    console.log('Metadata updated:', metadata);
  }, [metadata, isLoading]);

  if (error) {
    console.error('Error loading metadata:', error);
  }

  // This component doesn't render anything visually
  return null;
};
