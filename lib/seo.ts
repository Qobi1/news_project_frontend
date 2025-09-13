import { SEOData, ArticleSEOData, NewsArticleData, EventData } from '../types';

// Default SEO data for the site
export const defaultSEO: SEOData = {
  title: 'Новости Иркутска - Последние новости и события',
  description: 'Актуальные новости Иркутска и Иркутской области. События, мероприятия, происшествия и важные новости региона.',
  keywords: 'новости иркутска, события иркутской области, последние новости, иркутск',
  image: '/api/placeholder/1200/630',
  type: 'website',
  siteName: 'Новости Иркутска',
  locale: 'ru_RU',
  author: 'Новости Иркутска'
};

// Determine if content should be treated as an event
export const isEventContent = (article: NewsArticleData | EventData): boolean => {
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
export const newsArticleToSEOData = (article: NewsArticleData, baseUrl: string): ArticleSEOData => {
  // Extract plain text from HTML description for meta description
  const extractTextFromHTML = (html: string): string => {
    if (typeof window !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }
    // Server-side fallback
    return html.replace(/<[^>]*>/g, '');
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
    url: `${baseUrl}/article/${article.id}`,
    type: isEvent ? 'event' : 'article',
    author: 'Новости Иркутска',
    publishedTime: article.datetime_iso,
    modifiedTime: article.datetime_iso,
    category: article.category,
    tags: [article.category, article.location].filter(Boolean),
    date: article.datetime_iso
  };
};

// Generate JSON-LD structured data for news article
export const generateNewsArticleJSONLD = (article: NewsArticleData, baseUrl: string) => {
  const plainTextDescription = article.description.replace(/<[^>]*>/g, '').substring(0, 200);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": plainTextDescription,
    "image": [
      {
        "@type": "ImageObject",
        "url": article.image_url,
        "width": 1200,
        "height": 630
      }
    ],
    "datePublished": article.datetime_iso,
    "dateModified": article.datetime_iso,
    "author": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": baseUrl,
      "sameAs": []
    },
    "publisher": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.ico`,
        "width": 32,
        "height": 32
      },
      "sameAs": []
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/article/${article.id}`,
      "url": `${baseUrl}/article/${article.id}`
    },
    "articleSection": article.category,
    "keywords": [article.category, article.location, "новости иркутска", "иркутская область"].join(", "),
    "about": {
      "@type": "Place",
      "name": article.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": article.location,
        "addressRegion": "Иркутская область",
        "addressCountry": "RU"
      }
    },
    "mentions": {
      "@type": "Place",
      "name": article.location
    },
    "inLanguage": "ru",
    "isAccessibleForFree": true,
    "genre": "News",
    "wordCount": plainTextDescription.split(' ').length,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".article-content"]
    }
  };
  
  return jsonLd;
};

// Generate JSON-LD structured data for event
export const generateEventJSONLD = (event: EventData, baseUrl: string) => {
  // Extract plain text description
  const extractTextFromHTML = (html: string): string => {
    if (typeof window !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }
    return html.replace(/<[^>]*>/g, '');
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
      "url": `${baseUrl}/article/${event.id}`
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

// Generate JSON-LD structured data for website
export const generateWebsiteJSONLD = (baseUrl: string) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": defaultSEO.siteName,
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
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
