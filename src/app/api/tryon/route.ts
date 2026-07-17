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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task_type = body.task_type || "clothing";

    console.log(`[Next.js Mock API] Processing ${task_type} tryon request in 100% Demo Mode...`);

    // Simulate AI processing latency
    await delay(3000);

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

  } catch (error: Error | unknown) {
    console.error("[Next.js Mock API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}