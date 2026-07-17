import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    const fashnKey = process.env.FASHN_API_KEY;
    if (!fashnKey) {
      return NextResponse.json({ error: "FASHN API key is not configured" }, { status: 500 });
    }

    const statusRes = await fetch(`https://api.fashn.ai/v1/status/${id}`, {
      headers: { "Authorization": `Bearer ${fashnKey}` },
      cache: 'no-store'
    });

    if (!statusRes.ok) {
      const errorText = await statusRes.text();
      return NextResponse.json({ error: `FASHN API status check failed: ${errorText}` }, { status: statusRes.status });
    }

    const data = await statusRes.json();
    return NextResponse.json(data);

  } catch (error: Error | unknown) {
    console.error("[Next.js Status API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
