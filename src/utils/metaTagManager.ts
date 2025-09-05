// Meta tag management utility that ensures tags are visible in page source
// This works by updating the initial HTML before React hydration

export interface MetaTagData {
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

// Default meta data
export const defaultMetaData: MetaTagData = {
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

// Update meta tags in the document head
export const updateMetaTags = (meta: MetaTagData) => {
  // Update title
  document.title = meta.title;
  
  // Update or create meta tags
  updateOrCreateMetaTag('name', 'description', meta.description);
  updateOrCreateMetaTag('name', 'keywords', meta.keywords || '');
  updateOrCreateMetaTag('name', 'author', meta.author);
  
  // Update canonical URL
  updateOrCreateLinkTag('canonical', meta.url);
  
  // Update Open Graph tags
  updateOrCreateMetaTag('property', 'og:url', meta.url);
  updateOrCreateMetaTag('property', 'og:type', meta.type);
  updateOrCreateMetaTag('property', 'og:site_name', meta.siteName);
  updateOrCreateMetaTag('property', 'og:locale', meta.locale);
  updateOrCreateMetaTag('property', 'og:title', meta.title);
  updateOrCreateMetaTag('property', 'og:description', meta.description);
  updateOrCreateMetaTag('property', 'og:image', meta.image);
  updateOrCreateMetaTag('property', 'og:image:width', '1200');
  updateOrCreateMetaTag('property', 'og:image:height', '630');
  
  // Update Twitter Card tags
  updateOrCreateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateOrCreateMetaTag('name', 'twitter:title', meta.title);
  updateOrCreateMetaTag('name', 'twitter:description', meta.description);
  updateOrCreateMetaTag('name', 'twitter:image', meta.image);
  
  // Update article-specific tags
  if (meta.publishedTime) {
    updateOrCreateMetaTag('property', 'article:published_time', meta.publishedTime);
  }
  if (meta.modifiedTime) {
    updateOrCreateMetaTag('property', 'article:modified_time', meta.modifiedTime);
  }
  if (meta.category) {
    updateOrCreateMetaTag('property', 'article:section', meta.category);
  }
};

// Helper function to update or create meta tags
function updateOrCreateMetaTag(attribute: string, name: string, content: string) {
  const selector = `meta[${attribute}="${name}"]`;
  let meta = document.querySelector(selector) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

// Helper function to update or create link tags
function updateOrCreateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}

// Add JSON-LD structured data
export const addJSONLD = (jsonLd: any, id: string = 'dynamic-jsonld') => {
  // Remove existing JSON-LD with same id
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(jsonLd, null, 2);
  document.head.appendChild(script);
};

// Remove JSON-LD by id
export const removeJSONLD = (id: string) => {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
};

// Convert article data to meta tag data
export const articleToMetaData = (article: any, baseUrl: string = window.location.origin): MetaTagData => {
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

  return {
    title: `${article.title} — ${article.location}, ${article.datetime_str}`,
    description: metaDescription,
    image: article.image_url || defaultMetaData.image,
    url: `${baseUrl}/?id=${article.id}`,
    type: 'article',
    siteName: defaultMetaData.siteName,
    locale: defaultMetaData.locale,
    author: defaultMetaData.author,
    publishedTime: article.datetime_iso,
    modifiedTime: article.datetime_iso,
    category: article.category,
    keywords: [article.category, article.location, 'новости иркутска'].join(', ')
  };
};
