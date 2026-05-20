import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

/**
 * GET /api/ping
 * Health check — verifies Supabase DB connectivity.
 * Returns: { ok: true, ts: ISO timestamp } or { ok: false, error: string }
 */
export async function GET() {
  try {
    const { error } = await supabase.from('schools').select('count').limit(1);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      ts: new Date().toISOString(),
      env: process.env.NODE_ENV,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
