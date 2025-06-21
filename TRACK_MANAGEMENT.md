
# Track Management Guide

## Overview

The Nathan Garcia Music website uses a combination of Spotify API data and custom Supabase storage to manage tracks. This guide explains how to add, update, and manage tracks on the website.

## How the Track System Works

The website pulls track information from two sources:
1. **Spotify API**: Provides basic track metadata (name, artist, album art, preview URLs)
2. **Supabase `track_urls` table**: Contains custom URLs and additional metadata for each track

### Key Quirks and Important Notes

1. **Track ID Matching**: The system matches tracks using the `spotify_track_id` field in the `track_urls` table
2. **Mixed Sources**: Tracks can come from Spotify API OR be completely custom entries in the database
3. **Platform Links**: All platform links (YouTube, Apple Music, etc.) are managed in Supabase, not hardcoded
4. **Audio Sources**: The player will use MP3 files from Supabase storage if available, otherwise falls back to Spotify preview URLs

## Adding New Tracks

### Step 1: Get the Spotify Track ID

From a Spotify URL like `https://open.spotify.com/track/63FelHybOjUu67EkUWaFAN`, the track ID is the part after `/track/`: `63FelHybOjUu67EkUWaFAN`

### Step 2: Add Track to Database

Add a new record to the `track_urls` table in Supabase:

```sql
INSERT INTO track_urls (
  spotify_track_id,
  track_name,
  artist_name,
  youtube_music_url,
  apple_music_url,
  amazon_music_url,
  mp3_url,
  artwork_url,
  permalink
) VALUES (
  '63FelHybOjUu67EkUWaFAN',  -- Spotify track ID
  'Track Name',               -- Optional: will use Spotify data if null
  'Nathan Garcia',            -- Optional: will use Spotify data if null
  'https://music.youtube.com/watch?v=...', -- Optional
  'https://music.apple.com/us/album/...', -- Optional
  'https://music.amazon.com/albums/...', -- Optional
  'track-filename.mp3',       -- Optional: filename in Supabase storage
  'https://example.com/artwork.jpg', -- Optional: custom artwork
  'custom-permalink'          -- Optional: custom permalink
);
```

### Step 3: Upload MP3 File (Optional)

If you want to provide full-length audio instead of Spotify's 30-second preview:

1. Upload the MP3 file to the `audio` bucket in Supabase Storage
2. Use a clear filename with lowercase letters, numbers, and hyphens (e.g., `track-name.mp3`)
3. Update the `mp3_url` field in the database with the filename

## Updating Existing Tracks

### Update Platform Links

```sql
UPDATE track_urls 
SET 
  youtube_music_url = 'https://music.youtube.com/watch?v=...',
  apple_music_url = 'https://music.apple.com/us/album/...',
  amazon_music_url = 'https://music.amazon.com/albums/...'
WHERE spotify_track_id = '63FelHybOjUu67EkUWaFAN';
```

### Update Track Metadata

```sql
UPDATE track_urls 
SET 
  track_name = 'New Track Name',
  artist_name = 'Nathan Garcia',
  artwork_url = 'https://example.com/new-artwork.jpg'
WHERE spotify_track_id = '63FelHybOjUu67EkUWaFAN';
```

### Add MP3 File to Existing Track

```sql
UPDATE track_urls 
SET mp3_url = 'new-track-file.mp3'
WHERE spotify_track_id = '63FelHybOjUu67EkUWaFAN';
```

## Creating Custom Tracks (Not on Spotify)

For tracks that aren't available on Spotify, you can create custom entries:

```sql
INSERT INTO track_urls (
  spotify_track_id,    -- Use a unique custom ID
  track_name,          -- Required for custom tracks
  artist_name,         -- Required for custom tracks
  artwork_url,         -- Required for custom tracks
  mp3_url,            -- Required for audio playback
  youtube_music_url,
  apple_music_url,
  amazon_music_url,
  permalink
) VALUES (
  'custom_track_2024', -- Custom unique ID
  'Custom Track Name',
  'Nathan Garcia',
  'https://example.com/custom-artwork.jpg',
  'custom-track.mp3',
  'https://music.youtube.com/watch?v=...',
  'https://music.apple.com/us/album/...',
  'https://music.amazon.com/albums/...',
  'custom-track-permalink'
);
```

## System Quirks and Technical Details

### Audio Playback Priority

The music player uses this priority order for audio sources:
1. **MP3 files** from Supabase storage (full tracks)
2. **Spotify preview URLs** (30-second previews)

### Track Display Logic

- If a track exists in both Spotify API and `track_urls` table → Uses Spotify metadata with custom URLs
- If a track exists only in `track_urls` table → Uses custom metadata entirely
- If a track exists only in Spotify API → Won't appear (must have entry in `track_urls`)

### File Encryption

MP3 files in storage are encrypted for security. The system automatically handles encryption/decryption, but filenames in the database should be the original, unencrypted names.

### Platform Links

Platform links are pulled from the `track_urls` table for each specific track. General platform links (like artist social media) are managed separately in the `platform_links` table.

## Troubleshooting

### Track Not Appearing

- Ensure there's an entry in `track_urls` table with the correct `spotify_track_id`
- Check that the Spotify track ID is correct (compare with Spotify URL)

### Audio Not Playing

- Check if `mp3_url` field points to a valid file in Supabase storage
- Verify file was uploaded to the `audio` bucket
- Check browser console for audio loading errors

### Platform Links Not Working

- Verify URLs are complete and properly formatted
- Test URLs manually in browser
- Check for typos in column names when updating

## Database Schema Reference

### `track_urls` table columns:

- `id` (UUID, auto-generated)
- `spotify_track_id` (text, required) - Spotify track ID or custom unique ID
- `track_name` (text, optional) - Custom track name override
- `artist_name` (text, optional) - Custom artist name override
- `artwork_url` (text, optional) - Custom artwork URL override
- `mp3_url` (text, optional) - Filename of MP3 in Supabase storage
- `youtube_music_url` (text, optional) - YouTube Music link
- `apple_music_url` (text, optional) - Apple Music link
- `amazon_music_url` (text, optional) - Amazon Music link
- `permalink` (text, optional) - Custom permalink for track
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Quick Reference Commands

### View all tracks
```sql
SELECT * FROM track_urls ORDER BY created_at DESC;
```

### Find specific track
```sql
SELECT * FROM track_urls WHERE track_name ILIKE '%track name%';
```

### Remove track
```sql
DELETE FROM track_urls WHERE spotify_track_id = 'track_id_here';
```

### Update multiple platform links at once
```sql
UPDATE track_urls 
SET 
  youtube_music_url = 'https://music.youtube.com/watch?v=...',
  apple_music_url = 'https://music.apple.com/us/album/...',
  amazon_music_url = 'https://music.amazon.com/albums/...'
WHERE spotify_track_id = 'track_id_here';
```
