
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45

## Nathan Garcia Music Website - Features Overview

The Nathan Garcia Music website is a dynamic platform showcasing Nathan's musical talent with the following features:

1. **Music Player**: An interactive player that streams Nathan's tracks with playback controls.
2. **Artist Sidebar**: Displays artist information, bio, and links to social platforms.
3. **Playlist View**: Lists all available tracks with easy selection.
4. **Dynamic Background**: Changes based on the currently playing track.
5. **Responsive Design**: Optimized for both desktop and mobile devices.
6. **SEO Optimization**: Includes sitemap.xml, robots.txt, and dynamic metadata.
7. **External Platform Links**: Integration with Spotify, YouTube Music, and Apple Music.

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

### Adding New Tracks

To add new tracks to the player:

1. Get the Spotify track ID from the track's Spotify URL (e.g., for https://open.spotify.com/track/123456, the ID is "123456")
2. Insert a new record in the `track_urls` table with:
   - `spotify_track_id`: The Spotify track ID
   - `youtube_music_url`: Link to the track on YouTube Music (optional)
   - `apple_music_url`: Link to the track on Apple Music (optional)
   - `mp3_url`: The filename of the MP3 in the storage bucket (optional)
   - `track_name`: Name of the track
   - `artist_name`: Artist name for the track

Example SQL:
```sql
INSERT INTO track_urls (
  spotify_track_id, 
  youtube_music_url, 
  apple_music_url,
  track_name,
  artist_name
)
VALUES (
  '123456',
  'https://music.youtube.com/watch?v=...',
  'https://music.apple.com/us/album/...',
  'Track Name',
  'Nathan Garcia'
);
```

### Adding MP3 Files

If you want to add MP3 files:

1. Make sure the file is in MP3 format
2. The file should be high quality (at least 192kbps)
3. File name should be clear and use only lowercase letters, numbers, and hyphens (e.g., "track-name.mp3")
4. Upload the file to the 'audio' storage bucket in Supabase
5. Update the track_urls record with the filename in the mp3_url column

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
