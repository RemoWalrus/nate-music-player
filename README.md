
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45

## Nathan Garcia Music Website - Features Overview

The Nathan Garcia Music website is a dynamic platform showcasing Nathan's musical talent with the following features:

1. **Music Player**: An interactive player that streams Nathan's tracks with playback controls.
2. **Artist Sidebar**: Displays artist information, bio, and links to social platforms.
3. **Playlist View**: Lists all available tracks with easy selection.
4. **Dynamic Album Pages**: Automatically creates album pages based on albums stored in the database.
5. **Dynamic Background**: Changes based on the currently playing track's album artwork.
6. **Responsive Design**: Optimized for both desktop and mobile devices.
7. **SEO Optimization**: Includes sitemap.xml, robots.txt, and dynamic metadata.
8. **External Platform Links**: Integration with Spotify, YouTube Music, and Apple Music.
9. **Custom Artwork Support**: Tracks can use custom artwork stored in Supabase storage.

## Album System

The website now supports dynamic album pages that are automatically generated based on the `album` column in the database:

- **Homepage (/)**: Shows all tracks with individual track artwork
- **Album Pages (/albums/{album-name})**: Shows tracks filtered by album with shared album artwork
- **Automatic Album Detection**: Albums are created dynamically based on the `album` field in the track_urls table

### Album Page Features

- Displays only tracks from the specified album
- Shows track numbers when available
- Uses shared album artwork for consistent visual identity
- Sorts tracks by track number
- Shows total track count in the album header

## How to Update and Maintain the Site

### Site Metadata

The site's metadata (title, description, keywords, etc.) is stored in Supabase and can be updated:

1. Access the Supabase dashboard
2. Navigate to the Table Editor
3. Select the `site_metadata` table
4. Edit the record to update:
   - `title`: The page title shown in browser tabs
   - `description`: Meta description for search engines
   - `keywords`: SEO keywords for search engines
   - `author`: Content author name
   - `og_image`: Image shown when shared on social media

Example SQL to update metadata:
```sql
UPDATE site_metadata 
SET 
  title = 'New Title',
  description = 'New description text...',
  keywords = 'keyword1, keyword2, keyword3'
WHERE id = 'your-metadata-id';
```

### Adding New Albums

To create a new album:

1. Add tracks to the `track_urls` table with the same `album` value
2. Set the `album_cover` field to the shared album artwork filename
3. Set `track_number` for proper track ordering within the album
4. The album page will be automatically accessible at `/albums/{album-name}`

Example SQL to add tracks to a new album:
```sql
INSERT INTO track_urls (
  spotify_track_id, 
  track_name,
  artist_name,
  album,
  album_cover,
  track_number,
  youtube_music_url, 
  apple_music_url
)
VALUES 
  ('track1_id', 'Track 1 Name', 'Nathan Garcia', 'My New Album', 'my-new-album-cover.jpg', 1, 'https://music.youtube.com/...', 'https://music.apple.com/...'),
  ('track2_id', 'Track 2 Name', 'Nathan Garcia', 'My New Album', 'my-new-album-cover.jpg', 2, 'https://music.youtube.com/...', 'https://music.apple.com/...');
```

### Adding New Tracks

To add new tracks to the player:

1. Get the Spotify track ID from the track's Spotify URL (e.g., for https://open.spotify.com/track/123456, the ID is "123456")
2. Insert a new record in the `track_urls` table with:
   - `spotify_track_id`: The Spotify track ID
   - `track_name`: Name of the track
   - `artist_name`: Artist name for the track
   - `album`: Album name (creates dynamic album page)
   - `album_cover`: Shared album artwork filename (for album consistency)
   - `track_number`: Track position in the album (for proper ordering)
   - `artwork_url`: Individual track artwork (optional, for homepage display)
   - `youtube_music_url`: Link to the track on YouTube Music (optional)
   - `apple_music_url`: Link to the track on Apple Music (optional)
   - `amazon_music_url`: Link to the track on Amazon Music (optional)
   - `mp3_url`: The filename of the MP3 in the storage bucket (optional)

Example SQL:
```sql
INSERT INTO track_urls (
  spotify_track_id, 
  track_name,
  artist_name,
  album,
  album_cover,
  track_number,
  artwork_url,
  youtube_music_url, 
  apple_music_url,
  amazon_music_url,
  mp3_url
)
VALUES (
  '123456',
  'Track Name',
  'Nathan Garcia',
  'Album Name',
  'album-cover.jpg',
  1,
  'individual-track-artwork.jpg',
  'https://music.youtube.com/watch?v=...',
  'https://music.apple.com/us/album/...',
  'https://music.amazon.com/albums/...',
  'track-name.mp3'
);
```

### Album Artwork System

The website uses a dual artwork system:

1. **Album Cover (`album_cover`)**: Shared artwork used on album pages for visual consistency
2. **Individual Artwork (`artwork_url`)**: Unique artwork for each track, used on the homepage

**For Album Pages**: 
- All tracks in the same album should have the same `album_cover` value
- This creates a consistent visual identity for the album

**For Homepage**:
- Each track can have its own `artwork_url` for unique visual representation
- Falls back to `album_cover` if no individual artwork is provided

### Adding MP3 Files

If you want to add MP3 files for full-length playback:

1. Make sure the file is in MP3 format
2. The file should be high quality (at least 192kbps)
3. File name should be clear and use only lowercase letters, numbers, and hyphens (e.g., "track-name.mp3")
4. Upload the file to the 'audio' storage bucket in Supabase
5. Update the track_urls record with the filename in the mp3_url column

### Adding Custom Artwork

To add custom artwork for tracks or albums:

1. Prepare image file (JPG, PNG recommended)
2. Use clear filename with lowercase letters, numbers, and hyphens (e.g., "album-cover.jpg")
3. Upload the file to the 'artwork' storage bucket in Supabase
4. Update the track_urls record with the filename in the `artwork_url` or `album_cover` column
5. The system will automatically use the custom artwork and extract colors for the dynamic background

### Updating Artist Information

To update the artist sidebar content:

1. Access the Supabase dashboard
2. Navigate to the Table Editor
3. Select the `artists` table to update name and bio
4. Select the `sidebar_sections` table to update sidebar content sections

### Managing Platform Links

To add or update social/music platform links:

1. Access the Supabase dashboard
2. Navigate to the Table Editor
3. Select the `platform_links` table
4. Edit existing links or add new ones with:
   - `platform`: Platform name (e.g., "spotify", "youtube", "instagram")
   - `url`: Full URL to the profile/page
   - `icon`: Name of the Lucide icon to use
   - `order_index`: Position in the list (lower numbers appear first)
   - `is_active`: Toggle to enable/disable the link

### URL Structure

The website uses the following URL structure:

- `/`: Homepage showing all tracks
- `/albums/{album-name}`: Dynamic album pages (e.g., `/albums/chipotle`, `/albums/my-new-album`)
- `/albums`: Redirects to the first available album

Album URLs are automatically generated based on the `album` field in the database, converted to lowercase for URL compatibility.

### Sitemap and Search Engine Submission

The site includes:
- A sitemap at `https://nathangarciamusic.com/sitemap.xml`
- Robots.txt at `https://nathangarciamusic.com/robots.txt`

To submit to search engines:
1. Google Search Console: https://search.google.com/search-console
   - Add your property and verify ownership
   - Submit your sitemap URL

2. Bing Webmaster Tools: https://www.bing.com/webmasters
   - Add your site and verify ownership
   - Submit your sitemap URL

### Analytics

The site tracks two types of events in Google Analytics 4:

1. Track Plays: When users play a track
   - Event name: "track_play"
   - Properties: track_name, track_artist

2. External Clicks: When users click platform links
   - Event name: "external_link_click"
   - Properties: platform, track_name, track_artist

View these in GA4 under Reports > Engagement > Events

## Technical Implementation Details

### Dynamic Album System

The website automatically creates album pages based on the `album` field in the `track_urls` table:

1. **Album Detection**: The system scans all tracks and groups them by the `album` field
2. **URL Generation**: Album names are converted to URL-friendly format (lowercase, spaces to hyphens)
3. **Page Creation**: Each unique album gets its own page at `/albums/{album-name}`
4. **Track Filtering**: Album pages show only tracks matching the album name
5. **Track Ordering**: Tracks are sorted by the `track_number` field within each album

### Track System Architecture

The website uses a hybrid approach for track management:

1. **Spotify Integration**: Fetches basic track metadata from Spotify API
2. **Custom Database**: Stores additional URLs, custom artwork, and MP3 files in Supabase
3. **Smart Fallbacks**: Automatically handles missing track information with sensible defaults
4. **Dual Artwork System**: Supports both individual track artwork and shared album covers

### Storage Buckets

- `audio`: Stores MP3 files for full-length track playback
- `artwork`: Stores custom album artwork and individual track images

### Key Features

- **Dynamic Background Colors**: Extracted from album artwork using color.js library
- **Responsive Design**: Mobile-optimized with collapsible sidebar
- **Error Handling**: Graceful fallbacks for missing images and track information
- **SEO Optimization**: Dynamic metadata and proper structured data
- **Automatic Album Pages**: No code changes needed to add new albums

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (for data storage and file hosting)
- Google Analytics 4 (for usage tracking)
- color.js (for dynamic background color extraction)
- Lucide React (for icons)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
