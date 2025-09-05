// SEO utility functions for dynamic meta tag management

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
  // Additional fields that might be available for events
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

// Default SEO data for the site
export const defaultSEO: SEOData = {
  title: 'Новости Иркутска - Последние новости и события',
  description: 'Актуальные новости Иркутска и Иркутской области. События, мероприятия, происшествия и важные новости региона.',
  keywords: 'новости иркутска, события иркутской области, последние новости, иркутск',
  image: '/api/placeholder/1200/630',
  url: window.location.origin,
  type: 'website',
  siteName: 'Новости Иркутска',
  locale: 'ru_RU',
  author: 'Новости Иркутска'
};

// Update document title
export const updateTitle = (title: string) => {
  document.title = title;
};

// Update meta tag content
export const updateMetaTag = (name: string, content: string, property?: boolean) => {
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
};

// Update link tag
export const updateLinkTag = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
};

// Update all SEO meta tags
export const updateSEO = (seoData: SEOData) => {
  // Basic meta tags
  updateTitle(seoData.title);
  updateMetaTag('description', seoData.description);
  if (seoData.keywords) {
    updateMetaTag('keywords', seoData.keywords);
  }
  if (seoData.author) {
    updateMetaTag('author', seoData.author);
  }
  
  // Canonical URL
  if (seoData.url) {
    updateLinkTag('canonical', seoData.url);
  }
  
  // Open Graph meta tags
  updateMetaTag('og:title', seoData.title, true);
  updateMetaTag('og:description', seoData.description, true);
  updateMetaTag('og:type', seoData.type || 'website', true);
  updateMetaTag('og:image', seoData.image || defaultSEO.image, true);
  updateMetaTag('og:url', seoData.url || window.location.href, true);
  updateMetaTag('og:site_name', seoData.siteName || defaultSEO.siteName, true);
  updateMetaTag('og:locale', seoData.locale || defaultSEO.locale, true);
  
  // Twitter Card meta tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', seoData.title);
  updateMetaTag('twitter:description', seoData.description);
  updateMetaTag('twitter:image', seoData.image || defaultSEO.image);
  
  // Additional meta tags for articles
  if (seoData.publishedTime) {
    updateMetaTag('article:published_time', seoData.publishedTime, true);
  }
  if (seoData.modifiedTime) {
    updateMetaTag('article:modified_time', seoData.modifiedTime, true);
  }
  if (seoData.author) {
    updateMetaTag('article:author', seoData.author, true);
  }
  if (seoData.category) {
    updateMetaTag('article:section', seoData.category, true);
  }
  if (seoData.tags && seoData.tags.length > 0) {
    seoData.tags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'article:tag');
      meta.setAttribute('content', tag);
      document.head.appendChild(meta);
    });
  }
};

// Generate JSON-LD structured data for news article
export const generateNewsArticleJSONLD = (article: NewsArticleData, baseUrl: string = window.location.origin) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.description.replace(/<[^>]*>/g, '').substring(0, 200),
    "image": [article.image_url],
    "datePublished": article.datetime_iso,
    "dateModified": article.datetime_iso,
    "author": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.ico`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/?id=${article.id}`
    },
    "articleSection": article.category,
    "keywords": [article.category, article.location, "новости иркутска"].join(", "),
    "about": {
      "@type": "Place",
      "name": article.location
    },
    "mentions": {
      "@type": "Place",
      "name": article.location
    }
  };
  
  return jsonLd;
};

// Generate JSON-LD structured data for event
export const generateEventJSONLD = (event: EventData, baseUrl: string = window.location.origin) => {
  // Extract plain text description
  const extractTextFromHTML = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const plainTextDescription = extractTextFromHTML(event.description);
  
  // Build location object
  const locationObj: any = {
    "@type": "Place",
    "name": event.venue_name || event.location
  };

  // Add address if available
  if (event.address) {
    locationObj.address = {
      "@type": "PostalAddress",
      "addressLocality": event.address.city || event.location,
      "addressCountry": event.address.country || "RU"
    };
    
    if (event.address.street) {
      locationObj.address.streetAddress = event.address.street;
    }
    if (event.address.postal) {
      locationObj.address.postalCode = event.address.postal;
    }
  }

  // Build organizer object
  const organizerObj: any = {
    "@type": "Organization",
    "name": event.organizer?.name || "Новости Иркутска",
    "url": event.organizer?.url || baseUrl
  };

  // Build offers object if price information is available
  let offersObj = null;
  if (event.price_value !== undefined) {
    offersObj = {
      "@type": "Offer",
      "price": event.price_value.toString(),
      "priceCurrency": event.price_currency || "RUB",
      "availability": `https://schema.org/${event.availability || "InStock"}`,
      "url": `${baseUrl}/?id=${event.id}`
    };
  }

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": plainTextDescription.substring(0, 200),
    "image": [event.image_url],
    "startDate": event.datetime_iso,
    "endDate": event.datetime_iso, // Use same date if no end date provided
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": locationObj,
    "organizer": organizerObj
  };

  // Add performer if available
  if (event.performer) {
    jsonLd.performer = event.performer;
  }

  // Add offers if available
  if (offersObj) {
    jsonLd.offers = offersObj;
  }

  return jsonLd;
};

// Generate JSON-LD structured data for article (legacy)
export const generateArticleJSONLD = (article: ArticleSEOData) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": [article.image || defaultSEO.image],
    "datePublished": article.publishedTime || article.date,
    "dateModified": article.modifiedTime || article.date,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": defaultSEO.siteName,
      "url": window.location.origin
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url || window.location.href
    },
    "articleSection": article.category,
    "wordCount": article.content.split(' ').length
  };
  
  return jsonLd;
};

// Generate JSON-LD structured data for website
export const generateWebsiteJSONLD = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": defaultSEO.siteName,
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  
  return jsonLd;
};

// Generate JSON-LD structured data for breadcrumbs
export const generateBreadcrumbJSONLD = (breadcrumbs: Array<{name: string, url: string}>) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  
  return jsonLd;
};

// Add JSON-LD script to document head
export const addJSONLD = (jsonLd: any, id?: string) => {
  // Remove existing JSON-LD with same id
  if (id) {
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
  }
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  if (id) {
    script.id = id;
  }
  document.head.appendChild(script);
};

// Remove JSON-LD script by id
export const removeJSONLD = (id: string) => {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
};

// Determine if content should be treated as an event
export const isEventContent = (article: NewsArticleData | EventData): boolean => {
  // Check if it has event-like characteristics
  const eventKeywords = ['событие', 'мероприятие', 'концерт', 'выставка', 'семинар', 'мастер-класс', 'лекция', 'практика', 'йога', 'тренинг'];
  const category = article.category?.toLowerCase() || '';
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  
  return eventKeywords.some(keyword => 
    category.includes(keyword) || 
    title.includes(keyword) || 
    description.includes(keyword)
  );
};

// Convert news article data to SEO data
export const newsArticleToSEOData = (article: NewsArticleData, baseUrl: string = window.location.origin): ArticleSEOData => {
  // Extract plain text from HTML description for meta description
  const extractTextFromHTML = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const plainTextDescription = extractTextFromHTML(article.description);
  const metaDescription = plainTextDescription.length > 160 
    ? plainTextDescription.substring(0, 160) + '...' 
    : plainTextDescription;

  // Determine if this is event content for better title formatting
  const isEvent = isEventContent(article);
  const titleFormat = isEvent 
    ? `${article.title} — ${article.location}, ${article.datetime_str}`
    : `${article.title} — ${article.location}, ${article.datetime_str}`;

  return {
    id: article.id,
    title: titleFormat,
    description: metaDescription,
    content: article.description,
    excerpt: plainTextDescription,
    image: article.image_url || defaultSEO.image,
    url: `${baseUrl}/?id=${article.id}`,
    type: isEvent ? 'event' : 'article',
    author: 'Новости Иркутска',
    publishedTime: article.datetime_iso,
    modifiedTime: article.datetime_iso,
    category: article.category,
    tags: [article.category, article.location].filter(Boolean)
  };
};

// Convert article data to SEO data (legacy support)
export const articleToSEOData = (article: any, baseUrl: string = window.location.origin): ArticleSEOData => {
  return {
    id: article.id,
    title: `${article.title} — Новости Иркутска`,
    description: article.excerpt || article.description || article.content?.substring(0, 160) + '...',
    content: article.content || article.description || '',
    excerpt: article.excerpt || article.description || '',
    image: article.image || article.image_url || defaultSEO.image,
    url: `${baseUrl}/?id=${article.id}`,
    type: 'article',
    author: 'Новости Иркутска',
    publishedTime: article.date || new Date().toISOString(),
    modifiedTime: article.date || new Date().toISOString(),
    category: article.category || 'Новости',
    tags: [article.category].filter(Boolean)
  };
};

