import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedContent {
  url: string;
  content: string;
  error?: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    $('header').remove();

    const text = $('body').text();

    const cleaned = text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    const limited = cleaned.substring(0, 6000);

    return {
      url,
      content: limited,
    };
  } catch (error: any) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      url,
      content: '',
      error: error.message,
    };
  }
}

export async function scrapeUrls(urls: string[]): Promise<ScrapedContent[]> {
  const promises = urls.map(url => scrapeUrl(url));
  return await Promise.all(promises);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateUrls(urls: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (urls.length === 0) {
    errors.push('At least one URL is required');
  }

  urls.forEach((url, index) => {
    if (!validateUrl(url)) {
      errors.push(`Invalid URL at line ${index + 1}: ${url}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
