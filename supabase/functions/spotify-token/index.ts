import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ARTIST_ID = '1cK40hLuV86SgatMzjMeTA'; // Nathan Garcia's Spotify ID

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      console.error('Spotify credentials not configured')
      return new Response(
        JSON.stringify({ error: 'Spotify credentials not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get access token from Spotify
    console.log('Requesting Spotify access token...')
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Spotify token request failed:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to get Spotify access token' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Parse request body to check if we need to fetch tracks
    let body = {}
    try {
      body = await req.json()
    } catch {
      // Empty body is fine
    }

    const { action } = body as { action?: string }

    if (action === 'get-top-tracks') {
      // Fetch artist's top tracks using the access token
      console.log('Fetching artist top tracks...')
      const tracksResponse = await fetch(
        `https://api.spotify.com/v1/artists/${ARTIST_ID}/top-tracks?market=US`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (!tracksResponse.ok) {
        console.error('Failed to fetch tracks:', tracksResponse.status)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch tracks from Spotify' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const tracksData = await tracksResponse.json()
      console.log(`Successfully fetched ${tracksData.tracks?.length || 0} tracks`)
      
      return new Response(
        JSON.stringify({ tracks: tracksData.tracks }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Default: just return the access token (for backward compatibility if needed)
    return new Response(
      JSON.stringify({ access_token: accessToken }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in spotify-token function:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
