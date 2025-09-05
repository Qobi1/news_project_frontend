// Initial meta tags setup that runs before React hydration
// This ensures meta tags are visible in page source

// This function should be called immediately when the page loads
export const initializeMetaTags = () => {
  // Check if we're on an article page
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  if (articleId) {
    // Try to get article data from localStorage first (if available)
    const cachedArticle = getCachedArticle(articleId);
    if (cachedArticle) {
      updateMetaTagsForArticle(cachedArticle);
    }
    
    // Then fetch fresh data and update
    fetchArticleAndUpdateMetaTags(articleId);
  } else {
    // Set default meta tags for home page
    setDefaultMetaTags();
  }
};

// Get cached article data from localStorage
const getCachedArticle = (articleId: string) => {
  try {
    const cached = localStorage.getItem(`article_${articleId}`);
    if (cached) {
      const article = JSON.parse(cached);
      // Check if cache is not too old (1 hour)
      const cacheTime = article.cacheTime || 0;
      const now = Date.now();
      if (now - cacheTime < 3600000) { // 1 hour
        return article;
      }
    }
  } catch (error) {
    console.error('Error reading cached article:', error);
  }
  return null;
};

// Fetch article data and update meta tags
const fetchArticleAndUpdateMetaTags = async (articleId: string) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/news/${encodeURIComponent(articleId)}`);
    
    if (response.ok) {
      const article = await response.json();
      
      // Cache the article data
      try {
        const articleWithCache = {
          ...article,
          cacheTime: Date.now()
        };
        localStorage.setItem(`article_${articleId}`, JSON.stringify(articleWithCache));
      } catch (cacheError) {
        console.warn('Could not cache article:', cacheError);
      }
      
      updateMetaTagsForArticle(article);
    } else {
      setDefaultMetaTags();
    }
  } catch (error) {
    console.error('Error fetching article:', error);
    setDefaultMetaTags();
  }
};

// Update meta tags for a specific article
const updateMetaTagsForArticle = (article: any) => {
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
  
  // Add JSON-LD structured data
  addArticleJSONLD(article, url);
};

// Set default meta tags for home page
const setDefaultMetaTags = () => {
  const title = 'Новости Иркутска - Последние новости и события';
  const description = 'Актуальные новости Иркутска и Иркутской области. События, мероприятия, происшествия и важные новости региона.';
  const url = window.location.origin;
  
  // Update title
  document.title = title;
  
  // Update meta tags
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'keywords', 'новости иркутска, события иркутской области, последние новости, иркутск');
  updateMetaTag('name', 'author', 'Новости Иркутска');
  
  // Update canonical URL
  updateLinkTag('canonical', url);
  
  // Update Open Graph tags
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('property', 'og:type', 'website');
  updateMetaTag('property', 'og:site_name', 'Новости Иркутска');
  updateMetaTag('property', 'og:locale', 'ru_RU');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:image', '/api/placeholder/1200/630');
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '630');
  
  // Update Twitter Card tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', '/api/placeholder/1200/630');
  
  // Add website JSON-LD
  addWebsiteJSONLD();
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

// Add JSON-LD for article
const addArticleJSONLD = (article: any, url: string) => {
  // Remove existing JSON-LD
  const existing = document.getElementById('article-jsonld');
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
  script.id = 'article-jsonld';
  script.textContent = JSON.stringify(jsonLd, null, 2);
  document.head.appendChild(script);
};

// Add JSON-LD for website
const addWebsiteJSONLD = () => {
  // Remove existing JSON-LD
  const existing = document.getElementById('website-jsonld');
  if (existing) {
    existing.remove();
  }
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Новости Иркутска",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'website-jsonld';
  script.textContent = JSON.stringify(jsonLd, null, 2);
  document.head.appendChild(script);
};
