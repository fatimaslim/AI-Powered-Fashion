import { NextResponse } from 'next/server';

const DEMO_RESULTS_CLOTHING = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
];

const DEMO_RESULTS_HIJAB = [
  "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618580228723-5e9177a468d6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589304000350-0cb5b85a1114?q=80&w=800&auto=format&fit=crop",
];

async function startFashnJob(model_image: string, garment_image: string, fashn_key: string, options: any) {
  // Ensure images are properly formatted as data URIs or URLs
  const model_image_uri = model_image.startsWith("data:") || model_image.startsWith("http") ? model_image : `data:image/jpeg;base64,${model_image}`;
  const garment_image_uri = garment_image.startsWith("data:") || garment_image.startsWith("http") ? garment_image : `data:image/jpeg;base64,${garment_image}`;

  const payload = {
    model_name: "tryon-v1.6",
    inputs: {
      model_image: model_image_uri,
      garment_image: garment_image_uri,
      category: options.category || "tops",
      garment_photo_type: options.garment_photo_type || "auto",
      mode: options.mode || "balanced",
      seed: options.seed || 42,
      num_samples: options.num_samples || 1
    }
  };

  const submitRes = await fetch("https://api.fashn.ai/v1/run", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${fashn_key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!submitRes.ok) {
    const errorText = await submitRes.text();
    throw new Error(`FASHN API submission failed: ${errorText}`);
  }

  const { id } = await submitRes.json();
  return id;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task_type = body.task_type || "clothing";
    const fashnKey = process.env.FASHN_API_KEY || body.api_key;

    console.log(`[Next.js API] Processing ${task_type} tryon request...`);

    if (fashnKey) {
      console.log("[Next.js API] FASHN_API_KEY found. Starting real FASHN generation.");
      const jobId = await startFashnJob(body.model_image, body.garment_image, fashnKey, body);
      return NextResponse.json({
        id: jobId,
        isDemo: false,
        message: `Real Mode — FASHN generation started.`
      });
    } else {
      console.log("[Next.js API] FASHN_API_KEY missing. Falling back to Demo Mode.");
      let result = "";
      if (task_type === "hijab") {
        const randomIndex = Math.floor(Math.random() * DEMO_RESULTS_HIJAB.length);
        result = DEMO_RESULTS_HIJAB[randomIndex];
      } else {
        const randomIndex = Math.floor(Math.random() * DEMO_RESULTS_CLOTHING.length);
        result = DEMO_RESULTS_CLOTHING[randomIndex];
      }

      return NextResponse.json({
        output: [result],
        isDemo: true,
        message: `Demo Mode — using pre-generated ${task_type} examples.`
      });
    }

  } catch (error: Error | unknown) {
    console.error("[Next.js API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}