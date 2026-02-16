import { NextRequest, NextResponse } from 'next/server';
import { getResearchBrief } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const brief = await getResearchBrief(id);

    if (!brief) {
      return NextResponse.json(
        { error: 'Research brief not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ brief }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching research brief:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research brief', message: error.message },
      { status: 500 }
    );
  }
}
