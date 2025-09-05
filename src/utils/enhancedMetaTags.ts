// Enhanced meta tags that update with real article data
// This runs after the article data is fetched

export const updateMetaTagsForArticle = (article: any) => {
  // Extract plain text from HTML description
  const extractTextFromHTML = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const plainTextDescription = extractTextFromHTML(article.description);
  const metaDescription = plainTextDescription.length > 160 
    ? plainTextDescription.substring(0, 160) + '...' 
    : plainTextDescription;

  const title = `${article.title} — ${article.location}, ${article.datetime_str}`;
  const url = `${window.location.origin}/?id=${article.id}`;

  // Update title
  document.title = title;
  
  // Update meta tags
  updateMetaTag('name', 'description', metaDescription);
  updateMetaTag('name', 'keywords', [article.category, article.location, 'новости иркутска'].join(', '));
  updateMetaTag('name', 'author', 'Новости Иркутска');
  
  // Update canonical URL
  updateLinkTag('canonical', url);
  
  // Update Open Graph tags
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('property', 'og:type', 'article');
  updateMetaTag('property', 'og:site_name', 'Новости Иркутска');
  updateMetaTag('property', 'og:locale', 'ru_RU');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', metaDescription);
  updateMetaTag('property', 'og:image', article.image_url);
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '630');
  
  // Update Twitter Card tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', metaDescription);
  updateMetaTag('name', 'twitter:image', article.image_url);
  
  // Update article-specific tags
  updateMetaTag('property', 'article:published_time', article.datetime_iso);
  updateMetaTag('property', 'article:modified_time', article.datetime_iso);
  updateMetaTag('property', 'article:section', article.category);
  
  // Add enhanced JSON-LD
  addEnhancedArticleJSONLD(article, url);
};

// Helper function to update or create meta tags
const updateMetaTag = (attribute: string, name: string, content: string) => {
  const selector = `meta[${attribute}="${name}"]`;
  let meta = document.querySelector(selector) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

// Helper function to update or create link tags
const updateLinkTag = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
};

// Add enhanced JSON-LD for article
const addEnhancedArticleJSONLD = (article: any, url: string) => {
  // Remove existing JSON-LD
  const existing = document.getElementById('enhanced-article-jsonld');
  if (existing) {
    existing.remove();
  }
  
  const extractTextFromHTML = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const plainTextDescription = extractTextFromHTML(article.description);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": plainTextDescription.substring(0, 200),
    "image": [article.image_url],
    "datePublished": article.datetime_iso,
    "dateModified": article.datetime_iso,
    "author": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": window.location.origin
    },
    "publisher": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": window.location.origin
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": article.category,
    "keywords": [article.category, article.location, "новости иркутска"].join(", "),
    "about": {
      "@type": "Place",
      "name": article.location
    }
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'enhanced-article-jsonld';
  script.textContent = JSON.stringify(jsonLd, null, 2);
  document.head.appendChild(script);
};
