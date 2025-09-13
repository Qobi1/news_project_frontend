import { NewsArticle, NewsArticleData } from '../types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000/';

export function mapApiNewsToArticle(apiNews: NewsArticleData): NewsArticle {
  return {
    id: apiNews.id,
    title: apiNews.title,
    excerpt: apiNews.description,
    content: apiNews.description,
    image: apiNews.image_url,
    category: apiNews.category,
    date: apiNews.datetime_str,
    author: apiNews.location // fallback, since API doesn't provide author
  };
}

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/news/`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data: NewsArticleData[] = await response.json();
    return data.map(mapApiNewsToArticle);
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function fetchNewsData(): Promise<NewsArticleData[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/news/`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data: NewsArticleData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching news data:', error);
    throw error;
  }
}

export async function fetchNewsById(id: number): Promise<NewsArticleData> {
  try {
    const response = await fetch(`${BACKEND_URL}/news/${id}`);
    if (!response.ok) {
      throw new Error('Article not found');
    }
    const data: NewsArticleData = await response.json();
    return {
      ...data,
      datetime_str: data.datetime_iso || data.datetime_str
    };
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw error;
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/categories/`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: string[] = await response.json();
    return ['Все', ...data];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['Все'];
  }
}

export async function fetchNewsByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/filter/?category=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news by category');
    }
    const data: NewsArticleData[] = await response.json();
    return data.map(mapApiNewsToArticle);
  } catch (error) {
    console.error('Error fetching news by category:', error);
    throw error;
  }
}

export function searchNewsLocally(query: string, allNews: NewsArticle[]): NewsArticle[] {
  if (!query.trim()) {
    return allNews;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return allNews.filter(article => {
    // Search in title, excerpt, content, and category
    const title = article.title.toLowerCase();
    const excerpt = article.excerpt.toLowerCase();
    const content = article.content.toLowerCase();
    const category = article.category.toLowerCase();
    const author = article.author.toLowerCase();
    
    return title.includes(searchTerm) ||
           excerpt.includes(searchTerm) ||
           content.includes(searchTerm) ||
           category.includes(searchTerm) ||
           author.includes(searchTerm);
  });
}

// Keep the old function for backward compatibility but make it use local search
export async function searchNews(query: string, allNews?: NewsArticle[]): Promise<NewsArticle[]> {
  // If allNews is provided, use local search
  if (allNews) {
    return searchNewsLocally(query, allNews);
  }
  
  // Fallback: fetch all news and then search locally
  try {
    const allNewsData = await fetchNews();
    return searchNewsLocally(query, allNewsData);
  } catch (error) {
    console.error('Error in search fallback:', error);
    throw error;
  }
}
