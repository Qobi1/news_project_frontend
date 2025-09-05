# SEO Implementation for News Website

## Overview
This implementation provides comprehensive SEO optimization for the news website, including dynamic meta tags, structured data, and social media optimization based on the backend API data.

## Features Implemented

### 1. Dynamic Meta Tags
- **Title**: Dynamically generated based on article title, location, and date
- **Meta Description**: Extracted from article content, truncated to 160 characters
- **Keywords**: Generated from article category and location
- **Author**: Set to "Новости Иркутска" for all articles
- **Canonical URL**: Dynamic URLs for each article

### 2. Open Graph Meta Tags
- `og:title`: Article title with location and date
- `og:description`: Article description
- `og:image`: Article image URL
- `og:type`: Set to "article" for news articles
- `og:url`: Canonical URL for the article
- `og:site_name`: "Новости Иркутска"
- `og:locale`: "ru_RU"

### 3. Twitter Card Meta Tags
- `twitter:card`: "summary_large_image"
- `twitter:title`: Article title
- `twitter:description`: Article description
- `twitter:image`: Article image URL

### 4. JSON-LD Structured Data

#### News Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article Title",
  "description": "Article description",
  "image": ["image_url"],
  "datePublished": "2025-09-02T19:00:00",
  "dateModified": "2025-09-02T19:00:00",
  "author": {
    "@type": "Organization",
    "name": "Новости Иркутска"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Новости Иркутска",
    "url": "https://news.irk.ru"
  },
  "articleSection": "Category",
  "keywords": "category, location, новости иркутска",
  "about": {
    "@type": "Place",
    "name": "Location"
  }
}
```

#### Breadcrumb Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://news.irk.ru"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://news.irk.ru/?category=Category"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://news.irk.ru/?id=1"
    }
  ]
}
```

#### Website Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Новости Иркутска",
  "url": "https://news.irk.ru",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://news.irk.ru/?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## File Structure

### Core Files
- `src/seo.ts` - SEO utility functions and interfaces
- `src/SEOHead.tsx` - React component for managing SEO meta tags
- `src/App.tsx` - Main application with SEO integration
- `index.html` - Base HTML template with default meta tags

### Key Functions

#### `newsArticleToSEOData(article, baseUrl)`
Converts backend article data to SEO-optimized format:
- Extracts plain text from HTML description
- Generates meta description (160 chars max)
- Creates SEO-friendly title with location and date
- Sets up proper URLs and metadata

#### `updateSEO(seoData)`
Updates all meta tags in the document head:
- Basic meta tags (title, description, keywords, author)
- Open Graph tags
- Twitter Card tags
- Canonical URL

#### `generateNewsArticleJSONLD(article, baseUrl)`
Creates comprehensive JSON-LD structured data for news articles:
- NewsArticle schema type
- Proper date formatting
- Location and category information
- Publisher and author details

## Usage

### Environment Variables
Set `VITE_BACKEND_URL` in your environment to specify the backend URL:
```bash
VITE_BACKEND_URL=http://localhost:8000
```

### Backend API Requirements
The implementation expects the backend to provide articles with the following structure:
```typescript
interface NewsArticleData {
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
```

### SEO Component Usage
```tsx
// For article pages
<SEOHead article={articleData} isArticle={true} />

// For home page
<SEOHead isArticle={false} />
```

## SEO Benefits

### Search Engine Optimization
1. **Dynamic Titles**: Each article gets a unique, descriptive title
2. **Meta Descriptions**: Automatically generated from article content
3. **Structured Data**: Rich snippets in search results
4. **Canonical URLs**: Prevents duplicate content issues
5. **Breadcrumbs**: Improved site navigation understanding

### Social Media Optimization
1. **Open Graph**: Proper previews on Facebook, LinkedIn
2. **Twitter Cards**: Enhanced Twitter sharing
3. **Image Optimization**: Proper image dimensions and URLs

### Performance
1. **Dynamic Updates**: SEO tags update without page reload
2. **Memory Management**: Proper cleanup of JSON-LD scripts
3. **Error Handling**: Graceful fallbacks for missing data

## Testing

### Manual Testing
1. Open browser dev tools
2. Navigate to an article page
3. Check the `<head>` section for:
   - Updated title tag
   - Meta description
   - Open Graph tags
   - JSON-LD structured data

### SEO Testing Tools
- Google Rich Results Test
- Facebook Sharing Debugger
- Twitter Card Validator
- Schema.org Validator

## Maintenance

### Adding New Meta Tags
1. Update the `SEOData` interface in `seo.ts`
2. Add the tag update logic in `updateSEO` function
3. Update the `newsArticleToSEOData` function if needed

### Modifying Structured Data
1. Update the JSON-LD generation functions
2. Test with Schema.org validator
3. Ensure backward compatibility

## Best Practices Implemented

1. **Title Length**: Kept under 60 characters for optimal display
2. **Meta Description**: Limited to 160 characters
3. **Image Dimensions**: Proper Open Graph image dimensions (1200x630)
4. **Language Tags**: Proper locale settings (ru_RU)
5. **Canonical URLs**: Unique URLs for each article
6. **Structured Data**: Valid JSON-LD format
7. **Error Handling**: Graceful fallbacks for missing data
8. **Performance**: Efficient DOM manipulation
