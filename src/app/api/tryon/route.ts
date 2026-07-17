import { NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000/api/v1";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Add default task_type if not present
    if (!body.task_type) {
      body.task_type = "clothing";
    }

    console.log(`[Next.js API] Proxying ${body.task_type} tryon request to FastAPI...`);

    const response = await fetch(`${FASTAPI_URL}/tryon/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Next.js API] FastAPI error:", data);
      return NextResponse.json(
        { error: data.detail || "FastAPI routing error" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error: Error | unknown) {
    console.error("[Next.js API] Error proxying to FastAPI:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred connecting to the backend.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}