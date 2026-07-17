import { NextResponse } from 'next/server';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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