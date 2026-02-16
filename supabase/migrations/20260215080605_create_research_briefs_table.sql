/*
  # Create Research Briefs Table

  1. New Tables
    - `research_briefs`
      - `id` (uuid, primary key) - Unique identifier for each research brief
      - `urls` (text[]) - Array of URLs used to generate the brief
      - `summary` (text) - Main summary of the research
      - `key_points` (text[]) - Array of key points extracted
      - `conflicting_claims` (text[]) - Array of conflicting claims found
      - `what_to_verify` (text[]) - Array of items that need verification
      - `citations` (jsonb) - Array of citation objects with source, snippet, and used_for
      - `topic_tags` (text[]) - Array of topic tags
      - `created_at` (timestamptz) - Timestamp when the brief was created
      - `updated_at` (timestamptz) - Timestamp when the brief was last updated

  2. Security
    - Enable RLS on `research_briefs` table
    - Add policy for public read access (no authentication required for this app)
*/

CREATE TABLE IF NOT EXISTS research_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  urls text[] NOT NULL,
  summary text NOT NULL,
  key_points text[] NOT NULL DEFAULT '{}',
  conflicting_claims text[] NOT NULL DEFAULT '{}',
  what_to_verify text[] NOT NULL DEFAULT '{}',
  citations jsonb NOT NULL DEFAULT '[]',
  topic_tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE research_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read research briefs"
  ON research_briefs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert research briefs"
  ON research_briefs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
