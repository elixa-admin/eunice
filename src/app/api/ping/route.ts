import { NextResponse } from 'next/server';
import supabase, { getSupabaseIntegrationStatus } from '@/lib/supabase';

/**
 * GET /api/ping
 * Health check — verifies Supabase DB connectivity.
 * Returns: { ok: true, ts: ISO timestamp } or { ok: false, error: string }
 */
export async function GET() {
  const integrationStatus = getSupabaseIntegrationStatus();
  if (!integrationStatus.configured) {
    return NextResponse.json(
      {
        ok: false,
        integration: 'supabase',
        configured: false,
        missingKeys: integrationStatus.missingKeys,
      },
      { status: 503 },
    );
  }

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
      integration: 'supabase',
      configured: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
