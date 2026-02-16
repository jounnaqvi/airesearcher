import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScrapedContent } from './scraper';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// List of model names to try in order (newest first)
const MODEL_NAMES = [
  'gemini-3-flash-preview',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-pro',
  'gemini-2.0-flash-exp',
  'gemini-1.5-pro-latest',
];

export interface GeminiResponse {
  summary: string;
  key_points: string[];
  conflicting_claims: string[];
  what_to_verify: string[];
  citations: {
    source: string;
    snippet: string;
    used_for: string;
  }[];
  topic_tags: string[];
}

export async function analyzeContent(scrapedContent: ScrapedContent[]): Promise<GeminiResponse> {
  const successfulScrapes = scrapedContent.filter(sc => sc.content && !sc.error);

  if (successfulScrapes.length === 0) {
    throw new Error('No content could be scraped from the provided URLs');
  }

  const combinedContent = successfulScrapes
    .map(sc => `Source: ${sc.url}\n\n${sc.content}`)
    .join('\n\n---\n\n');

  const prompt = `You are a research assistant. Analyze the following content from multiple sources and create a comprehensive research brief.

${combinedContent}

You MUST respond with ONLY valid JSON in this exact format (no markdown, no code blocks, no additional text):

{
  "summary": "A comprehensive summary of the main topic and findings",
  "key_points": ["Array of key points extracted from the sources"],
  "conflicting_claims": ["Array of any conflicting information found between sources"],
  "what_to_verify": ["Array of claims or information that should be independently verified"],
  "citations": [
    {
      "source": "URL of the source",
      "snippet": "Relevant quote or information from the source",
      "used_for": "What this citation supports in the research"
    }
  ],
  "topic_tags": ["Array of relevant topic tags"]
}

Respond with ONLY the JSON object. Do not include any other text, markdown formatting, or code blocks.`;

  // Try each model until one works
  let lastError: any;
  
  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      let cleanedText = text.trim();

      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      cleanedText = cleanedText.trim();

      const parsed = JSON.parse(cleanedText) as GeminiResponse;

      if (!parsed.summary || !Array.isArray(parsed.key_points) || !Array.isArray(parsed.citations)) {
        throw new Error('Invalid response structure from Gemini');
      }

      return parsed;
    } catch (error: any) {
      lastError = error;
      // If it's a 404 or "not found" error, try next model
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('is not found')) {
        console.log(`Model ${modelName} not available, trying next model...`);
        continue;
      }
      // For other errors (like JSON parsing), throw immediately
      console.error('Error analyzing content with Gemini:', error);
      throw new Error(`Failed to analyze content: ${error.message}`);
    }
  }
  
  // If we've tried all models and none worked
  throw new Error(`Failed to find available Gemini model. Last error: ${lastError?.message || 'Unknown error'}`);
}

export async function testGeminiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    
    let model;
    let workingModelName = '';
    
    for (const modelName of MODEL_NAMES) {
      try {
        model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "OK" if you can read this.');
        const response = result.response;
        const text = response.text();
        workingModelName = modelName;
        
        return {
          success: true,
          message: `Gemini API connected successfully using ${modelName}. Response: ${text}`,
        };
      } catch (error: any) {
        // If it's a 404, try next model
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          continue;
        }
        // For other errors, throw immediately
        throw error;
      }
    }
    
    return {
      success: false,
      message: 'No available Gemini model found. Please check your API key and model availability.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Gemini API error: ${error.message}`,
    };
  }
}
