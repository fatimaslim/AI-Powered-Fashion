import { NextResponse } from 'next/server';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DEMO_RESULTS_CLOTHING = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
];

const DEMO_RESULTS_HIJAB = [
  "https://images.unsplash.com/photo-1609430528048-8e6a9d0a3e17?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=800&auto=format&fit=crop",
];

async function processFalHijab(model_image: string, garment_image: string, fal_key: string) {
  const model_image_uri = model_image.startsWith("data:") ? model_image : `data:image/jpeg;base64,${model_image}`;
  const garment_image_uri = garment_image.startsWith("data:") ? garment_image : `data:image/jpeg;base64,${garment_image}`;
  
  const payload = {
    prompt: "A photorealistic portrait of this person wearing the specific hijab style and fabric from the reference image. High quality, detailed, natural lighting, seamless integration.",
    reference_images: [
      { image_url: model_image_uri, type: "identity", weight: 1.0 },
      { image_url: garment_image_uri, type: "style", weight: 0.8 }
    ],
    num_inference_steps: 28,
    guidance_scale: 3.5,
    width: 768,
    height: 1024
  };

  const submitRes = await fetch("https://queue.fal.run/fal-ai/flux-pulid", {
    method: "POST",
    headers: {
      "Authorization": `Key ${fal_key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!submitRes.ok) {
    const errorText = await submitRes.text();
    throw new Error(`Fal.ai submission failed: ${errorText}`);
  }

  const { request_id } = await submitRes.json();

  // Poll for status
  for (let i = 0; i < 60; i++) {
    const statusRes = await fetch(`https://queue.fal.run/fal-ai/flux-pulid/requests/${request_id}/status`, {
      headers: { "Authorization": `Key ${fal_key}` }
    });

    if (statusRes.ok) {
      const data = await statusRes.json();
      if (data.status === "COMPLETED") {
        const resultRes = await fetch(`https://queue.fal.run/fal-ai/flux-pulid/requests/${request_id}`, {
          headers: { "Authorization": `Key ${fal_key}` }
        });
        const resultData = await resultRes.json();
        if (resultData.images && resultData.images.length > 0) {
          return resultData.images[0].url;
        }
        break;
      } else if (data.status === "IN_QUEUE" || data.status === "IN_PROGRESS") {
        await delay(1000);
        continue;
      } else {
        throw new Error("Fal.ai processing failed");
      }
    }
    await delay(1000);
  }

  throw new Error("Fal.ai polling timeout");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task_type = body.task_type || "clothing";

    console.log(`[Next.js API] Processing ${task_type} tryon request...`);

    if (task_type === "hijab") {
      const falKey = process.env.FAL_KEY;
      if (falKey) {
        console.log("[Next.js API] FAL_KEY found. Proceeding with real Fal.ai generation.");
        const resultUrl = await processFalHijab(body.model_image, body.garment_image, falKey);
        return NextResponse.json({
          output: [resultUrl],
          isDemo: false,
          message: "Real Mode — Fal.ai successfully generated image."
        });
      } else {
        console.log("[Next.js API] FAL_KEY missing. Falling back to Demo Mode.");
        await delay(3000);
        const randomIndex = Math.floor(Math.random() * DEMO_RESULTS_HIJAB.length);
        return NextResponse.json({
          output: [DEMO_RESULTS_HIJAB[randomIndex]],
          isDemo: true,
          message: "Mock Mode — using pre-generated hijab examples."
        });
      }
    } else {
      // Clothing: Still in Mock Mode unless FASHN_API_KEY is provided.
      // (Mock logic only for now, per user plan)
      console.log("[Next.js API] Clothing task. Using Demo Mode.");
      await delay(3000);
      const randomIndex = Math.floor(Math.random() * DEMO_RESULTS_CLOTHING.length);
      return NextResponse.json({
        output: [DEMO_RESULTS_CLOTHING[randomIndex]],
        isDemo: true,
        message: "Mock Mode — using pre-generated clothing examples."
      });
    }

  } catch (error: Error | unknown) {
    console.error("[Next.js API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}