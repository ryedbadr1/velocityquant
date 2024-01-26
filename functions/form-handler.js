// Import Cloudflare Workers KV
import { KVNamespace } from 'storage';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST' && request.url.endsWith('/submit-form')) {
    const formData = await request.json();

    // Handle saving the form data to Cloudflare Workers KV
    await saveFormData(formData);

    return new Response('Form data saved successfully!', { status: 200 });
  }

  return new Response('Invalid request', { status: 400 });
}

async function saveFormData(formData) {
  const kvNamespace = 'userdata'; // Replace with your actual KV namespace

  // Initialize Cloudflare Workers KV
  const kv = await KVNamespace.create(kvNamespace);

  // Generate a unique key for each form submission
  const uniqueKey = `${formData.firstName}_${formData.lastName}_${Date.now()}`;

  // Store the form data in Cloudflare Workers KV
  await kv.put(uniqueKey, JSON.stringify(formData));
}
