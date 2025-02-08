
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const BACKGROUND_COLORS = [
  '#F2FCE2',  // Soft Green
  '#FEF7CD',  // Soft Yellow
  '#FEC6A1',  // Soft Orange
  '#E5DEFF',  // Soft Purple
  '#FFDEE2',  // Soft Pink
  '#FDE1D3',  // Soft Peach
  '#D3E4FD',  // Soft Blue
  '#F1F0FB',  // Soft Gray
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Pick a random background color
    const backgroundColor = BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)];

    // Create an HTML template with the logo and background color
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nathan Garcia Music</title>
          <meta property="og:image" content="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg">
          <meta property="og:title" content="Nathan Garcia Music">
          <meta property="og:description" content="Check out Nathan Garcia's music!">
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 1200px;
              height: 630px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: ${backgroundColor};
            }
            img {
              width: 400px;
              height: auto;
            }
          </style>
        </head>
        <body>
          <img src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" alt="Nathan Garcia Logo">
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
