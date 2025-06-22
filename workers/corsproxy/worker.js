// This code is for a Cloudflare Worker.
// It acts as a CORS proxy, allowing requests only from specified origins.

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// List of allowed origins for CORS.
// You must include specific ports for localhost development.
const allowedOrigins = [
  'https://jrcpl.us',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

async function handleRequest(request) {
  const origin = request.headers.get('Origin');
  const isOriginAllowed = origin && allowedOrigins.includes(origin);

  // Handle CORS preflight requests (OPTIONS method)
  if (request.method === 'OPTIONS') {
    let optionsResponse = new Response(null, {
      status: 204, // No Content
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '*',
        'Access-Control-Max-Age': '86400', // Cache preflight response
      },
    });

    if (isOriginAllowed) {
      optionsResponse.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      // If origin is not allowed for OPTIONS, return 403 Forbidden
      return new Response('Origin not allowed', { status: 403 });
    }

    return optionsResponse;
  }

  // Handle actual requests (e.g., GET)
  const url = new URL(request.url).searchParams.get('url');

  // Reject requests if no URL or origin is not allowed
  if (!url || !isOriginAllowed) {
     return new Response(url ? 'Origin not allowed' : 'Error: Missing "url" query parameter', { status: url ? 403 : 400 });
  }

  try {
    // Fetch the target URL server-side
    const response = await fetch(url);

    // Clone and modify the response to add CORS headers
    const newResponse = new Response(response.body, response);

    // Set Access-Control-Allow-Origin to the requesting origin (which we know is allowed)
    if (origin) {
        newResponse.headers.set('Access-Control-Allow-Origin', origin);
    }

    return newResponse;

  } catch (error) {
    console.error('Error fetching target URL:', error);
    return new Response(`Error fetching target URL: ${error.message}`, { status: 500 });
  }
}
