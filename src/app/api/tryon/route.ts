import { NextResponse } from 'next/server';
import Fashn from 'fashn';

const FASHN_ENDPOINT_URL = process.env.FASHN_ENDPOINT_URL || "https://api.fashn.ai";
const FASHN_API_KEY = process.env.FASHN_API_KEY;

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Pre-generated demo results — shown when no API key is configured
const DEMO_RESULTS = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      model_image, // base64 string
      garment_image, // base64 string
      garment_photo_type,
      category,
      mode,
      segmentation_free,
      seed,
      num_samples,
      api_key, // User-provided API key
      model_name, // Model version selection (v1.5, tryon-v1.6, tryon-staging)
    } = body;

    // Use environment API key if available, otherwise use user-provided key
    const apiKey = FASHN_API_KEY || api_key;

    if (!apiKey) {
      // DEMO MODE: Return pre-generated results so recruiters can explore
      console.log("[Demo Mode] No API key — returning demo results");
      await delay(3000); // Simulate realistic API latency
      const randomIndex = Math.floor(Math.random() * DEMO_RESULTS.length);
      return NextResponse.json({ 
        output: [DEMO_RESULTS[randomIndex]],
        isDemo: true,
        message: "Demo Mode — Using pre-generated examples. Add your FASHN API key for real try-on results."
      });
    }

    // Validate inputs
    if (!model_image || !garment_image) {
      return NextResponse.json({ error: "Missing model or garment image" }, { status: 400 });
    }

    // Strip data URL prefix (e.g. "data:image/jpeg;base64,") — FASHN expects raw base64
    const stripBase64Prefix = (b64: string): string => {
      if (b64.includes(',')) {
        return b64.split(',')[1];
      }
      return b64;
    };

    const cleanModelImage = stripBase64Prefix(model_image);
    const cleanGarmentImage = stripBase64Prefix(garment_image);

    const inputs = {
      model_image: cleanModelImage,
      garment_image: cleanGarmentImage,
      garment_photo_type: garment_photo_type.toLowerCase(),
      category,
      mode: mode.toLowerCase(),
      segmentation_free,
      seed: parseInt(seed, 10),
      num_samples: parseInt(num_samples, 10),
    };

    const apiPayload = {
      model_name: model_name,
      inputs: inputs
    }

    const baseURL = FASHN_ENDPOINT_URL;
    const client = new Fashn({ apiKey, baseURL });

    console.log(`Sending request to FASHN API: ${baseURL}/run`);
    const runResponse = await client.predictions.run(apiPayload);
    const predId = runResponse.id;
    console.log(`Prediction ID: ${predId}`);
    if (!predId) {
      return NextResponse.json({ error: "Failed to get prediction ID from FASHN API" }, { status: 500 });
    }

    // Poll status
    const maxPollingTime = 180 * 1000; // 3 minutes in milliseconds
    const pollingInterval = 2 * 1000; // 2 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxPollingTime) {
      console.log(`Polling status for ID: ${predId}`);
      const statusData = await client.predictions.status(predId);

      console.log(`Prediction status: ${statusData.status}`);

      if (statusData.status === "completed") {
        console.log("Prediction completed.");
        return NextResponse.json({ output: statusData.output });
      } else if (statusData.status === "failed") {
        console.error(`Prediction failed with id ${predId}: ${JSON.stringify(statusData.error)}`);
        return NextResponse.json({ error: `Prediction failed: ${statusData.error?.message || 'Unknown reason'}` }, { status: 500 });
      }

      await delay(pollingInterval);
    }

    return NextResponse.json({ error: "Maximum polling time exceeded." }, { status: 504 }); // Gateway Timeout

  } catch (error: Error | unknown) {
    if (error instanceof Fashn.APIError) {
      console.error("FASHN API /run error:", error);
      
      // Check for authentication errors
      if (error.status === 401 || error.status === 403) {
        return NextResponse.json({ 
          error: "Invalid API key. Please check your FASHN API key and try again.",
          requiresApiKey: true 
        }, { status: 401 });
      }

      if (error.status === 429) {
        return NextResponse.json({ 
          error: "Rate limit exceeded. Please try again later.",
        }, { status: 429 });
      }
      
      return NextResponse.json({ error: `API run failed: ${error.cause}` }, { status: error.status });
    } else {
      console.error("Error in /api/tryon:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }
}