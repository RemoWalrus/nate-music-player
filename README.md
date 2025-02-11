
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45

## How to Update and Maintain the Site

### Adding New Tracks

To add new tracks to the player:

1. Get the Spotify track ID from the track's Spotify URL (e.g., for https://open.spotify.com/track/123456, the ID is "123456")
2. Insert a new record in the `track_urls` table with:
   - `spotify_track_id`: The Spotify track ID
   - `youtube_music_url`: Link to the track on YouTube Music (optional)
   - `apple_music_url`: Link to the track on Apple Music (optional)
   - `mp3_url`: The filename of the MP3 in the storage bucket (optional)

Example SQL:
```sql
INSERT INTO track_urls (spotify_track_id, youtube_music_url, apple_music_url)
VALUES (
  '123456',
  'https://music.youtube.com/watch?v=...',
  'https://music.apple.com/us/album/...'
);
```

### Adding MP3 Files

If you want to add MP3 files:

1. Make sure the file is in MP3 format
2. The file should be high quality (at least 192kbps)
3. File name should be clear and use only lowercase letters, numbers, and hyphens (e.g., "track-name.mp3")
4. Upload the file to the 'audio' storage bucket in Supabase
5. Update the track_urls record with the filename in the mp3_url column

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
