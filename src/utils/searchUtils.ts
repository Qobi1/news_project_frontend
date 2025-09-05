// Advanced search utilities for the news website
// Provides search functionality with debouncing, highlighting, and analytics

export interface SearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  highlightResults?: boolean;
  searchFields?: string[];
}

export interface SearchResult {
  article: any;
  score: number;
  highlights: string[];
  matchedFields: string[];
}

export interface SearchAnalytics {
  query: string;
  resultsCount: number;
  searchTime: number;
  timestamp: Date;
}

// Default search options
const DEFAULT_OPTIONS: SearchOptions = {
  debounceMs: 300,
  minQueryLength: 2,
  maxResults: 100,
  highlightResults: true,
  searchFields: ['title', 'excerpt', 'content', 'category', 'author']
};

// Search analytics storage
let searchAnalytics: SearchAnalytics[] = [];

// Debounce utility for search input
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Advanced search function with scoring and highlighting
export const performAdvancedSearch = (
  articles: any[],
  query: string,
  options: SearchOptions = {}
): SearchResult[] => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startTime = Date.now();
  
  if (!query || query.length < opts.minQueryLength!) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);
  
  const results: SearchResult[] = [];

  articles.forEach(article => {
    let score = 0;
    const highlights: string[] = [];
    const matchedFields: string[] = [];

    // Search in each field
    opts.searchFields!.forEach(field => {
      const fieldValue = article[field] || '';
      const normalizedFieldValue = fieldValue.toLowerCase();
      
      // Exact match gets highest score
      if (normalizedFieldValue.includes(normalizedQuery)) {
        score += 10;
        matchedFields.push(field);
        
        if (opts.highlightResults) {
          highlights.push(highlightText(fieldValue, query));
        }
      }
      
      // Word-by-word matching
      queryWords.forEach(word => {
        if (normalizedFieldValue.includes(word)) {
          score += 2;
          if (!matchedFields.includes(field)) {
            matchedFields.push(field);
          }
          
          if (opts.highlightResults && !highlights.some(h => h.includes(word))) {
            highlights.push(highlightText(fieldValue, word));
          }
        }
      });
    });

    // Boost score for title matches
    if (matchedFields.includes('title')) {
      score += 5;
    }

    // Boost score for category matches
    if (matchedFields.includes('category')) {
      score += 3;
    }

    if (score > 0) {
      results.push({
        article,
        score,
        highlights,
        matchedFields
      });
    }
  });

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  // Limit results
  const limitedResults = results.slice(0, opts.maxResults);

  // Record analytics
  const searchTime = Date.now() - startTime;
  recordSearchAnalytics({
    query,
    resultsCount: limitedResults.length,
    searchTime,
    timestamp: new Date()
  });

  return limitedResults;
};

// Highlight search terms in text
export const highlightText = (text: string, query: string): string => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
};

// Escape special regex characters
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Record search analytics
export const recordSearchAnalytics = (analytics: SearchAnalytics): void => {
  searchAnalytics.push(analytics);
  
  // Keep only last 100 searches
  if (searchAnalytics.length > 100) {
    searchAnalytics = searchAnalytics.slice(-100);
  }
};

// Get search analytics
export const getSearchAnalytics = (): SearchAnalytics[] => {
  return [...searchAnalytics];
};

// Get popular search terms
export const getPopularSearchTerms = (limit: number = 10): Array<{term: string, count: number}> => {
  const termCounts: {[key: string]: number} = {};
  
  searchAnalytics.forEach(analytics => {
    const term = analytics.query.toLowerCase();
    termCounts[term] = (termCounts[term] || 0) + 1;
  });

  return Object.entries(termCounts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Search suggestions based on article titles and categories
export const generateSearchSuggestions = (
  articles: any[],
  query: string,
  limit: number = 5
): string[] => {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase();
  const suggestions = new Set<string>();

  articles.forEach(article => {
    // Add title words that start with query
    const titleWords = article.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.startsWith(normalizedQuery) && word.length > normalizedQuery.length) {
        suggestions.add(word);
      }
    });

    // Add category if it matches
    if (article.category.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(article.category);
    }
  });

  return Array.from(suggestions).slice(0, limit);
};

// Validate search query
export const validateSearchQuery = (query: string): {isValid: boolean, error?: string} => {
  if (!query || query.trim().length === 0) {
    return { isValid: false, error: 'Поисковый запрос не может быть пустым' };
  }

  if (query.trim().length < 2) {
    return { isValid: false, error: 'Поисковый запрос должен содержать минимум 2 символа' };
  }

  if (query.length > 100) {
    return { isValid: false, error: 'Поисковый запрос слишком длинный' };
  }

  // Check for potentially harmful characters
  const dangerousChars = /[<>'"&]/;
  if (dangerousChars.test(query)) {
    return { isValid: false, error: 'Поисковый запрос содержит недопустимые символы' };
  }

  return { isValid: true };
};

// Format search results for display
export const formatSearchResults = (results: SearchResult[]): any[] => {
  return results.map(result => ({
    ...result.article,
    searchScore: result.score,
    searchHighlights: result.highlights,
    matchedFields: result.matchedFields
  }));
};

// Search history management
export const addToSearchHistory = (query: string): void => {
  const history = getSearchHistory();
  const newHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
};

export const getSearchHistory = (): string[] => {
  try {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

export const clearSearchHistory = (): void => {
  localStorage.removeItem('searchHistory');
};

// Export default options for easy access
export { DEFAULT_OPTIONS };
