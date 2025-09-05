// Server-side meta tag generation for better SEO
// This ensures meta tags are in the initial HTML

export interface ServerSideMetaData {
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

// Generate meta tags HTML string for server-side rendering
export const generateServerSideMetaHTML = (meta: ServerSideMetaData): string => {
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

// Generate JSON-LD HTML string
export const generateServerSideJSONLD = (jsonLd: any): string => {
  return `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`;
};

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Generate article meta data from URL parameters
export const generateArticleMetaFromURL = (): ServerSideMetaData | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  if (!articleId) return null;
  
  return {
    title: `Статья ${articleId} — Новости Иркутска`,
    description: 'Читайте актуальные новости и события Иркутска. Подробная информация о происшествиях, мероприятиях и важных событиях региона.',
    image: '/api/placeholder/1200/630',
    url: `${window.location.origin}/?id=${articleId}`,
    type: 'article',
    siteName: 'Новости Иркутска',
    locale: 'ru_RU',
    author: 'Новости Иркутска',
    keywords: 'новости иркутска, события иркутской области, статья, иркутск'
  };
};

// Generate default meta data
export const generateDefaultMeta = (): ServerSideMetaData => {
  return {
    title: 'Новости Иркутска - Последние новости и события',
    description: 'Актуальные новости Иркутска и Иркутской области. События, мероприятия, происшествия и важные новости региона.',
    image: '/api/placeholder/1200/630',
    url: window.location.origin,
    type: 'website',
    siteName: 'Новости Иркутска',
    locale: 'ru_RU',
    author: 'Новости Иркутска',
    keywords: 'новости иркутска, события иркутской области, последние новости, иркутск'
  };
};
