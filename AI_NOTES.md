# AI_NOTES.md

## AI Usage Overview

AI tools were used to assist with architecture planning, prompt design, and debugging. All generated code and prompts were reviewed, tested, and adjusted manually before submission.

## Tools Used

- ChatGPT (architecture planning, prompt refinement, debugging guidance)
- Gemini 3.5 Preview (LLM integration for research brief generation)

## Where AI Was Used

1. Designing the overall project structure (Next.js full-stack with Supabase).
2. Creating and refining the structured JSON response format for research briefs.
3. Crafting a strict prompt to ensure:
   - JSON-only output  
   - Clear citation mapping (source + snippet)  
   - Detection of conflicting claims  
4. Debugging integration issues with the Gemini API.
5. Improving validation and error handling logic.

## What Was Manually Verified

- All API routes tested locally and in production.
- JSON parsing wrapped in try/catch to prevent runtime crashes.
- Supabase inserts and queries verified with real test data.
- Scraping logic tested with multiple real-world URLs.
- Status endpoint tested for backend, database, and LLM health.
- Confirmed no API keys or secrets are committed to the repository.

## LLM Choice

Gemini 3.5 Preview was chosen because it provides strong reasoning and summarization capabilities while being fast and suitable for prototyping structured research outputs.

## Limitations Observed

- Some JavaScript-heavy websites may not return complete content.
- Long articles require truncation to stay within token limits.

AI was used as a development assistant, not as a replacement for understanding. All integrations and logic were verified manually.
