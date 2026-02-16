import { NextRequest, NextResponse } from 'next/server';
import { scrapeUrls, validateUrls } from '@/lib/scraper';
import { analyzeContent } from '@/lib/gemini';
import { saveResearchBrief, getRecentResearchBriefs } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    const validation = validateUrls(urls);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid URLs', details: validation.errors },
        { status: 400 }
      );
    }

    const scrapedContent = await scrapeUrls(urls);

    const successfulScrapes = scrapedContent.filter(sc => sc.content && !sc.error);
    if (successfulScrapes.length === 0) {
      return NextResponse.json(
        { error: 'Could not scrape content from any of the provided URLs' },
        { status: 400 }
      );
    }

    const analysis = await analyzeContent(scrapedContent);

    const brief = await saveResearchBrief({
      urls,
      ...analysis,
    });

    return NextResponse.json({ brief }, { status: 201 });
  } catch (error: any) {
    console.error('Error processing research brief:', error);
    return NextResponse.json(
      { error: 'Failed to process research brief', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    const briefs = await getRecentResearchBriefs(limit);

    return NextResponse.json({ briefs }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching research briefs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research briefs', message: error.message },
      { status: 500 }
    );
  }
}
