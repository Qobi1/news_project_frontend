// Server-Side Rendering utilities for meta tags
// This ensures meta tags are present in the initial HTML

export interface SSRMetaData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  siteName: string;
  locale: string;
  author: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  keywords?: string;
}

// Default meta data for the site
export const defaultSSRMeta: SSRMetaData = {
  title: 'Новости Иркутска - Последние новости и события',
  description: 'Актуальные новости Иркутска и Иркутской области. События, мероприятия, происшествия и важные новости региона.',
  image: '/api/placeholder/1200/630',
  url: 'https://news.irk.ru',
  type: 'website',
  siteName: 'Новости Иркутска',
  locale: 'ru_RU',
  author: 'Новости Иркутска',
  keywords: 'новости иркутска, события иркутской области, последние новости, иркутск'
};

// Generate meta tags HTML string
export const generateMetaTagsHTML = (meta: SSRMetaData): string => {
  return `
    <!-- Basic Meta Tags -->
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}">
    <meta name="keywords" content="${escapeHtml(meta.keywords || '')}">
    <meta name="author" content="${escapeHtml(meta.author)}">
    <link rel="canonical" href="${escapeHtml(meta.url)}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:url" content="${escapeHtml(meta.url)}">
    <meta property="og:type" content="${escapeHtml(meta.type)}">
    <meta property="og:site_name" content="${escapeHtml(meta.siteName)}">
    <meta property="og:locale" content="${escapeHtml(meta.locale)}">
    <meta property="og:title" content="${escapeHtml(meta.title)}">
    <meta property="og:description" content="${escapeHtml(meta.description)}">
    <meta property="og:image" content="${escapeHtml(meta.image)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(meta.title)}">
    <meta name="twitter:description" content="${escapeHtml(meta.description)}">
    <meta name="twitter:image" content="${escapeHtml(meta.image)}">
    
    ${meta.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}">` : ''}
    ${meta.modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(meta.modifiedTime)}">` : ''}
    ${meta.category ? `<meta property="article:section" content="${escapeHtml(meta.category)}">` : ''}
  `;
};

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Generate JSON-LD HTML string
export const generateJSONLDHTML = (jsonLd: any): string => {
  return `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`;
};

// Update document head with new meta tags (for client-side updates)
export const updateDocumentHead = (meta: SSRMetaData, jsonLd?: any) => {
  // Update title
  document.title = meta.title;
  
  // Update or create meta tags
  updateMetaTag('description', meta.description);
  updateMetaTag('keywords', meta.keywords || '');
  updateMetaTag('author', meta.author);
  
  // Update canonical URL
  updateLinkTag('canonical', meta.url);
  
  // Update Open Graph tags
  updateMetaTag('og:url', meta.url, true);
  updateMetaTag('og:type', meta.type, true);
  updateMetaTag('og:site_name', meta.siteName, true);
  updateMetaTag('og:locale', meta.locale, true);
  updateMetaTag('og:title', meta.title, true);
  updateMetaTag('og:description', meta.description, true);
  updateMetaTag('og:image', meta.image, true);
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', meta.title);
  updateMetaTag('twitter:description', meta.description);
  updateMetaTag('twitter:image', meta.image);
  
  // Update article-specific tags
  if (meta.publishedTime) {
    updateMetaTag('article:published_time', meta.publishedTime, true);
  }
  if (meta.modifiedTime) {
    updateMetaTag('article:modified_time', meta.modifiedTime, true);
  }
  if (meta.category) {
    updateMetaTag('article:section', meta.category, true);
  }
  
  // Add JSON-LD if provided
  if (jsonLd) {
    const existingScript = document.getElementById('dynamic-jsonld');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'dynamic-jsonld';
    script.textContent = JSON.stringify(jsonLd, null, 2);
    document.head.appendChild(script);
  }
};

// Helper functions for meta tag updates
function updateMetaTag(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector(selector) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    if (property) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}
