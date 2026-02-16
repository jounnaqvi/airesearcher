import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ResearchBrief {
  id: string;
  urls: string[];
  summary: string;
  key_points: string[];
  conflicting_claims: string[];
  what_to_verify: string[];
  citations: Citation[];
  topic_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Citation {
  source: string;
  snippet: string;
  used_for: string;
}

export interface ResearchBriefInput {
  urls: string[];
  summary: string;
  key_points: string[];
  conflicting_claims: string[];
  what_to_verify: string[];
  citations: Citation[];
  topic_tags: string[];
}

export async function saveResearchBrief(data: ResearchBriefInput): Promise<ResearchBrief | null> {
  const { data: brief, error } = await supabase
    .from('research_briefs')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error saving research brief:', error);
    throw new Error('Failed to save research brief');
  }

  return brief;
}

export async function getResearchBrief(id: string): Promise<ResearchBrief | null> {
  const { data, error } = await supabase
    .from('research_briefs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching research brief:', error);
    return null;
  }

  return data;
}

export async function getRecentResearchBriefs(limit: number = 5): Promise<ResearchBrief[]> {
  const { data, error } = await supabase
    .from('research_briefs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent research briefs:', error);
    return [];
  }

  return data || [];
}
