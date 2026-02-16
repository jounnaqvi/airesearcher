import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { testGeminiConnection } from '@/lib/gemini';

export async function GET() {
  const status = {
    backend: {
      status: 'operational',
      timestamp: new Date().toISOString(),
    },
    database: {
      status: 'unknown',
      message: '',
    },
    gemini: {
      status: 'unknown',
      message: '',
    },
  };

  try {
    const { data, error } = await supabase
      .from('research_briefs')
      .select('id')
      .limit(1);

    if (error) {
      status.database.status = 'error';
      status.database.message = error.message;
    } else {
      status.database.status = 'operational';
      status.database.message = 'Connected successfully';
    }
  } catch (error: any) {
    status.database.status = 'error';
    status.database.message = error.message;
  }

  try {
    const geminiTest = await testGeminiConnection();
    status.gemini.status = geminiTest.success ? 'operational' : 'error';
    status.gemini.message = geminiTest.message;
  } catch (error: any) {
    status.gemini.status = 'error';
    status.gemini.message = error.message;
  }

  return NextResponse.json(status, { status: 200 });
}
