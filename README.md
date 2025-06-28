
# Nathan Garcia Music Website

A modern, responsive music website for Nathan Garcia featuring an interactive music player, album browsing, and dynamic background colors based on album artwork.

## Features

- **Interactive Music Player**: Play tracks with preview URLs or full MP3 files
- **Album Pages**: Dedicated pages for each album with track listings
- **Dynamic Backgrounds**: Page colors adapt to album artwork
- **Responsive Design**: Works on desktop and mobile devices
- **Artist Information**: Sidebar with bio and social links
- **SEO Optimized**: Dynamic metadata and Open Graph tags

## Database Structure

### Core Tables

#### `albums`
Stores album information and artwork:
- `id` (UUID, Primary Key)
- `name` (Text, Not Null) - Album name
- `description` (Text, Nullable) - Album description
- `album_cover` (Text, Nullable) - Filename or URL for album artwork
- `spotify_url` (Text, Nullable) - Spotify album URL
- `youtube_music_url` (Text, Nullable) - YouTube Music album URL
- `apple_music_url` (Text, Nullable) - Apple Music album URL
- `amazon_music_url` (Text, Nullable) - Amazon Music album URL
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `track_urls`
Stores track metadata and platform links:
- `id` (UUID, Primary Key)
- `spotify_track_id` (Text, Not Null) - Spotify track identifier
- `track_name` (Text, Nullable) - Custom track name
- `artist_name` (Text, Nullable) - Artist name
- `album` (Text, Nullable) - Album name for categorization
- `track_number` (Integer, Nullable) - Track position in album
- `artwork_url` (Text, Nullable) - Individual track artwork filename
- `mp3_url` (Text, Nullable) - MP3 file path in storage
- `youtube_music_url` (Text, Nullable) - YouTube Music track URL
- `apple_music_url` (Text, Nullable) - Apple Music track URL
- `amazon_music_url` (Text, Nullable) - Amazon Music track URL
- `permalink` (Text, Nullable) - Custom permalink for sharing
- `single` (Text, Nullable) - Single release information
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `artists`
Stores artist information:
- `id` (UUID, Primary Key)
- `name` (Text, Not Null) - Artist name
- `bio` (Text, Nullable) - Artist biography
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `sidebar_sections`
Configurable sidebar content:
- `id` (UUID, Primary Key)
- `label` (Text, Not Null) - Section title
- `icon` (Text, Not Null) - Lucide icon name
- `content` (Text, Nullable) - Section content
- `order_index` (Integer, Not Null) - Display order
- `is_active` (Boolean, Default: true) - Show/hide section
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `platform_links`
Social media and music platform links:
- `id` (UUID, Primary Key)
- `platform` (Text, Not Null) - Platform name
- `url` (Text, Not Null) - Platform URL
- `icon` (Text, Nullable) - Lucide icon name
- `order_index` (Integer, Not Null) - Display order
- `is_active` (Boolean, Default: true) - Show/hide link
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `site_metadata`
SEO and site configuration:
- `id` (UUID, Primary Key)
- `title` (Text, Not Null) - Site title
- `description` (Text, Not Null) - Meta description
- `keywords` (Text, Not Null) - SEO keywords
- `author` (Text, Not Null) - Content author
- `og_image` (Text, Not Null) - Open Graph image URL
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Content Management

### Adding New Albums

1. **Create Album Record**:
   ```sql
   INSERT INTO albums (name, description, album_cover, spotify_url, youtube_music_url, apple_music_url)
   VALUES ('Album Name', 'Album description', 'album-cover.jpg', 'spotify_url', 'youtube_url', 'apple_music_url');
   ```

2. **Upload Album Artwork**: 
   - Upload image to Supabase Storage `artwork` bucket
   - Use filename in `album_cover` column

### Adding New Tracks

1. **Get Spotify Track ID** from track URL
2. **Insert Track Record**:
   ```sql
   INSERT INTO track_urls (
     spotify_track_id, 
     track_name, 
     artist_name,
     album,
     track_number,
     youtube_music_url, 
     apple_music_url,
     amazon_music_url
   )
   VALUES (
     'spotify_track_id',
     'Track Name',
     'Nathan Garcia',
     'album_name',
     1,
     'youtube_url',
     'apple_music_url',
     'amazon_music_url'
   );
   ```

3. **Upload MP3 (Optional)**:
   - Upload to `audio` bucket in Supabase Storage
   - Add filename to `mp3_url` column

### Album vs Individual Artwork

- **Album Cover**: Stored in `albums.album_cover` - used for all tracks in the album on album pages
- **Individual Artwork**: Stored in `track_urls.artwork_url` - used for specific tracks on the main page

The system prioritizes album covers on album pages for consistency, and falls back to individual artwork when needed.

### Managing Platform Links

Update music platform links in the `platform_links` table:
```sql
UPDATE platform_links 
SET url = 'new_url' 
WHERE platform = 'spotify';
```

### Updating Site Metadata

Modify SEO settings in the `site_metadata` table:
```sql
UPDATE site_metadata 
SET 
  title = 'New Site Title',
  description = 'New description',
  keywords = 'keyword1, keyword2, keyword3'
WHERE id = 'metadata_id';
```

## Album Navigation

Album pages feature isolated navigation - the music player's next/previous buttons cycle through only the tracks in the current album, providing a focused listening experience for each album.

## Development

### Key Components

- **MusicPlayer**: Main audio player with controls and progress bar
- **Playlist**: Track listing with play buttons and external links
- **ArtistSidebar**: Artist info and navigation (desktop/mobile variants)
- **AlbumPage**: Dynamic album pages with filtered track lists

### Hooks

- **useTracks**: Manages track loading and playback state
- **useAlbum**: Fetches album-specific data
- **use-mobile**: Responsive design helper

### Storage

Files are stored in Supabase Storage buckets:
- `artwork`: Album covers and track artwork
- `audio`: MP3 files for full-length playback

## Analytics

The site tracks user interactions:
- **Track Plays**: When users play a track
- **External Link Clicks**: When users click platform links

Events are sent to Google Analytics 4 for monitoring engagement.
