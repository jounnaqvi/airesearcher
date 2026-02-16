
Visit `http://localhost:3000`.

## What Is Done

- URL validation and error handling  
- Content fetching and cleaning  
- Structured JSON response from Gemini  
- Safe JSON parsing  
- Database storage and last 5 history  
- Status monitoring page  
- Secure environment variable usage  

## Limitations

- Some JS-heavy sites may not return full content  
- No authentication system  
- No PDF export  
- Basic rate limiting only  

## Deployment

Designed to be deployed on Vercel with environment variables configured in the dashboard.

---




# Research Brief Builder

Research Brief Builder is a full-stack web application that generates structured research briefs from 5–10 URLs using the Gemini API and stores results in Supabase.

## Overview

This app allows users to paste multiple article, blog, or documentation links. The backend fetches and cleans readable content from each source, sends it to the Gemini model, and generates a structured research brief containing:

- Summary  
- Key Points  
- Conflicting Claims  
- “What to Verify” checklist  
- Citations (source + snippet)  
- Topic Tags  

The last 5 research briefs are saved and can be viewed from the history section. A `/status` page shows backend, database, and LLM health.

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Supabase (PostgreSQL)
- Gemini API (preview model)
- Axios + Cheerio (content fetching & parsing)

## How to Run Locally

1. Clone the repository:


Author: Jaun Naqvi