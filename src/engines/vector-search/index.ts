import { getRegistry, RegistrySkill } from '../../core/registry/index.js';

export interface SearchResult {
  skill: RegistrySkill;
  score: number;
}

// Minimal stop words for basic TF-IDF
const STOP_WORDS = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'for', 'to', 'in', 'of', 'with']);

// Basic semantic synonym expansion map
const SYNONYMS: Record<string, string[]> = {
  'deploy': ['push', 'release', 'upload', 'host'],
  'ai': ['llm', 'ml', 'machine learning', 'artificial intelligence', 'model'],
  'api': ['backend', 'rest', 'graphql', 'endpoint', 'server'],
  'frontend': ['ui', 'react', 'nextjs', 'web'],
  'database': ['sql', 'postgres', 'mongo', 'db']
};

const tokenize = (text: string): string[] => {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
};

const expandQuery = (tokens: string[]): string[] => {
  const expanded = [...tokens];
  for (const token of tokens) {
    if (SYNONYMS[token]) {
      expanded.push(...SYNONYMS[token]);
    }
  }
  return expanded;
};

// Extremely basic TF-IDF scoring (Term Frequency only for now, sufficient for small registries)
const calculateScore = (queryTokens: string[], docTokens: string[]): number => {
  let score = 0;
  for (const q of queryTokens) {
    for (const d of docTokens) {
      if (d === q) score += 1;
      else if (d.includes(q) || q.includes(d)) score += 0.5; // partial match
    }
  }
  return score;
};

export const searchSemantic = async (query: string): Promise<SearchResult[]> => {
  const registry = await getRegistry();
  const rawQueryTokens = tokenize(query);
  const queryTokens = expandQuery(rawQueryTokens);

  const results: SearchResult[] = [];

  for (const skill of registry) {
    const docText = `${skill.name} ${skill.description} ${skill.tags.join(' ')}`;
    const docTokens = tokenize(docText);
    
    const score = calculateScore(queryTokens, docTokens);
    if (score > 0) {
      // Bonus score for exact tag matches
      let finalScore = score;
      for (const tag of skill.tags) {
        if (queryTokens.includes(tag.toLowerCase())) {
          finalScore += 2;
        }
      }

      results.push({ skill, score: finalScore });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
};
