
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { type SiteMetadata } from '@/hooks/use-metadata';

export const MetadataEditor = () => {
  const [metadata, setMetadata] = useState<SiteMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the site metadata from Supabase
        const { data, error } = await supabase
          .from('site_metadata')
          .select('*')
          .single();
        
        if (error) throw error;
        
        setMetadata(data as SiteMetadata);
      } catch (err) {
        console.error('Error fetching site metadata:', err);
        toast({
          title: 'Error',
          description: 'Failed to load metadata. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!metadata) return;
    
    const { name, value } = e.target;
    setMetadata({
      ...metadata,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!metadata) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('site_metadata')
        .update({
          title: metadata.title,
          description: metadata.description,
          keywords: metadata.keywords,
          author: metadata.author,
          og_image: metadata.og_image,
        })
        .eq('id', metadata.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Metadata has been updated successfully.',
      });
    } catch (err) {
      console.error('Error updating metadata:', err);
      toast({
        title: 'Error',
        description: 'Failed to update metadata. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading metadata...</div>;
  }

  if (!metadata) {
    return <div className="p-4">No metadata found.</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Site Metadata</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Page Title
            </label>
            <Input
              id="title"
              name="title"
              value={metadata.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Meta Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={metadata.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium mb-1">
              Meta Keywords
            </label>
            <Textarea
              id="keywords"
              name="keywords"
              value={metadata.keywords}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              Author
            </label>
            <Input
              id="author"
              name="author"
              value={metadata.author}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="og_image" className="block text-sm font-medium mb-1">
              Open Graph Image URL
            </label>
            <Input
              id="og_image"
              name="og_image"
              value={metadata.og_image}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
