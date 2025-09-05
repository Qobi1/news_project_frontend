// Immediate meta tags that work synchronously without API calls
// This ensures meta tags are visible in page source immediately

// This function should be called immediately when the page loads
export const setImmediateMetaTags = () => {
  // Check if we're on an article page
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  if (articleId) {
    // Set immediate meta tags for article page
    setArticleMetaTags(articleId);
  } else {
    // Set default meta tags for home page
    setDefaultMetaTags();
  }
};

// Set meta tags for article page (without API call)
const setArticleMetaTags = (articleId: string) => {
  const title = `Статья ${articleId} — Новости Иркутска`;
  const description = 'Читайте актуальные новости и события Иркутска. Подробная информация о происшествиях, мероприятиях и важных событиях региона.';
  const url = `${window.location.origin}/?id=${articleId}`;
  
  // Update title
  document.title = title;
  
  // Update meta tags
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'keywords', 'новости иркутска, события иркутской области, статья, иркутск');
  updateMetaTag('name', 'author', 'Новости Иркутска');
  
  // Update canonical URL
  updateLinkTag('canonical', url);
  
  // Update Open Graph tags
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('property', 'og:type', 'article');
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
  
  // Add basic JSON-LD
  addBasicArticleJSONLD(articleId, title, description, url);
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

// Add basic JSON-LD for article
const addBasicArticleJSONLD = (articleId: string, title: string, description: string, url: string) => {
  // Remove existing JSON-LD
  const existing = document.getElementById('basic-article-jsonld');
  if (existing) {
    existing.remove();
  }
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description,
    "image": ["/api/placeholder/1200/630"],
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
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
    "articleSection": "Новости",
    "keywords": "новости иркутска, события иркутской области, статья, иркутск",
    "about": {
      "@type": "Place",
      "name": "Иркутск"
    }
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'basic-article-jsonld';
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
