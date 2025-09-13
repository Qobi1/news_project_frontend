export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

export interface NewsArticleData {
  id: number;
  original_title: string;
  title: string;
  datetime_str: string;
  datetime_iso: string;
  location: string;
  description: string;
  image_url: string;
  category: string;
}

export interface EventData extends NewsArticleData {
  venue_name?: string;
  address?: {
    street?: string;
    city?: string;
    postal?: string;
    country?: string;
  };
  organizer?: {
    name?: string;
    url?: string;
  };
  performer?: any;
  price_value?: number;
  price_currency?: string;
  availability?: string;
  event_status?: string;
  attendance_mode?: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
}

export interface ArticleSEOData extends SEOData {
  id: number;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
}
